import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { FileImage, FileText, FileCheck, FileSpreadsheet } from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  
  const fileCategories = [
    {
      id: 'images',
      name: 'Images',
      description: 'Manage your photos and graphics',
      icon: FileImage,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      id: 'documents',
      name: 'Documents',
      description: 'Store important documents',
      icon: FileText,
      color: 'bg-amber-100 text-amber-600',
    },
    {
      id: 'certificates',
      name: 'Certificates',
      description: 'Keep your certificates secure',
      icon: FileCheck,
      color: 'bg-green-100 text-green-600',
    },
    {
      id: 'notes',
      name: 'Notes',
      description: 'Save your important notes',
      icon: FileSpreadsheet,
      color: 'bg-purple-100 text-purple-600',
    },
  ];
  
  return (
    <div className="container-custom py-12">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Choose what you want</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Select a category to manage your files. You can upload, download, or manage your existing files.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {fileCategories.map((category) => (
          <div 
            key={category.id}
            className="card hover:transform hover:-translate-y-1 transition-all duration-300 animate-slide-up"
          >
            <div className="p-6">
              <div className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center mb-4`}>
                <category.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
              <p className="text-gray-600 mb-6">{category.description}</p>
              <Button 
                variant="primary" 
                fullWidth
                onClick={() => navigate(`/files/${category.id}`)}
              >
                Manage {category.name}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;