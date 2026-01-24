import { useState, useRef } from 'react';
import ColorAnalysisQuiz from '../components/ColorAnalysisQuiz';
import { Camera, Send, X, Upload, Loader2, Sparkles } from 'lucide-react';
import axios from 'axios';

export default function ColorAnalysis() {
  const [showQuiz, setShowQuiz] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [videoStream, setVideoStream] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [mode, setMode] = useState('choose');

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const openModal = () => {
    setShowModal(true);
    setMode('choose');
    setImagePreview(null);
    setError(null);
  };

  const closeModal = () => {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
      setVideoStream(null);
    }
    setShowModal(false);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      setVideoStream(stream);
      if (videoRef.current) videoRef.current.srcObject = stream;
      setMode('camera');
    } catch (err) {
      setError('Camera access denied.');
    }
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    // Lower quality to 0.6 to prevent "Payload Too Large" errors
    setImagePreview(canvas.toDataURL('image/jpeg', 0.6));
    if (videoStream) videoStream.getTracks().forEach(track => track.stop());
    setMode('preview');
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setMode('preview');
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    if (!imagePreview) return;
    setLoading(true);
    setError(null);
    
    try {
      // Clean base64 and verify API URL
      const base64Data = imagePreview.split(',')[1];
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000'; // Fallback for local testing
      
      const response = await axios.post(`${apiUrl}/api/color-analysis`,
        { image: base64Data },
        { 
            headers: { 'Content-Type': 'application/json' },
            timeout: 30000 // Give it 30 seconds to process
        }
      );

      if (response.data?.analysis) {
        setAnalysisResult(response.data.analysis);
        setShowModal(false);
        setShowQuiz(true);
      }
    } catch (err) {
      console.error("Full Error Object:", err);
      if (err.response?.status === 413) {
        setError('Image is too large for the server.');
      } else if (err.code === 'ECONNABORTED') {
        setError('Analysis took too long. Try a smaller photo.');
      } else {
        setError('Connection failed. Is the backend server running?');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfcfb] text-slate-800 flex flex-col items-center justify-center overflow-x-hidden font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Inter:wght@400;600&display=swap');
        .font-serif-aesthetic { font-family: 'Playfair Display', serif; }
        .font-sans-aesthetic { font-family: 'Inter', sans-serif; }
        .btn-radial-gradient {
          background: radial-gradient(circle at center, #ec4899 0%, #be185d 100%);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .btn-radial-gradient:hover {
          background: radial-gradient(circle at center, #f472b6 0%, #db2777 100%);
          transform: translateY(-2px);
          box-shadow: 0 12px 24px -6px rgba(219, 39, 119, 0.3);
        }
      `}</style>

      {!showQuiz && (
        <div className="w-full max-w-2xl px-6 pt-12 pb-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h1 className="text-5xl md:text-6xl font-serif-aesthetic italic mb-4 text-slate-900 tracking-tight">
            Personal Color Harmony
          </h1>
          <p className="text-slate-400 font-sans-aesthetic uppercase tracking-[0.25em] text-[10px] mb-12">
            The Science of Your Natural Glow
          </p>
        </div>
      )}

      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl px-4">
        <div className={`w-full bg-white transition-all duration-700 ease-in-out ${showQuiz ? 'h-[80vh] rounded-[2.5rem] shadow-2xl border border-pink-50' : 'max-w-md shadow-lg rounded-[2.5rem]'}`}>
          
          {!showQuiz ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-10">
              <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center ring-8 ring-pink-50/50">
                <Sparkles className="text-pink-400 w-10 h-10 animate-pulse" />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-serif-aesthetic text-slate-800">Welcome to your palette.</h2>
                <button
                  onClick={() => setShowQuiz(true)}
                  className="btn-radial-gradient w-full text-white py-5 rounded-full font-sans-aesthetic font-semibold tracking-widest text-xs shadow-xl"
                >
                  START THE JOURNEY
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col h-full overflow-hidden animate-in fade-in duration-700 p-8">
              {analysisResult && (
                <div className="mb-10 p-8 bg-slate-50 rounded-3xl border-l-8 border-pink-400">
                  <p className="text-slate-700 font-serif-aesthetic italic text-xl">"{analysisResult}"</p>
                </div>
              )}
              <ColorAnalysisQuiz />
            </div>
          )}
        </div>
      </main>

      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[90%] max-w-sm">
        <div className="bg-white/80 backdrop-blur-2xl border border-white/40 shadow-xl rounded-full p-2 flex items-center">
          <button onClick={openModal} className="p-4 btn-radial-gradient text-white rounded-full">
            <Camera size={20} />
          </button>
          <div className="flex-1 px-5 font-sans-aesthetic text-[10px] tracking-widest text-slate-400 uppercase">Analysis Menu</div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-[3rem] p-10 max-w-sm w-full relative">
            <button onClick={closeModal} className="absolute top-10 right-10 text-slate-300 hover:text-slate-800">
              <X size={20} />
            </button>
            <h3 className="text-2xl font-serif-aesthetic text-slate-900 text-center mb-10">Capture Essence</h3>
            
            {error && <div className="mb-6 p-4 bg-red-50 text-red-500 rounded-2xl text-[10px] font-bold text-center">{error}</div>}
            
            {mode === 'choose' && (
              <div className="space-y-4">
                <button onClick={startCamera} className="w-full py-5 border border-slate-100 rounded-2xl font-sans-aesthetic text-[10px] font-bold tracking-widest hover:bg-slate-50 transition-all">TAKE PHOTO</button>
                <button onClick={() => fileInputRef.current?.click()} className="w-full py-5 border border-slate-100 rounded-2xl font-sans-aesthetic text-[10px] font-bold tracking-widest hover:bg-slate-50 transition-all">UPLOAD GALLERY</button>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
              </div>
            )}

            {mode === 'camera' && (
              <div className="space-y-6 text-center">
                <div className="rounded-[2rem] overflow-hidden aspect-square bg-slate-100"><video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" /></div>
                <button onClick={capturePhoto} className="btn-radial-gradient w-full text-white py-5 rounded-2xl font-sans-aesthetic font-bold text-[10px] tracking-widest">SNAP</button>
              </div>
            )}

            {mode === 'preview' && (
              <div className="space-y-6">
                <div className="rounded-[2rem] overflow-hidden aspect-square"><img src={imagePreview} alt="Preview" className="w-full h-full object-cover" /></div>
                <button onClick={analyzeImage} disabled={loading} className="btn-radial-gradient w-full text-white py-5 rounded-2xl font-sans-aesthetic font-bold text-[10px] tracking-widest flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="animate-spin" size={16} /> : "BEGIN ANALYSIS"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}