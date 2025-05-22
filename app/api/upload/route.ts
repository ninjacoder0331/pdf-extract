import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files uploaded' },
        { status: 400 }
      );
    }

    // In a real application, you would process the files here
    // For example, upload them to a storage service, process them, etc.
    
    // For this example, we'll just log the file info and return success
    const fileInfo = files.map((file: File) => ({
      name: file.name,
      type: file.type,
      size: file.size,
    }));

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({ 
      success: true, 
      message: 'Files uploaded successfully', 
      files: fileInfo 
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    );
  }
} 