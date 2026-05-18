import { useState } from 'react';
import { HardDrive, ArrowLeft, Key, Lock, Copy, CheckCircle, Plus } from 'lucide-react';

export default function CreateRoomPage() {
  const [formData, setFormData] = useState({
    roomName: '',
    adminPassword: '',
    confirmPassword: ''
  });
  const [generatedRoomId, setGeneratedRoomId] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState({});

  const generateRoomId = () => {
    const prefix = 'VR';
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${year}-${random}`;
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.roomName.trim()) {
      newErrors.roomName = 'Room name is required';
    }
    
    if (!formData.adminPassword) {
      newErrors.adminPassword = 'Admin password is required';
    } else if (formData.adminPassword.length < 6) {
      newErrors.adminPassword = 'Password must be at least 6 characters';
    }
    
    if (formData.adminPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateRoom = async () => {
    if (!validateForm()) return;

    setIsCreating(true);
    
    try {
      const roomId = generateRoomId();
      
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId,
          roomName: formData.roomName.trim(),
          adminPassword: formData.adminPassword,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create room');
      }

      setGeneratedRoomId(roomId);
      setIsCreated(true);
    } catch (error) {
      console.error('Error creating room:', error);
      setErrors({ general: 'Failed to create room. Please try again.' });
    } finally {
      setIsCreating(false);
    }
  };

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(generatedRoomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const navigateBack = () => {
    window.location.href = '/';
  };

  const navigateToRoom = () => {
    window.location.href = `/room/${generatedRoomId}?password=${encodeURIComponent(formData.adminPassword)}`;
  };

  if (isCreated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] dark:from-[#000000] dark:via-[#0F0F23] dark:to-[#0A1628]">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
          <div className="max-w-lg w-full">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-4 font-sora">Room Created!</h1>
              <p className="text-gray-300 font-inter">Your virtual storage room is ready to use</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 mb-8">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-white mb-2 font-bricolage">Room Details</h3>
                <p className="text-sm text-gray-400 font-inter">Save these details securely</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 font-inter">Room Name</label>
                  <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <span className="text-white font-medium font-inter">{formData.roomName}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 font-inter">Room ID</label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 p-4 bg-white/5 border border-white/10 rounded-xl">
                      <span className="text-cyan-400 font-mono font-semibold">{generatedRoomId}</span>
                    </div>
                    <button
                      onClick={copyRoomId}
                      className="p-4 bg-cyan-500/20 border border-cyan-500/30 rounded-xl text-cyan-400 transition-all duration-200 hover:bg-cyan-500/30 active:scale-95"
                    >
                      {copied ? <CheckCircle size={20} /> : <Copy size={20} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={navigateToRoom}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25 active:scale-95 font-inter"
              >
                Enter Room
              </button>
              <button
                onClick={navigateBack}
                className="flex-1 px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-2xl transition-all duration-300 hover:bg-white/20 hover:scale-105 active:scale-95 font-inter"
              >
                Create Another
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] dark:from-[#000000] dark:via-[#0F0F23] dark:to-[#0A1628]">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="p-6 md:p-8">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <button
              onClick={navigateBack}
              className="flex items-center gap-3 text-white hover:text-cyan-400 transition-colors duration-200"
            >
              <ArrowLeft size={20} />
              <span className="font-medium font-inter">Back</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
                <HardDrive size={16} className="text-white" />
              </div>
              <span className="text-xl font-bold text-white font-sora">Virtual Storage</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-6 md:px-8 pb-20">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Plus size={32} className="text-cyan-400" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-sora">Create Storage Room</h1>
              <p className="text-xl text-gray-300 font-inter">Set up your secure virtual storage space</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 md:p-10">
              {errors.general && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
                  <p className="text-red-400 text-sm font-inter">{errors.general}</p>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3 font-inter">
                    Room Name
                  </label>
                  <input
                    type="text"
                    value={formData.roomName}
                    onChange={(e) => setFormData({...formData, roomName: e.target.value})}
                    placeholder="e.g., My Project Files"
                    className={`w-full p-4 bg-white/5 border rounded-2xl text-white placeholder-gray-400 font-inter transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                      errors.roomName ? 'border-red-500/50' : 'border-white/20'
                    }`}
                  />
                  {errors.roomName && (
                    <p className="text-red-400 text-sm mt-2 font-inter">{errors.roomName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3 font-inter">
                    Admin Password
                  </label>
                  <div className="relative">
                    <Lock size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      value={formData.adminPassword}
                      onChange={(e) => setFormData({...formData, adminPassword: e.target.value})}
                      placeholder="Enter secure password"
                      className={`w-full pl-12 pr-4 py-4 bg-white/5 border rounded-2xl text-white placeholder-gray-400 font-inter transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                        errors.adminPassword ? 'border-red-500/50' : 'border-white/20'
                      }`}
                    />
                  </div>
                  {errors.adminPassword && (
                    <p className="text-red-400 text-sm mt-2 font-inter">{errors.adminPassword}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3 font-inter">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Key size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      placeholder="Confirm your password"
                      className={`w-full pl-12 pr-4 py-4 bg-white/5 border rounded-2xl text-white placeholder-gray-400 font-inter transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                        errors.confirmPassword ? 'border-red-500/50' : 'border-white/20'
                      }`}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-400 text-sm mt-2 font-inter">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              <button
                onClick={handleCreateRoom}
                disabled={isCreating}
                className="w-full mt-8 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-lg rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-inter"
              >
                {isCreating ? 'Creating Room...' : 'Create Room'}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}