/**
 * Photo rules shared by the upload API and the auth callbacks. Kept free of
 * @vercel/blob so importing it doesn't pull the storage client into auth code.
 */
export const MAX_AVATAR_BYTES = 5 * 1024 * 1024;

const EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

const BLOB_HOST_SUFFIX = '.public.blob.vercel-storage.com';
const LOCAL_AVATAR_PATH = /^\/uploads\/[a-f0-9-]+\.(jpg|png|webp|gif)$/;

/** File extension for a supported image type, or undefined if the type isn't allowed. */
export function avatarExtension(contentType: string): string | undefined {
  return EXTENSIONS[contentType];
}

/**
 * True only for photo URLs this app hands out: a Vercel Blob URL, or a local
 * /uploads path in development. Used to vet the image a client asks to put on its session.
 */
export function isAllowedAvatarUrl(url: unknown): url is string {
  if (typeof url !== 'string') {
    return false;
  }
  if (url.startsWith('/')) {
    return LOCAL_AVATAR_PATH.test(url);
  }
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && parsed.hostname.endsWith(BLOB_HOST_SUFFIX);
  } catch {
    return false;
  }
}
