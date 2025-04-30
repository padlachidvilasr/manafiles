import React, { useState, useRef } from 'react';
import { FileCategory, useFiles } from '../contexts/FileContext';
import Button from './Button';
import InputField from './InputField';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  category: FileCategory;
}

const FileUpload: React.FC<FileUploadProps> = ({ category }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { uploadFile } = useFiles();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      // If no custom name was entered, use the original filename
      if (!fileName) {
        const originalName = e.target.files[0].name;
        // Remove file extension
        const nameWithoutExtension = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
        setFileName(nameWithoutExtension);
      }
      setError('');
    }
  };
  
  const handleSelectFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first');
      return;
    }
    
    if (!fileName.trim()) {
      setError('Please provide a name for your file');
      return;
    }
    
    setIsUploading(true);
    setError('');
    
    try {
      await uploadFile(selectedFile, fileName, category);
      setSelectedFile(null);
      setFileName('');
      setUploadSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    } catch (err) {
      setError('Failed to upload file. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="card p-6 animate-fade-in">
      <h3 className="text-xl font-semibold mb-4">Upload {category.charAt(0).toUpperCase() + category.slice(1)}</h3>
      
      <div className="mb-6">
        <div 
          onClick={handleSelectFile}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary-500 transition-colors duration-200"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept={
              category === 'images' 
                ? 'image/*' 
                : category === 'documents' 
                  ? '.pdf,.doc,.docx,.txt' 
                  : '*'
            }
          />
          <div className="flex flex-col items-center">
            <Upload className="w-12 h-12 text-gray-400 mb-3" />
            <p className="text-gray-700 font-medium mb-1">
              {selectedFile ? selectedFile.name : `Click to select a file`}
            </p>
            <p className="text-sm text-gray-500">
              {!selectedFile && 'or drag and drop'}
            </p>
          </div>
        </div>
      </div>
      
      <InputField
        id="fileName"
        label="File Name"
        placeholder="Enter a name for your file"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
        required
      />
      
      {error && (
        <div className="mb-4 text-red-600 text-sm">{error}</div>
      )}
      
      {uploadSuccess && (
        <div className="mb-4 text-green-600 text-sm animate-fade-in">
          File uploaded successfully!
        </div>
      )}
      
      <Button 
        onClick={handleUpload} 
        isLoading={isUploading}
        disabled={!selectedFile || fileName.trim() === ''}
        variant="primary"
        fullWidth
      >
        Upload File
      </Button>
    </div>
  );
};

export default FileUpload;