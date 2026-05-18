import { useState, useEffect } from 'react';
import { HardDrive, ArrowLeft, Upload, Download, Trash2, FileText, Image as ImageIcon, Video, Music, Plus, Copy, Eye, CheckCircle, AlertCircle } from 'lucide-react';
import useUpload from '../../../utils/useUpload';

export default function RoomDashboard({ params }) {
  const [roomData, setRoomData] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [showUploadZone, setShowUploadZone] = useState(false);
  const [errors, setErrors] = useState({});
  const [upload, { loading: uploading }] = useUpload();
  
  const roomId = params.roomId;
  const password = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('password') : '';

  useEffect(() => {
    if (roomId && password) {
      fetchRoomData();
      fetchFiles();
    }
  }, [roomId, password]);

  const fetchRoomData = async () => {
    try {
      const response = await fetch(`/api/rooms/${roomId}?password=${encodeURIComponent(password)}`);
      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = '/access-room';
          return;
        }
        throw new Error('Failed to fetch room data');
      }
      const data = await response.json();
      setRoomData(data);
    } catch (error) {
      console.error('Error fetching room data:', error);
      setErrors({ general: 'Failed to load room data' });
    }
  };

  const fetchFiles = async () => {
    try {
      const response = await fetch(`/api/rooms/${roomId}/files?password=${encodeURIComponent(password)}`);
      if (!response.ok) throw new Error('Failed to fetch files');
      const data = await response.json();
      setFiles(data.files || []);
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return ImageIcon;
    if (fileType.startsWith('video/')) return Video;
    if (fileType.startsWith('audio/')) return Music;
    return FileText;
  };

  const getFileColor = (fileType) => {
    if (fileType.startsWith('image/')) return 'text-green-400';
    if (fileType.startsWith('video/')) return 'text-blue-400';
    if (fileType.startsWith('audio/')) return 'text-purple-400';
    return 'text-gray-400';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const calculateStoragePercentage = () => {
    if (!roomData || !roomData.storageLimit) return 0;
    return Math.min((roomData.storageUsed / roomData.storageLimit) * 100, 100);
  };

  const handleFileUpload = async (uploadedFiles) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'video/mp4', 'text/plain', 'application/pdf', 'audio/mpeg', 'audio/wav'];
    const maxSize = 100 * 1024 * 1024; // 100MB

    for (const file of uploadedFiles) {
      if (!allowedTypes.includes(file.type)) {
        setErrors({ upload: `File type ${file.type} is not allowed` });
        return;
      }
      if (file.size > maxSize) {
        setErrors({ upload: `File ${file.name} is too large. Maximum size is 100MB` });
        return;
      }
    }

    try {
      for (const file of uploadedFiles) {
        const uploadResult = await upload({ file });
        
        if (uploadResult.error) {
          setErrors({ upload: uploadResult.error });
          return;
        }

        // Save file info to database
        const response = await fetch(`/api/rooms/${roomId}/files`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            roomId,
            password,
            fileName: file.name,
            fileUrl: uploadResult.url,
            fileType: file.type,
            fileSize: file.size,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to save file info');
        }
      }

      // Refresh files and room data
      await fetchFiles();
      await fetchRoomData();
      setShowUploadZone(false);
      setErrors({});
    } catch (error) {
      console.error('Error uploading files:', error);
      setErrors({ upload: 'Failed to upload files' });
    }
  };

  const handleDeleteFile = async (fileId) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      const response = await fetch(`/api/rooms/${roomId}/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) throw new Error('Failed to delete file');

      await fetchFiles();
      await fetchRoomData();
    } catch (error) {
      console.error('Error deleting file:', error);
      setErrors({ delete: 'Failed to delete file' });
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      handleFileUpload(droppedFiles);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
    } catch (error) {
      console.error('Failed to copy room ID:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] flex items-center justify-center">
        <div className="text-white font-inter">Loading room...</div>
      </div>
    );
  }

  if (!roomData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] flex items-center justify-center">
        <div className="text-center text-white">
          <AlertCircle size={48} className="mx-auto mb-4" />
          <p className="font-inter">Room not found or access denied</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E]">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="p-6 md:p-8 border-b border-white/10">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <button
              onClick={() => window.location.href = '/'}
              className="flex items-center gap-3 text-white hover:text-cyan-400 transition-colors duration-200"
            >
              <ArrowLeft size={20} />
              <span className="font-medium font-inter">Exit Room</span>
            </button>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white font-medium font-inter">{roomData.name}</span>
                  <button onClick={copyRoomId} className="text-gray-400 hover:text-white transition-colors">
                    <Copy size={16} />
                  </button>
                </div>
                <span className="text-cyan-400 text-sm font-mono">{roomId}</span>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
                <HardDrive size={16} className="text-white" />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Storage Bar */}
            <div className="mb-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white font-bricolage">Storage Usage</h2>
                <span className="text-cyan-400 font-medium font-inter">
                  {formatFileSize(roomData.storageUsed)} / {formatFileSize(roomData.storageLimit)}
                </span>
              </div>
              <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden mb-2">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${calculateStoragePercentage()}%` }}
                ></div>
              </div>
              <p className="text-gray-300 text-sm font-inter">
                {calculateStoragePercentage().toFixed(1)}% used
              </p>
            </div>

            {/* Upload Zone */}
            {showUploadZone && (
              <div className="mb-8">
                <div 
                  className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                    dragActive ? 'border-cyan-400 bg-cyan-400/10' : 'border-white/30 bg-white/5'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <Upload size={48} className="mx-auto mb-4 text-cyan-400" />
                  <h3 className="text-xl font-semibold text-white mb-2 font-bricolage">Drop files here</h3>
                  <p className="text-gray-300 mb-4 font-inter">or click to browse</p>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => handleFileUpload(Array.from(e.target.files))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept=".png,.jpg,.jpeg,.mp4,.txt,.pdf,.mp3,.wav"
                  />
                  <p className="text-xs text-gray-400 font-inter">
                    Allowed: PNG, JPEG, MP4 (&lt;100MB), TXT, PDF, MP3, WAV
                  </p>
                </div>
              </div>
            )}

            {errors.upload && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
                <p className="text-red-400 text-sm font-inter">{errors.upload}</p>
              </div>
            )}

            {/* Files Grid */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white font-sora">Files ({files.length})</h2>
              <button
                onClick={() => setShowUploadZone(!showUploadZone)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25 active:scale-95 font-inter"
              >
                <Plus size={20} />
                Upload Files
              </button>
            </div>

            {files.length === 0 ? (
              <div className="text-center py-20 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
                <HardDrive size={64} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-white mb-2 font-bricolage">No files yet</h3>
                <p className="text-gray-300 mb-6 font-inter">Upload your first file to get started</p>
                <button
                  onClick={() => setShowUploadZone(true)}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 font-inter"
                >
                  Upload Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {files.map((file) => {
                  const FileIcon = getFileIcon(file.fileType);
                  const colorClass = getFileColor(file.fileType);
                  
                  return (
                    <div key={file.id} className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 transition-all duration-300 hover:bg-white/15 hover:scale-105">
                      <div className="flex items-start justify-between mb-4">
                        <FileIcon size={32} className={colorClass} />
                        <div className="flex gap-2">
                          <a
                            href={file.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-white/10 rounded-lg text-gray-400 hover:text-white hover:bg-white/20 transition-all duration-200"
                          >
                            <Download size={16} />
                          </a>
                          <button
                            onClick={() => handleDeleteFile(file.id)}
                            className="p-2 bg-white/10 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/20 transition-all duration-200"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <h3 className="text-white font-medium mb-2 truncate font-inter" title={file.fileName}>
                        {file.fileName}
                      </h3>
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <span className="font-inter">{formatFileSize(file.fileSize)}</span>
                        <span className="font-inter">{new Date(file.uploadedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}