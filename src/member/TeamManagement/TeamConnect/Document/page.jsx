import React, { useState, useEffect } from 'react';
import { Upload, File, Folder, Share2, Download, Trash2, Search, Grid, List, Plus, X, Users, Lock, Globe } from 'lucide-react';
import Layout from '../../../layout/page';

export default function DocumentLibrary() {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentUser] = useState('John Doe');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const storedFiles = await window.storage.get('document-library-files');
      const storedFolders = await window.storage.get('document-library-folders');
      
      if (storedFiles?.value) {
        setFiles(JSON.parse(storedFiles.value));
      }
      if (storedFolders?.value) {
        setFolders(JSON.parse(storedFolders.value));
      }
    } catch (error) {
      console.log('No existing data found, starting fresh');
    }
  };

  const saveData = async (newFiles, newFolders) => {
    try {
      await window.storage.set('document-library-files', JSON.stringify(newFiles));
      await window.storage.set('document-library-folders', JSON.stringify(newFolders));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleFileUpload = async (e) => {
    const uploadedFiles = Array.from(e.target.files);
    
    const newFiles = await Promise.all(
      uploadedFiles.map(async (file) => {
        const base64 = await fileToBase64(file);
        return {
          id: Date.now() + Math.random(),
          name: file.name,
          size: file.size,
          type: file.type,
          data: base64,
          uploadedBy: currentUser,
          uploadedAt: new Date().toISOString(),
          folderId: currentFolder,
          sharedWith: [],
          visibility: 'private'
        };
      })
    );

    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);
    await saveData(updatedFiles, folders);
    setShowUploadModal(false);
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const createFolder = async (name) => {
    const newFolder = {
      id: Date.now(),
      name,
      createdBy: currentUser,
      createdAt: new Date().toISOString(),
      parentId: currentFolder,
      sharedWith: [],
      visibility: 'private'
    };

    const updatedFolders = [...folders, newFolder];
    setFolders(updatedFolders);
    await saveData(files, updatedFolders);
    setShowNewFolderModal(false);
  };

  const deleteItem = async (item, isFolder) => {
    if (isFolder) {
      const updatedFolders = folders.filter(f => f.id !== item.id);
      const updatedFiles = files.filter(f => f.folderId !== item.id);
      setFolders(updatedFolders);
      setFiles(updatedFiles);
      await saveData(updatedFiles, updatedFolders);
    } else {
      const updatedFiles = files.filter(f => f.id !== item.id);
      setFiles(updatedFiles);
      await saveData(updatedFiles, folders);
    }
  };

  const shareItem = async (visibility, sharedWith = []) => {
    if (!selectedItem) return;

    if (selectedItem.isFolder) {
      const updatedFolders = folders.map(f =>
        f.id === selectedItem.id ? { ...f, visibility, sharedWith } : f
      );
      setFolders(updatedFolders);
      await saveData(files, updatedFolders);
    } else {
      const updatedFiles = files.map(f =>
        f.id === selectedItem.id ? { ...f, visibility, sharedWith } : f
      );
      setFiles(updatedFiles);
      await saveData(updatedFiles, folders);
    }
    setShowShareModal(false);
    setSelectedItem(null);
  };

  const downloadFile = (file) => {
    const link = document.createElement('a');
    link.href = file.data;
    link.download = file.name;
    link.click();
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const filteredFolders = folders.filter(f =>
    f.parentId === currentFolder &&
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFiles = files.filter(f =>
    f.folderId === currentFolder &&
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCurrentPath = () => {
    if (!currentFolder) return 'Home';
    const folder = folders.find(f => f.id === currentFolder);
    return folder ? folder.name : 'Home';
  };

  return (
    <Layout>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <File className="text-indigo-600" size={32} />
                Document Library
              </h1>
              <p className="text-gray-600 mt-1">Logged in as {currentUser}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowNewFolderModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus size={20} />
                New Folder
              </button>
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Upload size={20} />
                Upload Files
              </button>
            </div>
          </div>

          {/* Search and View Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600">
              <Folder size={20} className="text-indigo-600" />
              <span className="font-medium">{getCurrentPath()}</span>
              {currentFolder && (
                <button
                  onClick={() => setCurrentFolder(null)}
                  className="ml-2 text-indigo-600 hover:text-indigo-700"
                >
                  ← Back to Home
                </button>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search files and folders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {filteredFolders.length === 0 && filteredFiles.length === 0 ? (
            <div className="text-center py-12">
              <Folder size={64} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No files or folders yet</p>
              <p className="text-gray-400">Upload files or create folders to get started</p>
            </div>
          ) : (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredFolders.map(folder => (
                    <div
                      key={folder.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onDoubleClick={() => setCurrentFolder(folder.id)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <Folder className="text-indigo-600" size={40} />
                        <div className="flex gap-1">
                          {folder.visibility === 'public' ? (
                            <Globe size={16} className="text-green-600" />
                          ) : folder.sharedWith?.length > 0 ? (
                            <Users size={16} className="text-blue-600" />
                          ) : (
                            <Lock size={16} className="text-gray-400" />
                          )}
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-800 truncate mb-1">{folder.name}</h3>
                      <p className="text-xs text-gray-500">Created by {folder.createdBy}</p>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => {
                            setSelectedItem({ ...folder, isFolder: true });
                            setShowShareModal(true);
                          }}
                          className="flex-1 text-xs py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                        >
                          Share
                        </button>
                        <button
                          onClick={() => deleteItem(folder, true)}
                          className="flex-1 text-xs py-1 bg-red-50 text-red-600 rounded hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}

                  {filteredFiles.map(file => (
                    <div
                      key={file.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <File className="text-gray-600" size={40} />
                        <div className="flex gap-1">
                          {file.visibility === 'public' ? (
                            <Globe size={16} className="text-green-600" />
                          ) : file.sharedWith?.length > 0 ? (
                            <Users size={16} className="text-blue-600" />
                          ) : (
                            <Lock size={16} className="text-gray-400" />
                          )}
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-800 truncate mb-1">{file.name}</h3>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      <p className="text-xs text-gray-400">by {file.uploadedBy}</p>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => downloadFile(file)}
                          className="flex-1 text-xs py-1 bg-green-50 text-green-600 rounded hover:bg-green-100"
                        >
                          Download
                        </button>
                        <button
                          onClick={() => {
                            setSelectedItem({ ...file, isFolder: false });
                            setShowShareModal(true);
                          }}
                          className="flex-1 text-xs py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                        >
                          Share
                        </button>
                        <button
                          onClick={() => deleteItem(file, false)}
                          className="flex-1 text-xs py-1 bg-red-50 text-red-600 rounded hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredFolders.map(folder => (
                    <div
                      key={folder.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                      onDoubleClick={() => setCurrentFolder(folder.id)}
                    >
                      <div className="flex items-center gap-3">
                        <Folder className="text-indigo-600" size={24} />
                        <div>
                          <h3 className="font-semibold text-gray-800">{folder.name}</h3>
                          <p className="text-xs text-gray-500">Created by {folder.createdBy}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {folder.visibility === 'public' ? (
                          <Globe size={16} className="text-green-600" />
                        ) : folder.sharedWith?.length > 0 ? (
                          <Users size={16} className="text-blue-600" />
                        ) : (
                          <Lock size={16} className="text-gray-400" />
                        )}
                        <button
                          onClick={() => {
                            setSelectedItem({ ...folder, isFolder: true });
                            setShowShareModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Share2 size={16} />
                        </button>
                        <button
                          onClick={() => deleteItem(folder, true)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {filteredFiles.map(file => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <File className="text-gray-600" size={24} />
                        <div>
                          <h3 className="font-semibold text-gray-800">{file.name}</h3>
                          <p className="text-xs text-gray-500">{formatFileSize(file.size)} • {file.uploadedBy}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {file.visibility === 'public' ? (
                          <Globe size={16} className="text-green-600" />
                        ) : file.sharedWith?.length > 0 ? (
                          <Users size={16} className="text-blue-600" />
                        ) : (
                          <Lock size={16} className="text-gray-400" />
                        )}
                        <button
                          onClick={() => downloadFile(file)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded"
                        >
                          <Download size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedItem({ ...file, isFolder: false });
                            setShowShareModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Share2 size={16} />
                        </button>
                        <button
                          onClick={() => deleteItem(file, false)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Upload Files</h2>
              <button onClick={() => setShowUploadModal(false)}>
                <X size={24} className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            <p className="text-xs text-gray-500 mt-2">Select one or more files to upload</p>
          </div>
        </div>
      )}

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Create Folder</h2>
              <button onClick={() => setShowNewFolderModal(false)}>
                <X size={24} className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            <input
              type="text"
              placeholder="Folder name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  createFolder(e.target.value.trim());
                }
              }}
            />
            <button
              onClick={(e) => {
                const input = e.target.previousElementSibling;
                if (input.value.trim()) {
                  createFolder(input.value.trim());
                }
              }}
              className="w-full mt-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Create
            </button>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Share {selectedItem.isFolder ? 'Folder' : 'File'}</h2>
              <button onClick={() => { setShowShareModal(false); setSelectedItem(null); }}>
                <X size={24} className="text-gray-500 hover:text-gray-700" />
              </button>
            </div>
            <p className="text-gray-600 mb-4">"{selectedItem.name}"</p>
            <div className="space-y-3">
              <button
                onClick={() => shareItem('private', [])}
                className="w-full flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg hover:border-indigo-500 transition-colors"
              >
                <Lock size={20} className="text-gray-500" />
                <div className="text-left">
                  <p className="font-semibold">Private</p>
                  <p className="text-sm text-gray-500">Only you can access</p>
                </div>
              </button>
              <button
                onClick={() => shareItem('public', [])}
                className="w-full flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg hover:border-green-500 transition-colors"
              >
                <Globe size={20} className="text-green-500" />
                <div className="text-left">
                  <p className="font-semibold">Public</p>
                  <p className="text-sm text-gray-500">Anyone can view</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </Layout>
  );
}