import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('avatar') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    // Optional: Validate file type and size here

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${uuidv4()}-${file.name}`; // Create a unique filename
    const filepath = join(process.cwd(), 'public/uploads', filename);

    try {
      // Ensure the uploads directory exists
      await mkdir(join(process.cwd(), 'public/uploads'), { recursive: true });

      // Write the file to the server
      await writeFile(filepath, buffer);

      const publicUrl = `/uploads/${filename}`; // URL accessible by the client

      return NextResponse.json({ message: 'Avatar uploaded successfully!', url: publicUrl });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to upload avatar.' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
