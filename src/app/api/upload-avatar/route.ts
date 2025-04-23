import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Log file information
    console.log('File Name:', file.name);
    console.log('File Type:', file.type);
    console.log('File Size:', file.size);

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    
    // Create directory path for the public uploads
    const publicPath = join(process.cwd(), 'public', 'uploads');
    const filePath = join(publicPath, fileName);
    
    try {
      // Write the file to public/uploads directory
      await writeFile(filePath, buffer);
      console.log(`File saved to ${filePath}`);
      
      // Generate URL path for the image
      const avatarUrl = `/uploads/${fileName}`;
      
      return NextResponse.json({ avatarUrl });
    } catch (error) {
      console.error('Error saving file:', error);
      return NextResponse.json({ error: 'Failed to save file' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in upload-avatar route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
