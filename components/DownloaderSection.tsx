
import React, { useState } from 'react';
import { extractTranscriptViaAI, getMetadataViaAI } from '../services/geminiService';
import { Platform, VideoMetadata, DownloadOption } from '../types';

const DownloaderSection: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'download' | 'transcript'>('download');
  const [result, setResult] = useState<{
    metadata: VideoMetadata;
    transcript?: string;
    downloads?: DownloadOption[];
  } | null>(null);

  const detectPlatform = (url: string): Platform => {
    if (url.includes('tiktok.com')) return Platform.TIKTOK;
    if (url.includes('facebook.com') || url.includes('fb.watch')) return Platform.FACEBOOK;
    if (url.includes('youtube.com') || url.includes('youtu.be')) return Platform.YOUTUBE;
    return Platform.UNKNOWN;
  };

  const handleProcess = async () => {
    if (!url) return;
    setLoading(true);
    try {
      const platform = detectPlatform(url);
      const metadata = await getMetadataViaAI(url);
      
      if (mode === 'transcript') {
        const text = await extractTranscriptViaAI(url);
        setResult({ metadata: { ...metadata, platform }, transcript: text });
      } else {
        // Mocking download options for a production-like UI experience
        const mockDownloads: DownloadOption[] = [
          { quality: '1080p (HD)', format: 'MP4', size: '12.4 MB', url: '#', noWatermark: true },
          { quality: '720p', format: 'MP4', size: '7.8 MB', url: '#', noWatermark: true },
          { quality: 'MP3 Audio', format: 'MP3', size: '2.1 MB', url: '#', noWatermark: true }
        ];
        setResult({ metadata: { ...metadata, platform }, downloads: mockDownloads });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
          Tải Video & <span className="gradient-text">Trích xuất Kịch bản</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Công cụ mạnh mẽ hỗ trợ TikTok, Facebook, YouTube. Tải không logo, trích xuất text 100% tự động bằng AI.
        </p>
      </div>

      <div className="glass-morphism rounded-3xl p-6 md:p-8 shadow-2xl">
        <div className="flex gap-2 mb-6 p-1 bg-slate-800/50 rounded-xl w-fit mx-auto">
          <button 
            onClick={() => setMode('download')}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'download' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            Tải Video
          </button>
          <button 
            onClick={() => setMode('transcript')}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'transcript' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            Trích xuất Transcript
          </button>
        </div>

        <div className="relative group">
          <input 
            type="text" 
            placeholder="Dán đường link Facebook, TikTok, YouTube vào đây..."
            className="w-full bg-slate-900/50 border-2 border-slate-700 rounded-2xl px-6 py-5 text-lg focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-600"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button 
            disabled={loading}
            onClick={handleProcess}
            className="absolute right-3 top-3 bottom-3 px-8 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang xử lý...
              </span>
            ) : (
              mode === 'download' ? 'Tải ngay' : 'Trích xuất'
            )}
          </button>
        </div>

        <p className="mt-4 text-xs text-center text-slate-500">
          Bằng cách sử dụng dịch vụ của chúng tôi, bạn đồng ý với Điều khoản sử dụng của VidSwift AI.
        </p>
      </div>

      {result && !loading && (
        <div className="mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="glass-morphism rounded-3xl p-6 flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3 aspect-video bg-slate-800 rounded-2xl overflow-hidden relative shadow-inner">
              <img src={result.metadata.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 px-3 py-1 bg-black/60 backdrop-blur text-[10px] font-bold rounded-full uppercase tracking-wider">
                {result.metadata.platform}
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <h3 className="text-2xl font-bold">{result.metadata.title}</h3>
              <p className="text-slate-400 font-medium">Tác giả: <span className="text-slate-200">{result.metadata.author}</span></p>
              
              {mode === 'download' && result.downloads && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  {result.downloads.map((opt, i) => (
                    <button key={i} className="flex items-center justify-between p-4 bg-slate-800/40 border border-slate-700 hover:border-blue-500 hover:bg-slate-800 transition-all rounded-xl group">
                      <div className="text-left">
                        <div className="font-bold text-slate-200">{opt.quality}</div>
                        <div className="text-xs text-slate-500 uppercase">{opt.format} • {opt.size}</div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {mode === 'transcript' && result.transcript && (
            <div className="glass-morphism rounded-3xl p-8 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xl font-bold flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Nội dung kịch bản (Transcript)
                </h4>
                <button 
                  onClick={() => navigator.clipboard.writeText(result.transcript!)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-sm rounded-lg border border-slate-600 transition-colors"
                >
                  Sao chép text
                </button>
              </div>
              <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800 leading-relaxed text-slate-300 whitespace-pre-wrap max-h-[400px] overflow-y-auto">
                {result.transcript}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DownloaderSection;
