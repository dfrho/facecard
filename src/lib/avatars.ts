import { put } from '@vercel/blob';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { avatarExtension } from '@/lib/avatar-url';

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

/**
 * Store an uploaded photo and return its public URL. Uses Vercel Blob when a store is
 * connected; otherwise, outside Vercel, saves under public/uploads for local development.
 */
export async function storeAvatar(file: Blob): Promise<string> {
  const extension = avatarExtension(file.type);
  if (!extension) {
    throw new Error(`Unsupported image type: ${file.type}`);
  }
  const filename = `${uuidv4()}.${extension}`;

  if (isBlobStorageConfigured()) {
    const blob = await put(`avatars/${filename}`, file, {
      access: 'public',
      contentType: file.type,
    });
    return blob.url;
  }

  // Vercel's filesystem is read-only, so deployments need a Blob store.
  if (process.env.VERCEL) {
    throw new AvatarStorageNotConfiguredError();
  }

  const directory = join(process.cwd(), 'public', 'uploads');
  await mkdir(directory, { recursive: true });
  await writeFile(join(directory, filename), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${filename}`;
}
