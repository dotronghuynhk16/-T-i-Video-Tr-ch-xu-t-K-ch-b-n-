
import React from 'react';
import Navbar from './components/Navbar';
import DownloaderSection from './components/DownloaderSection';
import FeaturesGrid from './components/FeaturesGrid';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen flex flex-col selection:bg-blue-500/30">
      <Navbar />
      
      <main className="flex-grow">
        <div className="relative overflow-hidden pt-20 pb-10">
          {/* Decorative background gradients */}
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[20%] right-[-10%] w-[30%] h-[30%] bg-purple-600/10 blur-[120px] rounded-full"></div>
          
          <DownloaderSection />
        </div>
        
        <FeaturesGrid />
        
        <section className="py-20 max-w-4xl mx-auto px-6 text-center">
          <div className="glass-morphism p-12 rounded-[3rem] space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h2v2h-2v-2zm0-10h2v8h-2V6z"/>
              </svg>
            </div>
            <h2 className="text-3xl font-bold">Lưu ý quan trọng</h2>
            <p className="text-slate-400 leading-relaxed">
              Chúng tôi tôn trọng quyền sở hữu trí tuệ của người sáng tạo nội dung. VidSwift AI được tạo ra cho mục đích sử dụng cá nhân, học tập và lưu trữ ngoại tuyến. Vui lòng không sử dụng video tải xuống vào mục đích thương mại mà không có sự đồng ý của tác giả.
            </p>
            <div className="flex justify-center gap-4">
              <div className="px-4 py-2 bg-slate-800 rounded-full text-xs font-semibold text-slate-300">100% Bảo mật</div>
              <div className="px-4 py-2 bg-slate-800 rounded-full text-xs font-semibold text-slate-300">Không cần cài đặt</div>
              <div className="px-4 py-2 bg-slate-800 rounded-full text-xs font-semibold text-slate-300">Không giới hạn</div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
