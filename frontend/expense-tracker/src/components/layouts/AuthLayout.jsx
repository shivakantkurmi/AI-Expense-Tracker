import React from "react";
import { FiTrendingUp } from "react-icons/fi";

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex flex-col items-center justify-center px-4 py-10 relative overflow-hidden">
      
      {/* Animated Background Blobs */}
      <div className="absolute top-0 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute top-40 -right-32 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-1/2 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>

      <div className="relative z-10 w-full">
        {/* Header - Logo & Title */}
        <div className="w-full text-center mb-12">
          <div className="flex flex-col items-center gap-4 mb-4">
            {/* Logo Icon */}
            <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl text-white shadow-xl hover:shadow-2xl transition-shadow">
              <FiTrendingUp className="w-10 h-10" />
            </div>
            {/* Title */}
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
              Expense Tracker
            </h1>
          </div>
          <p className="text-gray-700 text-lg font-medium mb-1">Smart Finance Management</p>
          <p className="text-gray-500 text-sm">Track, analyze & optimize your spending with AI insights</p>
          <div className="h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 w-20 mx-auto mt-4 rounded-full shadow-lg"></div>
        </div>

        {/* Form Card Container */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 sm:p-10 border border-gray-100">
            {children}
          </div>

          {/* Security Badge */}
          <div className="text-center mt-6 text-xs text-gray-500 flex items-center justify-center gap-2">
            <div className="w-1 h-1 bg-green-500 rounded-full"></div>
            <span>🔒 Secure & Encrypted • Your data is safe</span>
            <div className="w-1 h-1 bg-green-500 rounded-full"></div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.3; }
        }
        .animate-pulse {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default AuthLayout;
