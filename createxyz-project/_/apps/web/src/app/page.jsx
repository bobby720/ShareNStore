import { useState } from "react";
import { HardDrive, Plus, Search, Upload, Shield, Zap } from "lucide-react";

export default function LandingPage() {
  const [isHovered, setIsHovered] = useState(null);

  const navigateTo = (path) => {
    window.location.href = path;
  };

  const features = [
    {
      icon: HardDrive,
      title: "Virtual Storage Bars",
      description: "Visualize your storage space as intuitive containers",
    },
    {
      icon: Shield,
      title: "Secure Access",
      description: "Password-protected rooms with admin controls",
    },
    {
      icon: Upload,
      title: "Smart File Management",
      description: "Upload images, videos, documents, and audio files",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] dark:from-[#000000] dark:via-[#0F0F23] dark:to-[#0A1628]">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-cyan-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="p-6 md:p-8">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center">
                <HardDrive size={24} className="text-white" />
              </div>
              <span className="text-2xl font-bold text-white font-sora">
                Virtual Storage
              </span>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="px-6 md:px-8 pb-20">
          <div className="max-w-7xl mx-auto">
            {/* Hero Content */}
            <div className="text-center mb-16 pt-12 md:pt-20">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 font-sora leading-tight">
                Virtual Storage
                <span className="block text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text">
                  Rooms
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed font-inter">
                Create secure, password-protected storage spaces. Upload,
                organize, and access your files with futuristic simplicity.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
                <button
                  onClick={() => navigateTo("/create-room")}
                  onMouseEnter={() => setIsHovered("create")}
                  onMouseLeave={() => setIsHovered(null)}
                  className={`group relative overflow-hidden px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-lg transition-all duration-300 font-inter ${
                    isHovered === "create"
                      ? "scale-105 shadow-2xl shadow-cyan-500/25"
                      : "hover:scale-105"
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center gap-3">
                    <Plus size={20} />
                    Create Room
                  </div>
                </button>

                <button
                  onClick={() => navigateTo("/access-room")}
                  onMouseEnter={() => setIsHovered("access")}
                  onMouseLeave={() => setIsHovered(null)}
                  className={`group relative overflow-hidden px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold text-lg transition-all duration-300 font-inter ${
                    isHovered === "access"
                      ? "scale-105 bg-white/20 shadow-2xl"
                      : "hover:scale-105 hover:bg-white/15"
                  }`}
                >
                  <div className="relative flex items-center gap-3">
                    <Search size={20} />
                    Access Room
                  </div>
                </button>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-20">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="group relative p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-105"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Icon size={32} className="text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-4 font-bricolage">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed font-inter">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Storage Visualization Demo */}
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 font-sora">
                Visual Storage Management
              </h2>
              <div className="max-w-2xl mx-auto">
                <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-white font-medium font-inter">
                      Room #VR-2024-X9K7
                    </span>
                    <span className="text-cyan-400 font-medium font-inter">
                      2.4GB / 10GB
                    </span>
                  </div>
                  <div className="w-full h-6 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: "24%" }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-center mt-6 gap-4">
                    <Zap size={16} className="text-cyan-400" />
                    <span className="text-gray-300 text-sm font-inter">
                      Real-time storage visualization
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
