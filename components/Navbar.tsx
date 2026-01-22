
import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className="sticky top-0 z-50 glass-morphism px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <span className="text-xl font-bold gradient-text">VidSwift AI</span>
      </div>
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
        <a href="#" className="hover:text-blue-400 transition-colors">Trang chủ</a>
        <a href="#" className="hover:text-blue-400 transition-colors">Giới thiệu</a>
        <a href="#" className="hover:text-blue-400 transition-colors">Điều khoản</a>
        <button className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md shadow-blue-600/20">
          Sử dụng miễn phí
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
