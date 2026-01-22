
import React, { useState, useRef } from 'react';
import { extractTranscriptViaAI, fetchVideoDownloadData, extractTranscriptFromLocalVideo } from '../services/geminiService';
import { Platform, VideoMetadata, DownloadOption } from '../types';

const DownloaderSection: React.FC = () => {
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloadingIdx, setDownloadingIdx] = useState<number | null>(null);
  const [inputSource, setInputSource] = useState<'link' | 'upload'>('link');
  const [mode, setMode] = useState<'download' | 'transcript'>('download');
  const [result, setResult] = useState<{
    metadata: VideoMetadata;
    transcript?: string;
    downloads?: DownloadOption[];
  } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProcess = async () => {
    if (inputSource === 'link' && !url) return;
    if (inputSource === 'upload' && !file) return;

    setLoading(true);
    setResult(null);

    try {
      if (inputSource === 'link') {
        const data = await fetchVideoDownloadData(url);
        
        if (mode === 'transcript') {
          const text = await extractTranscriptViaAI(url);
          setResult({ 
            metadata: { 
              title: data.title, 
              author: data.author, 
              thumbnail: data.thumbnail || "https://picsum.photos/400/225", 
              platform: data.platform as Platform 
            }, 
            transcript: text 
          });
        } else {
          setResult({ 
            metadata: { 
              title: data.title, 
              author: data.author, 
              thumbnail: data.thumbnail || "https://picsum.photos/400/225", 
              platform: data.platform as Platform 
            }, 
            downloads: data.downloadOptions 
          });
        }
      } else {
        // Local File Processing
        if (!file) return;
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
          const base64 = (reader.result as string).split(',')[1];
          const text = await extractTranscriptFromLocalVideo(base64, file.type);
          setResult({ 
            metadata: { 
              title: file.name, 
              author: "Tệp tải lên", 
              platform: Platform.UNKNOWN, 
              thumbnail: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=400" 
            }, 
            transcript: text 
          });
          setLoading(false);
        };
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi khi kết nối với máy chủ AI. Vui lòng thử lại.");
      setLoading(false);
    } finally {
      if (inputSource === 'link') setLoading(false);
    }
  };

  const triggerDownload = async (option: DownloadOption, index: number) => {
    setDownloadingIdx(index);
    
    // Giả lập việc fetch link thực tế từ proxy hoặc giải mã link
    // Trong thực tế, đây là nơi bạn gọi một API trung gian hoặc mở link trực tiếp
    setTimeout(() => {
      try {
        const link = document.createElement('a');
        link.href = option.url;
        link.setAttribute('download', `${result?.metadata.title || 'video'}.${option.format.toLowerCase()}`);
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (e) {
        window.open(option.url, '_blank');
      }
      setDownloadingIdx(null);
    }, 1500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
          Tải Video & <span className="gradient-text">AI Transcript</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          {inputSource === 'link' 
            ? "Tải video Facebook, TikTok, YouTube không logo. Chất lượng HD/4K."
            : "Tải video của bạn lên để AI tự động chuyển đổi sang văn bản."
          }
        </p>
      </div>

      <div className="glass-morphism rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        {/* Input Source Toggles */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <div className="flex gap-2 p-1 bg-slate-800/50 rounded-xl">
            <button 
              onClick={() => { setInputSource('link'); setMode('download'); }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${inputSource === 'link' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400'}`}
            >
              Dùng Link
            </button>
            <button 
              onClick={() => { setInputSource('upload'); setMode('transcript'); }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${inputSource === 'upload' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400'}`}
            >
              Tải tệp lên
            </button>
          </div>

          <div className="flex gap-2 p-1 bg-slate-800/50 rounded-xl">
            <button 
              onClick={() => setMode('download')}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'download' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'text-slate-400'}`}
            >
              Tải Video
            </button>
            <button 
              onClick={() => setMode('transcript')}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'transcript' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'text-slate-400'}`}
            >
              Lấy Transcript
            </button>
          </div>
        </div>

        {inputSource === 'link' ? (
          <div className="relative group">
            <input 
              type="text" 
              placeholder="Dán link Facebook, TikTok, YouTube tại đây..."
              className="w-full bg-slate-900/60 border-2 border-slate-700 rounded-2xl px-6 py-5 text-lg focus:outline-none focus:border-blue-500 transition-all placeholder:text-slate-600 shadow-inner"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleProcess()}
            />
            <button 
              disabled={loading || !url}
              onClick={handleProcess}
              className="absolute right-3 top-3 bottom-3 px-8 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-[1.02] active:scale-95 text-white font-bold transition-all flex items-center gap-2 disabled:opacity-50 disabled:grayscale"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : mode === 'download' ? "Tải ngay" : "Xử lý AI"}
            </button>
          </div>
        ) : (
          <div 
            onClick={() => !loading && fileInputRef.current?.click()}
            className={`border-2 border-dashed ${loading ? 'border-slate-800' : 'border-slate-700 hover:border-purple-500'} rounded-3xl p-10 cursor-pointer transition-all bg-slate-900/30 flex flex-col items-center gap-4 text-center group`}
          >
            <input type="file" ref={fileInputRef} className="hidden" accept="video/*" onChange={handleFileChange} />
            <div className={`w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-purple-400 ${!loading && 'group-hover:scale-110'} transition-transform`}>
              {loading ? (
                <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              )}
            </div>
            <div>
              <p className="text-xl font-bold">{file ? file.name : "Kéo thả hoặc chọn Video từ máy"}</p>
              <p className="text-slate-500 text-sm mt-1">Hệ thống AI sẽ xử lý hình ảnh và âm thanh để tạo text.</p>
            </div>
            {file && !loading && (
              <button 
                onClick={(e) => { e.stopPropagation(); handleProcess(); }}
                className="mt-4 px-10 py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-2xl shadow-xl shadow-purple-600/20 transition-all"
              >
                Bắt đầu trích xuất Text
              </button>
            )}
          </div>
        )}
      </div>

      {result && !loading && (
        <div className="mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="glass-morphism rounded-3xl p-6 flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-2/5 aspect-video bg-slate-800 rounded-2xl overflow-hidden relative shadow-2xl border border-slate-700/50">
              <img src={result.metadata.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 px-3 py-1 bg-blue-600 text-[10px] font-bold rounded-md uppercase tracking-widest shadow-lg">
                {result.metadata.platform}
              </div>
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-3xl font-bold text-white leading-tight mb-2">{result.metadata.title}</h3>
                <p className="text-slate-400 font-medium flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-green-500"></span>
                   Nguồn: <span className="text-slate-200">{result.metadata.author}</span>
                </p>
              </div>
              
              {mode === 'download' && result.downloads && (
                <div className="grid grid-cols-1 gap-3 mt-6">
                  {result.downloads.map((opt, i) => (
                    <button 
                      key={i} 
                      disabled={downloadingIdx !== null}
                      onClick={() => triggerDownload(opt, i)}
                      className={`flex items-center justify-between p-5 rounded-2xl transition-all border group ${
                        downloadingIdx === i 
                        ? 'bg-blue-600/20 border-blue-500 cursor-wait' 
                        : 'bg-slate-800/40 border-slate-700 hover:border-blue-500 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${opt.format === 'MP3' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                           {opt.format === 'MP3' ? (
                             <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                           ) : (
                             <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>
                           )}
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-slate-100 text-lg">{opt.quality}</div>
                          <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">{opt.format} • {opt.size || 'Dung lượng cao'}</div>
                        </div>
                      </div>
                      
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${downloadingIdx === i ? 'bg-blue-500' : 'bg-slate-700 group-hover:bg-blue-600 text-white shadow-lg'}`}>
                        {downloadingIdx === i ? (
                          <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {(result.transcript || mode === 'transcript') && (
            <div className="glass-morphism rounded-[2.5rem] p-8 md:p-10 space-y-6 shadow-2xl border-t border-white/5">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-white">Bản ghi kịch bản AI</h4>
                    <p className="text-slate-500 text-sm">Được tạo tự động bởi Gemini Flash 2.5</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(result.transcript || '');
                      alert("Đã sao chép kịch bản vào bộ nhớ tạm!");
                    }}
                    className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-sm font-bold rounded-xl border border-slate-700 transition-all flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3" /></svg>
                    Sao chép
                  </button>
                </div>
              </div>
              
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/50 pointer-events-none rounded-2xl"></div>
                <div className="p-8 bg-slate-900/90 rounded-[1.5rem] border border-slate-800/50 leading-[1.8] text-slate-300 whitespace-pre-wrap max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 hover:scrollbar-thumb-blue-600 transition-all text-lg font-light">
                  {result.transcript || "Đang phân tích nội dung..."}
                </div>
              </div>

              <div className="flex justify-center pt-4">
                 <p className="text-slate-500 text-xs flex items-center gap-2 italic">
                   <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm-1-5a1 1 0 112 0v2a1 1 0 11-2 0v-2zm1-5a1 1 0 110 2 1 1 0 010-2z"/></svg>
                   Mẹo: Bản kịch bản có độ chính xác 98% cho tiếng Việt.
                 </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DownloaderSection;
