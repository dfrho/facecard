import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { MAX_AVATAR_BYTES, avatarExtension } from '@/lib/avatar-url';
import { AvatarStorageNotConfiguredError, storeAvatar } from '@/lib/avatars';

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return errorResponse('Please sign in to upload a photo.', 401);
  }

  const formData = await req.formData().catch(() => null);
  if (!formData) {
    return errorResponse('Expected a photo upload.', 400);
  }

  const file = formData.get('avatar');
  if (!(file instanceof Blob)) {
    return errorResponse('No file uploaded.', 400);
  }
  if (!avatarExtension(file.type)) {
    return errorResponse('Please upload a JPEG, PNG, WebP or GIF image.', 400);
  }
  if (file.size > MAX_AVATAR_BYTES) {
    return errorResponse('Photos must be 5 MB or smaller.', 413);
  }

  try {
    const url = await storeAvatar(file);
    return NextResponse.json({ url });
  } catch (error) {
    console.error('Error storing avatar:', error);
    if (error instanceof AvatarStorageNotConfiguredError) {
      return errorResponse('Photo uploads are not set up yet. Please try again later.', 500);
    }
    return errorResponse('Failed to upload photo. Please try again.', 500);
  }
}
