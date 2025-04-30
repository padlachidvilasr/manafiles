import React from 'react';
import { FileCategory, UserFile, useFiles } from '../contexts/FileContext';
import Button from './Button';
import { Download, Trash2, Calendar, File as FileIcon } from 'lucide-react';

interface FileListProps {
  category: FileCategory;
  purpose: 'download' | 'manage';
}

const FileList: React.FC<FileListProps> = ({ category, purpose }) => {
  const { getFilesByCategory, deleteFile } = useFiles();
  const files = getFilesByCategory(category);
  
  const handleDownload = (file: UserFile) => {
    // Create an anchor element
    const a = document.createElement('a');
    a.href = file.url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  if (files.length === 0) {
    return (
      <div className="card p-6 animate-fade-in">
        <h3 className="text-xl font-semibold mb-4">
          {purpose === 'download' ? 'Download' : 'Manage'} {category.charAt(0).toUpperCase() + category.slice(1)}
        </h3>
        <div className="text-center py-8">
          <FileIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-700">No {category} found</p>
          <p className="text-sm text-gray-500 mt-1">Upload some {category} to see them here</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="card p-6 animate-fade-in">
      <h3 className="text-xl font-semibold mb-4">
        {purpose === 'download' ? 'Download' : 'Manage'} {category.charAt(0).toUpperCase() + category.slice(1)}
      </h3>
      
      <div className="divide-y divide-gray-200">
        {files.map((file) => (
          <div key={file.id} className="py-4 flex items-center justify-between animate-slide-up">
            <div className="flex items-center space-x-4">
              {category === 'images' ? (
                <img 
                  src={file.url} 
                  alt={file.name}
                  className="w-12 h-12 object-cover rounded-md"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                  <FileIcon className="w-6 h-6 text-gray-500" />
                </div>
              )}
              
              <div>
                <h4 className="font-medium text-gray-900">{file.name}</h4>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>{formatDate(file.createdAt)}</span>
                </div>
              </div>
            </div>
            
            <div>
              {purpose === 'download' ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleDownload(file)}
                  className="flex items-center"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
              ) : (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => deleteFile(file.id)}
                  className="flex items-center"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileList;