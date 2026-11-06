import { put } from '@vercel/blob';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

/** Stored photos are square WebP images this many pixels wide. */
export const AVATAR_SIZE = 512;

// Refuse to decode absurdly large images (decompression bombs); 50 megapixels is ample for a photo.
const MAX_INPUT_PIXELS = 50_000_000;

/** A Blob store is connected when Vercel provides either a read-write token or a store ID. */
export function isBlobStorageConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}

export class AvatarStorageNotConfiguredError extends Error {
  constructor() {
    super('No Vercel Blob store is connected to this project, so photos cannot be stored.');
    this.name = 'AvatarStorageNotConfiguredError';
  }
}

export class InvalidImageError extends Error {
  constructor() {
    super('The uploaded file is not a readable image.');
    this.name = 'InvalidImageError';
  }
}

export type PhotoFormat = 'jpeg' | 'png' | 'gif' | 'webp';

/**
 * Identify a photo from its first bytes ("magic numbers"), ignoring the type the browser
 * declared. Anything else, including SVG and other formats the decoder could read, is refused.
 */
export function sniffPhotoFormat(bytes: Uint8Array): PhotoFormat | undefined {
  const startsWith = (signature: number[], offset = 0) =>
    signature.every((byte, i) => bytes[offset + i] === byte);
  const ascii = (text: string) => Array.from(text, char => char.charCodeAt(0));

  if (startsWith([0xff, 0xd8, 0xff])) return 'jpeg';
  if (startsWith([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return 'png';
  if (startsWith(ascii('GIF87a')) || startsWith(ascii('GIF89a'))) return 'gif';
  if (startsWith(ascii('RIFF')) && startsWith(ascii('WEBP'), 8)) return 'webp';
  return undefined;
}

/**
 * Re-encode an uploaded photo. The file must really be a JPEG, PNG, GIF or WebP image
 * (whatever type the browser claimed); it is turned upright using its EXIF orientation,
 * cropped to a square and saved as WebP. Re-encoding drops all metadata, including GPS
 * location, camera details and embedded thumbnails.
 */
export async function normalizeAvatar(file: Blob): Promise<Buffer> {
  const input = Buffer.from(await file.arrayBuffer());
  if (!sniffPhotoFormat(input)) {
    throw new InvalidImageError();
  }
  try {
    return await sharp(input, { limitInputPixels: MAX_INPUT_PIXELS })
      .autoOrient()
      .resize(AVATAR_SIZE, AVATAR_SIZE, { fit: 'cover' })
      .webp({ quality: 85 })
      .toBuffer();
  } catch {
    throw new InvalidImageError();
  }
}

/**
 * Re-encode an uploaded photo and store it, returning its public URL. Uses Vercel Blob
 * when a store is connected; otherwise, outside Vercel, saves under public/uploads for
 * local development.
 */
export async function storeAvatar(file: Blob): Promise<string> {
  const image = await normalizeAvatar(file);
  const filename = `${uuidv4()}.webp`;

  if (isBlobStorageConfigured()) {
    const blob = await put(`avatars/${filename}`, image, {
      access: 'public',
      contentType: 'image/webp',
    });
    return blob.url;
  }

  // Vercel's filesystem is read-only, so deployments need a Blob store.
  if (process.env.VERCEL) {
    throw new AvatarStorageNotConfiguredError();
  }

  const directory = join(process.cwd(), 'public', 'uploads');
  await mkdir(directory, { recursive: true });
  await writeFile(join(directory, filename), image);
  return `/uploads/${filename}`;
}
