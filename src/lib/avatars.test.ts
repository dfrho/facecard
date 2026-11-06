import { existsSync } from 'fs';
import { readFile, rm } from 'fs/promises';
import { join } from 'path';
import sharp from 'sharp';
import { afterEach, describe, expect, it, vi } from 'vitest';

const blob = vi.hoisted(() => ({ put: vi.fn() }));
vi.mock('@vercel/blob', () => ({ put: blob.put }));

import { avatarExtension, isAllowedAvatarUrl } from './avatar-url';
import {
  AVATAR_SIZE,
  AvatarStorageNotConfiguredError,
  InvalidImageError,
  normalizeAvatar,
  sniffPhotoFormat,
  storeAvatar,
} from './avatars';

function toBlob(bytes: Uint8Array, type: string) {
  return new Blob([new Uint8Array(bytes)], { type });
}

/** A phone-style JPEG carrying EXIF metadata, including a GPS position. */
async function photoWithLocation() {
  const jpeg = await sharp({
    create: { width: 800, height: 600, channels: 3, background: { r: 200, g: 60, b: 40 } },
  })
    .jpeg()
    .withExif({
      IFD0: { Copyright: 'Ada Lovelace', Software: 'PhoneCamera 1.0' },
      IFD3: { GPSLatitudeRef: 'N', GPSLatitude: '36/1 9/1 0/1', GPSLongitudeRef: 'W', GPSLongitude: '86/1 47/1 0/1' },
    })
    .toBuffer();
  return toBlob(jpeg, 'image/jpeg');
}

async function png() {
  const bytes = await sharp({
    create: { width: 40, height: 40, channels: 4, background: { r: 0, g: 128, b: 255, alpha: 1 } },
  })
    .png()
    .toBuffer();
  return toBlob(bytes, 'image/png');
}

describe('avatarExtension', () => {
  it('maps supported image types', () => {
    expect(avatarExtension('image/jpeg')).toBe('jpg');
    expect(avatarExtension('image/png')).toBe('png');
    expect(avatarExtension('image/webp')).toBe('webp');
    expect(avatarExtension('image/gif')).toBe('gif');
  });

  it('rejects other types', () => {
    expect(avatarExtension('image/svg+xml')).toBeUndefined();
    expect(avatarExtension('text/html')).toBeUndefined();
  });
});

describe('isAllowedAvatarUrl', () => {
  it('accepts Vercel Blob photo URLs and local upload paths', () => {
    expect(
      isAllowedAvatarUrl('https://abc123.public.blob.vercel-storage.com/avatars/1f2e-3d.png')
    ).toBe(true);
    expect(isAllowedAvatarUrl('/uploads/0b1c2d3e-4f5a-6b7c-8d9e-0f1a2b3c4d5e.jpg')).toBe(true);
  });

  it('rejects anything else', () => {
    expect(isAllowedAvatarUrl('https://evil.example.com/avatar.png')).toBe(false);
    expect(isAllowedAvatarUrl('http://abc.public.blob.vercel-storage.com/avatars/x.png')).toBe(false);
    expect(isAllowedAvatarUrl('https://public.blob.vercel-storage.com.evil.com/x.png')).toBe(false);
    expect(isAllowedAvatarUrl('/uploads/../../etc/passwd')).toBe(false);
    expect(isAllowedAvatarUrl('/uploads/photo.svg')).toBe(false);
    expect(isAllowedAvatarUrl('javascript:alert(1)')).toBe(false);
    expect(isAllowedAvatarUrl(undefined)).toBe(false);
  });
});

describe('storeAvatar', () => {
  const created: string[] = [];

  afterEach(async () => {
    blob.put.mockReset();
    await Promise.all(created.splice(0).map(path => rm(path, { force: true })));
  });

  it('uploads a re-encoded WebP to Vercel Blob when a store is connected', async () => {
    vi.stubEnv('BLOB_READ_WRITE_TOKEN', 'test-token');
    blob.put.mockResolvedValue({ url: 'https://abc.public.blob.vercel-storage.com/avatars/x.webp' });

    const url = await storeAvatar(await png());

    expect(url).toBe('https://abc.public.blob.vercel-storage.com/avatars/x.webp');
    expect(blob.put).toHaveBeenCalledWith(
      expect.stringMatching(/^avatars\/[a-f0-9-]+\.webp$/),
      expect.any(Buffer),
      { access: 'public', contentType: 'image/webp' }
    );
    expect((await sharp(blob.put.mock.calls[0][1]).metadata()).format).toBe('webp');
  });

  it('refuses to fall back to disk on Vercel', async () => {
    vi.stubEnv('BLOB_READ_WRITE_TOKEN', '');
    vi.stubEnv('BLOB_STORE_ID', '');
    vi.stubEnv('VERCEL', '1');

    await expect(storeAvatar(await png())).rejects.toBeInstanceOf(AvatarStorageNotConfiguredError);
    expect(blob.put).not.toHaveBeenCalled();
  });

  it('saves a re-encoded WebP to public/uploads in local development', async () => {
    vi.stubEnv('BLOB_READ_WRITE_TOKEN', '');
    vi.stubEnv('BLOB_STORE_ID', '');
    vi.stubEnv('VERCEL', '');

    const url = await storeAvatar(await png());
    const path = join(process.cwd(), 'public', url);
    created.push(path);

    expect(url).toMatch(/^\/uploads\/[a-f0-9-]+\.webp$/);
    expect(isAllowedAvatarUrl(url)).toBe(true);
    expect(existsSync(path)).toBe(true);
    expect((await sharp(await readFile(path)).metadata()).format).toBe('webp');
  });
});

describe('normalizeAvatar', () => {
  it('turns a photo into a square WebP with all metadata, including GPS, removed', async () => {
    const photo = await photoWithLocation();
    const original = await sharp(Buffer.from(await photo.arrayBuffer())).metadata();
    expect(original.exif).toBeDefined(); // the test photo really carries EXIF

    const result = await sharp(await normalizeAvatar(photo)).metadata();

    expect(result.format).toBe('webp');
    expect(result.width).toBe(AVATAR_SIZE);
    expect(result.height).toBe(AVATAR_SIZE);
    expect(result.exif).toBeUndefined();
    expect(result.xmp).toBeUndefined();
    expect(result.icc).toBeUndefined();
  });

  it('rejects files that only claim to be images', async () => {
    await expect(normalizeAvatar(new Blob(['not an image'], { type: 'image/png' }))).rejects.toBeInstanceOf(
      InvalidImageError
    );
    await expect(
      normalizeAvatar(new Blob(['<svg xmlns="http://www.w3.org/2000/svg"/>'], { type: 'image/png' }))
    ).rejects.toBeInstanceOf(InvalidImageError);
  });

  it('rejects a truncated image', async () => {
    const bytes = new Uint8Array(await (await png()).arrayBuffer()).slice(0, 30);
    await expect(normalizeAvatar(toBlob(bytes, 'image/png'))).rejects.toBeInstanceOf(InvalidImageError);
  });
});

describe('sniffPhotoFormat', () => {
  const bytes = (...values: number[]) => new Uint8Array(values);
  const ascii = (text: string) => Array.from(text, char => char.charCodeAt(0));

  it('recognises JPEG, PNG, GIF and WebP signatures', () => {
    expect(sniffPhotoFormat(bytes(0xff, 0xd8, 0xff, 0xe0))).toBe('jpeg');
    expect(sniffPhotoFormat(bytes(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0))).toBe('png');
    expect(sniffPhotoFormat(bytes(...ascii('GIF89a')))).toBe('gif');
    expect(sniffPhotoFormat(bytes(...ascii('RIFF'), 0, 0, 0, 0, ...ascii('WEBP')))).toBe('webp');
  });

  it('refuses everything else', () => {
    expect(sniffPhotoFormat(bytes(...ascii('<svg')))).toBeUndefined();
    expect(sniffPhotoFormat(bytes(...ascii('RIFF'), 0, 0, 0, 0, ...ascii('WAVE')))).toBeUndefined();
    expect(sniffPhotoFormat(bytes())).toBeUndefined();
  });
});
