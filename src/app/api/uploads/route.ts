import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

const isServerless = !!(
  process.env.NETLIFY || 
  process.env.VERCEL || 
  process.env.AWS_LAMBDA_FUNCTION_NAME ||
  process.env.NODE_ENV === 'production'
);

const uploadDir = path.join(process.cwd(), process.env.UPLOAD_DIR || 'public/uploads');
const maxFileSize = parseInt(process.env.MAX_FILE_SIZE || '5242880', 10);
const maxServerlessSize = 1024 * 1024; 

if (!isServerless && !existsSync(uploadDir)) {
  try {
    mkdirSync(uploadDir, { recursive: true });
  } catch (error) {
    console.warn('Could not create upload directory:', error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ 
        error: 'Invalid file type. Only images are allowed.' 
      }, { status: 400 });
    }

    if (isServerless) {
      console.log('Detected serverless environment, using base64 encoding');
      
      if (file.size > maxServerlessSize) {
        return NextResponse.json({ 
          error: `File size exceeds ${maxServerlessSize / (1024 * 1024)}MB limit for serverless deployment.`,
          suggestion: 'Please use a smaller image or set up cloud storage (Cloudinary, AWS S3, etc.)'
        }, { status: 413 });
      }

      try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const base64 = buffer.toString('base64');
        const dataUrl = `data:${file.type};base64,${base64}`;

        return NextResponse.json({ 
          fileUrl: dataUrl,
          isBase64: true,
          message: 'File converted to base64 for serverless deployment'
        }, { status: 200 });
      } catch (error) {
        console.error('Base64 conversion error:', error);
        return NextResponse.json({
          error: 'Failed to process file in serverless environment',
          suggestion: 'Please try a smaller image or configure cloud storage'
        }, { status: 500 });
      }
    }

    if (file.size > maxFileSize) {
      return NextResponse.json({ 
        error: `File size exceeds ${maxFileSize / (1024 * 1024)}MB limit.` 
      }, { status: 400 });
    }

    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}-${safeName}`;
    const filePath = path.join(uploadDir, filename);

    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(filePath, buffer);

      const fileUrl = `/uploads/${filename}`;
      return NextResponse.json({ 
        fileUrl,
        isBase64: false,
        message: 'File uploaded successfully to local storage'
      }, { status: 200 });
    } catch (fsError) {
      console.error('File system error:', fsError);
      
      if (file.size <= maxServerlessSize) {
        console.log('File system write failed, falling back to base64');
        const buffer = Buffer.from(await file.arrayBuffer());
        const base64 = buffer.toString('base64');
        const dataUrl = `data:${file.type};base64,${base64}`;

        return NextResponse.json({ 
          fileUrl: dataUrl,
          isBase64: true,
          message: 'File system unavailable, converted to base64'
        }, { status: 200 });
      }

      throw fsError;
    }

  } catch (error) {
    console.error('Upload error:', error);
    
    let errorMessage = 'Failed to upload file';
    let suggestion = '';

    if (error instanceof Error) {
      if (error.message.includes('EROFS') || error.message.includes('read-only')) {
        errorMessage = 'Cannot write files in serverless environment';
        suggestion = 'Please configure cloud storage (Cloudinary, AWS S3) or use smaller images (under 1MB)';
      } else if (error.message.includes('ENOSPC')) {
        errorMessage = 'Not enough storage space';
        suggestion = 'Please try a smaller image or contact support';
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json({
      error: errorMessage,
      ...(suggestion && { suggestion }),
      environment: isServerless ? 'serverless' : 'local'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    environment: isServerless ? 'serverless' : 'local',
    maxFileSize: isServerless ? maxServerlessSize : maxFileSize,
    maxFileSizeMB: isServerless ? 
      maxServerlessSize / (1024 * 1024) : 
      maxFileSize / (1024 * 1024),
    uploadMethod: isServerless ? 'base64' : 'filesystem',
    uploadDir: isServerless ? 'N/A (base64)' : uploadDir
  });
}