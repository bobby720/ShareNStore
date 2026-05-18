import { useState } from 'react';
import { HardDrive, ArrowLeft, Search, Lock, Eye, EyeOff } from 'lucide-react';

export default function AccessRoomPage() {
  const [formData, setFormData] = useState({
    roomId: '',
    password: ''
  });
  const [isAccessing, setIsAccessing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.roomId.trim()) {
      newErrors.roomId = 'Room ID is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAccessRoom = async () => {
    if (!validateForm()) return;

    setIsAccessing(true);
    
    try {
      const response = await fetch('/api/rooms/access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId: formData.roomId.trim(),
          password: formData.password,
        }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          setErrors({ roomId: 'Room not found' });
        } else if (response.status === 401) {
          setErrors({ password: 'Invalid password' });
        } else {
          setErrors({ general: 'Failed to access room. Please try again.' });
        }
        return;
      }

      // Navigate to room dashboard
      window.location.href = `/room/${formData.roomId}?password=${encodeURIComponent(formData.password)}`;
    } catch (error) {
      console.error('Error accessing room:', error);
      setErrors({ general: 'Failed to access room. Please try again.' });
    } finally {
      setIsAccessing(false);
    }
  };

  const navigateBack = () => {
    window.location.href = '/';
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAccessRoom();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] dark:from-[#000000] dark:via-[#0F0F23] dark:to-[#0A1628]">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-cyan-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
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
                <Search size={32} className="text-cyan-400" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-sora">Access Storage Room</h1>
              <p className="text-xl text-gray-300 font-inter">Enter your Room ID and password to unlock</p>
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
                    Room ID
                  </label>
                  <div className="relative">
                    <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={formData.roomId}
                      onChange={(e) => setFormData({...formData, roomId: e.target.value})}
                      onKeyPress={handleKeyPress}
                      placeholder="e.g., VR-2024-X9K7"
                      className={`w-full pl-12 pr-4 py-4 bg-white/5 border rounded-2xl text-white placeholder-gray-400 font-mono transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                        errors.roomId ? 'border-red-500/50' : 'border-white/20'
                      }`}
                    />
                  </div>
                  {errors.roomId && (
                    <p className="text-red-400 text-sm mt-2 font-inter">{errors.roomId}</p>
                  )}
                  <p className="text-gray-400 text-xs mt-2 font-inter">Enter the Room ID you received when creating the room</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3 font-inter">
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter room password"
                      className={`w-full pl-12 pr-12 py-4 bg-white/5 border rounded-2xl text-white placeholder-gray-400 font-inter transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${
                        errors.password ? 'border-red-500/50' : 'border-white/20'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors duration-200"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-400 text-sm mt-2 font-inter">{errors.password}</p>
                  )}
                </div>
              </div>

              <button
                onClick={handleAccessRoom}
                disabled={isAccessing}
                className="w-full mt-8 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-lg rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-inter"
              >
                {isAccessing ? 'Accessing Room...' : 'Access Room'}
              </button>

              <div className="mt-8 text-center">
                <p className="text-gray-400 text-sm font-inter">
                  Don't have a room yet?{' '}
                  <button
                    onClick={() => window.location.href = '/create-room'}
                    className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200 underline"
                  >
                    Create one here
                  </button>
                </p>
              </div>
            </div>

            {/* Recent Rooms (Future Enhancement) */}
            <div className="mt-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 font-bricolage">Quick Tips</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-300 text-sm font-inter">Room IDs follow the format: VR-YEAR-XXXXXX</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-300 text-sm font-inter">Make sure to use the correct password provided by the room admin</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-300 text-sm font-inter">All access attempts are logged for security</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}