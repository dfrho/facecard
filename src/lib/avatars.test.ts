import { existsSync } from 'fs';
import { rm } from 'fs/promises';
import { join } from 'path';
import { afterEach, describe, expect, it, vi } from 'vitest';

const blob = vi.hoisted(() => ({ put: vi.fn() }));
vi.mock('@vercel/blob', () => ({ put: blob.put }));

import { avatarExtension, isAllowedAvatarUrl } from './avatar-url';
import { AvatarStorageNotConfiguredError, storeAvatar } from './avatars';

const png = () => new Blob(['fake png bytes'], { type: 'image/png' });

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

  it('uploads to Vercel Blob when a store is connected', async () => {
    vi.stubEnv('BLOB_READ_WRITE_TOKEN', 'test-token');
    blob.put.mockResolvedValue({ url: 'https://abc.public.blob.vercel-storage.com/avatars/x.png' });

    const url = await storeAvatar(png());

    expect(url).toBe('https://abc.public.blob.vercel-storage.com/avatars/x.png');
    expect(blob.put).toHaveBeenCalledWith(
      expect.stringMatching(/^avatars\/[a-f0-9-]+\.png$/),
      expect.any(Blob),
      { access: 'public', contentType: 'image/png' }
    );
  });

  it('refuses to fall back to disk on Vercel', async () => {
    vi.stubEnv('BLOB_READ_WRITE_TOKEN', '');
    vi.stubEnv('BLOB_STORE_ID', '');
    vi.stubEnv('VERCEL', '1');

    await expect(storeAvatar(png())).rejects.toBeInstanceOf(AvatarStorageNotConfiguredError);
    expect(blob.put).not.toHaveBeenCalled();
  });

  it('saves to public/uploads in local development', async () => {
    vi.stubEnv('BLOB_READ_WRITE_TOKEN', '');
    vi.stubEnv('BLOB_STORE_ID', '');
    vi.stubEnv('VERCEL', '');

    const url = await storeAvatar(png());
    const path = join(process.cwd(), 'public', url);
    created.push(path);

    expect(url).toMatch(/^\/uploads\/[a-f0-9-]+\.png$/);
    expect(isAllowedAvatarUrl(url)).toBe(true);
    expect(existsSync(path)).toBe(true);
  });

  it('rejects unsupported image types', async () => {
    await expect(storeAvatar(new Blob(['<svg/>'], { type: 'image/svg+xml' }))).rejects.toThrow(
      'Unsupported image type'
    );
  });
});
