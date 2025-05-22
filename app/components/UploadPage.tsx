"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

// Define interface for extracted data
interface ExtractedData {
  extracted_data: string | Record<string, string | number>;
}

export default function UploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    setUploadSuccess(false);
    setUploadError(null);
    setExtractedData(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    multiple: true
  });

  const handleUpload = async () => {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!files.length) return;

    setUploading(true);
    setUploadSuccess(false);
    setUploadError(null);
    setExtractedData(null);

    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });
      
      const response = await axios.post(`${BACKEND_URL}/api/upload`, formData);

      console.log('Response:', response);
      
      if (response.status !== 200) {
        const errorData = response.data;
        throw new Error(errorData.error || 'Upload failed');
      }
      
      const result = response.data.result;
      console.log('Upload result:', result);
      setExtractedData(result);
      setUploadSuccess(true);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const clearFiles = () => {
    setFiles([]);
    setUploadSuccess(false);
    setUploadError(null);
    setExtractedData(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">File Upload</h1>
          <p className="mt-2 text-lg text-gray-600">
            Drag and drop files to upload or click to select files
          </p>
        </div>

        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
            isDragActive 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          
          <div className="space-y-2">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4h-4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="text-sm text-gray-600">
              {isDragActive ? (
                <p>Drop the files here ...</p>
              ) : (
                <p>
                  Drag and drop files here, or click to select files
                </p>
              )}
            </div>
            <p className="text-xs text-gray-500">
              Supports PDF, Word documents, and images
            </p>
          </div>
        </div>

        {files.length > 0 && (
          <div className="mt-6">
            <h2 className="text-lg font-medium text-gray-900">Selected Files</h2>
            <ul className="mt-3 divide-y divide-gray-200 border border-gray-200 rounded-md">
              {files.map((file, index) => (
                <li key={index} className="flex py-3 px-4 text-sm">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex space-x-3">
              <button
                type="button"
                onClick={handleUpload}
                disabled={uploading}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  uploading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {uploading ? 'Uploading...' : 'Upload Files'}
              </button>
              <button
                type="button"
                onClick={clearFiles}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Clear
              </button>
            </div>

            {uploadSuccess && (
              <div className="mt-4 p-4 bg-green-50 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      Files uploaded successfully!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {extractedData && (
              <div className="mt-6">
                <h2 className="text-lg font-medium text-gray-900">Extracted Data</h2>
                <div className="mt-3 bg-gray-50 p-4 rounded-md overflow-auto">
                  <div className="mb-2 text-xs text-gray-500 flex items-center">
                    <span className="mr-1">JSON Format</span>
                    <span className="px-1 bg-gray-200 rounded font-mono">{ }</span>
                  </div>
                  <div className="text-sm text-gray-800">
                    {extractedData.extracted_data && (
                      <dl className="divide-y divide-gray-200">
                        {Object.entries(
                          typeof extractedData.extracted_data === 'string' 
                            ? JSON.parse(extractedData.extracted_data) 
                            : extractedData.extracted_data
                        ).map(([key, value]) => (
                          <div key={key} className="py-2 flex flex-col sm:flex-row sm:gap-4">
                            <dt className="font-medium text-gray-700">{key}:</dt>
                            <dd className="mt-1 sm:mt-0 text-gray-900">{String(value)}</dd>
                          </div>
                        ))}
                      </dl>
                    )}
                  </div>
                  {/* {extractedData.total_pages && (
                    <div className="mt-2 text-xs text-gray-500">
                      Pages: {extractedData.pages_analyzed} of {extractedData.total_pages}
                    </div>
                  )} */}
                </div>
              </div>
            )}

            {uploadError && (
              <div className="mt-4 p-4 bg-red-50 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">
                      {uploadError}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 