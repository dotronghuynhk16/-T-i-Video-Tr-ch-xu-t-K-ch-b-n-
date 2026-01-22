
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-12 px-6 border-t border-slate-800 bg-slate-950">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-center md:text-left">
          <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-600 rounded flex items-center justify-center">
               <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-lg font-bold">VidSwift AI</span>
          </div>
          <p className="text-slate-500 text-sm max-w-xs">
            Công cụ hỗ trợ tải đa phương tiện và trích xuất kịch bản AI miễn phí hàng đầu.
          </p>
        </div>
        <div className="flex gap-10 text-sm font-medium text-slate-400">
          <a href="#" className="hover:text-white transition-colors">Điều khoản</a>
          <a href="#" className="hover:text-white transition-colors">Bảo mật</a>
          <a href="#" className="hover:text-white transition-colors">Liên hệ</a>
          <a href="#" className="hover:text-white transition-colors">API</a>
        </div>
        <div className="text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} VidSwift. Toàn bộ bản quyền được bảo lưu.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
