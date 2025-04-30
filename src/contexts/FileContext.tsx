import React, { createContext, useContext, useState, useEffect } from 'react';

// Define file types
export type FileCategory = 'images' | 'documents' | 'certificates' | 'notes';

export interface UserFile {
  id: string;
  name: string;
  category: FileCategory;
  url: string; // This would be the dataURL or blob URL for demonstration
  createdAt: string;
  userId: string;
}

interface FileContextType {
  files: UserFile[];
  uploadFile: (file: File, name: string, category: FileCategory) => Promise<boolean>;
  deleteFile: (id: string) => void;
  getFilesByCategory: (category: FileCategory) => UserFile[];
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export const FileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [files, setFiles] = useState<UserFile[]>([]);

  // Load saved files from localStorage
  useEffect(() => {
    const savedFiles = localStorage.getItem('manafiles_files');
    if (savedFiles) {
      try {
        setFiles(JSON.parse(savedFiles));
      } catch (error) {
        console.error('Error parsing saved files:', error);
      }
    }
  }, []);

  // Save files to localStorage whenever files change
  useEffect(() => {
    localStorage.setItem('manafiles_files', JSON.stringify(files));
  }, [files]);

  const uploadFile = async (file: File, name: string, category: FileCategory): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          if (!e.target?.result) {
            reject(new Error('Failed to read file'));
            return;
          }
          
          // Get current user ID from localStorage (simplified user management)
          const userStr = localStorage.getItem('manafiles_user');
          const userId = userStr ? JSON.parse(userStr).id : 'unknown';
          
          const newFile: UserFile = {
            id: Date.now().toString(),
            name,
            category,
            url: e.target.result as string,
            createdAt: new Date().toISOString(),
            userId
          };
          
          setFiles((prevFiles) => [...prevFiles, newFile]);
          resolve(true);
        } catch (error) {
          console.error('Error processing file:', error);
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsDataURL(file);
    });
  };

  const deleteFile = (id: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
  };

  const getFilesByCategory = (category: FileCategory): UserFile[] => {
    // Get current user ID from localStorage
    const userStr = localStorage.getItem('manafiles_user');
    const userId = userStr ? JSON.parse(userStr).id : null;
    
    // If no user is logged in, return empty array
    if (!userId) return [];
    
    // Return files for the current user and specified category
    return files.filter(
      (file) => file.category === category && file.userId === userId
    );
  };

  return (
    <FileContext.Provider
      value={{
        files,
        uploadFile,
        deleteFile,
        getFilesByCategory
      }}
    >
      {children}
    </FileContext.Provider>
  );
};

export const useFiles = (): FileContextType => {
  const context = useContext(FileContext);
  if (context === undefined) {
    throw new Error('useFiles must be used within a FileProvider');
  }
  return context;
};