import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const DashboardLayout = () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-6 py-10 animate-in fade-in slide-in-from-top-4 duration-500">
        <Outlet />
      </main>
      <footer className="py-8 border-t border-gray-100 bg-white/50">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400 text-sm font-medium">
            &copy; {new Date().getFullYear()} AuraSecureAI. Premium Machine Learning Protection.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;
