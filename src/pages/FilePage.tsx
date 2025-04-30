import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import FileUpload from '../components/FileUpload';
import FileList from '../components/FileList';
import { ArrowLeft, Upload, Download, List } from 'lucide-react';
import { FileCategory } from '../contexts/FileContext';

type FileViewMode = 'upload' | 'download' | 'manage';

const FilePage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<FileViewMode>('upload');
  
  // Validate category
  const validCategory = ['images', 'documents', 'certificates', 'notes'].includes(category || '');
  if (!validCategory) {
    return (
      <div className="container-custom py-12 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Category</h1>
        <p className="text-gray-600 mb-6">The category you're looking for doesn't exist.</p>
        <Button variant="primary" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }
  
  const typedCategory = category as FileCategory;
  
  const getCategoryTitle = () => {
    switch (typedCategory) {
      case 'images':
        return 'IMAGE SECTION';
      case 'documents':
        return 'DOCUMENT SECTION';
      case 'certificates':
        return 'CERTIFICATE SECTION';
      case 'notes':
        return 'NOTE SECTION';
      default:
        return 'FILE SECTION';
    }
  };
  
  const renderContent = () => {
    switch (viewMode) {
      case 'upload':
        return <FileUpload category={typedCategory} />;
      case 'download':
        return <FileList category={typedCategory} purpose="download" />;
      case 'manage':
        return <FileList category={typedCategory} purpose="manage" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="container-custom py-12">
      <div className="flex items-center mb-8">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/dashboard')}
          className="mr-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">{getCategoryTitle()}</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <div className="card p-4 sticky top-4">
            <h3 className="text-lg font-semibold mb-4">Options</h3>
            <div className="space-y-2">
              <Button
                variant={viewMode === 'upload' ? 'primary' : 'outline'}
                fullWidth
                onClick={() => setViewMode('upload')}
                className="justify-start"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload {typedCategory.charAt(0).toUpperCase() + typedCategory.slice(1)}
              </Button>
              <Button
                variant={viewMode === 'download' ? 'primary' : 'outline'}
                fullWidth
                onClick={() => setViewMode('download')}
                className="justify-start"
              >
                <Download className="w-4 h-4 mr-2" />
                Download {typedCategory.charAt(0).toUpperCase() + typedCategory.slice(1)}
              </Button>
              <Button
                variant={viewMode === 'manage' ? 'primary' : 'outline'}
                fullWidth
                onClick={() => setViewMode('manage')}
                className="justify-start"
              >
                <List className="w-4 h-4 mr-2" />
                Previous {typedCategory.charAt(0).toUpperCase() + typedCategory.slice(1)}
              </Button>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-3">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default FilePage;