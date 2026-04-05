import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Shield } from 'lucide-react';

const AuthLayout = () => {
  const token = localStorage.getItem('token');
  
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#f8fafc]">
      {/* Left side: branding/promo */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-secondary p-12 items-center justify-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-700" />
        </div>
        
        <div className="relative z-10 text-white max-w-md text-center">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/20 shadow-xl">
            <Shield size={48} className="text-white" />
          </div>
          <h1 className="text-5xl font-extrabold mb-6 tracking-tight">AuraSecureAI</h1>
          <p className="text-xl text-white/80 font-medium leading-relaxed">
            Next-generation hazard prediction and safety monitoring powered by Advanced Machine Learning.
          </p>
        </div>
      </div>

      {/* Right side: auth forms */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center gap-3 mb-12">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Shield className="text-primary" size={28} />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              AuraSecureAI
            </span>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
