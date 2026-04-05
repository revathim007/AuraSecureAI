import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Zap, Activity, ArrowRight, CheckCircle } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col overflow-hidden">
      {/* Navbar */}
      <nav className="container mx-auto px-6 h-20 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
            <Shield className="text-primary" size={24} />
          </div>
          <span className="text-2xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent tracking-tight">
            AuraSecureAI
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-bold text-gray-600 hover:text-primary transition-colors px-4">
            Login
          </Link>
          <Link to="/register" className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold shadow-soft hover:bg-primary-dark transition-all active:scale-95">
            Join Now
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center container mx-auto px-6 relative py-20 text-center">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary rounded-full blur-[150px] animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 max-w-4xl space-y-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-full shadow-soft animate-in fade-in slide-in-from-top-4 duration-700">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Next-Gen Safety System</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-gray-800 tracking-tight leading-[1.1] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Smart Hazard <br />
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent">
              Prediction AI
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            Protect your environment with real-time sensor analysis powered by advanced Gradient Boosting Machine Learning.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <Link to="/register">
              <button className="group relative px-10 py-5 bg-primary text-white rounded-[2rem] font-black text-xl shadow-premium hover:bg-primary-dark hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-3">
                Get Started
                <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-20 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
            <div className="p-8 bg-white/50 backdrop-blur-sm rounded-[2.5rem] border border-white shadow-soft flex flex-col items-center text-center space-y-4 hover:bg-white transition-colors group">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                <Zap size={28} />
              </div>
              <h3 className="text-lg font-black text-gray-800">Fast Detection</h3>
              <p className="text-sm text-gray-500 font-medium">Instant analysis of Gas, Temperature, and Smoke levels.</p>
            </div>
            <div className="p-8 bg-white/50 backdrop-blur-sm rounded-[2.5rem] border border-white shadow-soft flex flex-col items-center text-center space-y-4 hover:bg-white transition-colors group">
              <div className="w-14 h-14 bg-primary-light rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Activity size={28} />
              </div>
              <h3 className="text-lg font-black text-gray-800">ML Precision</h3>
              <p className="text-sm text-gray-500 font-medium">Powered by data-driven models, avoiding biased hardcoded rules.</p>
            </div>
            <div className="p-8 bg-white/50 backdrop-blur-sm rounded-[2.5rem] border border-white shadow-soft flex flex-col items-center text-center space-y-4 hover:bg-white transition-colors group">
              <div className="w-14 h-14 bg-secondary-light rounded-2xl flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                <Shield size={28} />
              </div>
              <h3 className="text-lg font-black text-gray-800">Secure Logs</h3>
              <p className="text-sm text-gray-500 font-medium">All predictions are securely stored in SQL Server for audit.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-10 text-center relative z-10">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em]">
          &copy; {new Date().getFullYear()} AuraSecureAI • Industrial Grade Protection
        </p>
      </footer>
    </div>
  );
};

export default Home;
