import { useState, useRef } from 'react';
import ColorAnalysisQuiz from '../components/ColorAnalysisQuiz';      // adjust path
import ColorAnalysisResult from '../components/ColorAnalysisResult'; // adjust path
import { Camera, X, Loader2, Sparkles } from 'lucide-react';
import axios from 'axios';

export default function ColorAnalysis() {
  const [showQuiz, setShowQuiz] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null); // from photo
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

  const [showModal, setShowModal] = useState(false);

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
      const base64Data = imagePreview.split(',')[1];
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${apiUrl}/api/color-analysis`, 
        { image: base64Data },
        { headers: { 'Content-Type': 'application/json' }, timeout: 30000 }
      );

      if (response.data?.analysis) {
        setAnalysisResult(response.data.analysis);
      }
    } catch (err) {
      console.error(err);
      setError('Photo analysis failed. Try again or skip to quiz.');
    } finally {
      setLoading(false);
      closeModal();
      setShowQuiz(true);
    }
  };

  const handleQuizComplete = (result) => {
    setQuizResult(result);
    setShowResult(true);
  };

  const resetAll = () => {
    setShowQuiz(false);
    setShowResult(false);
    setQuizResult(null);
    setAnalysisResult(null);
    setImagePreview(null);
  };

  return (
    <div className="min-h-screen bg-[#fdfcfb] text-slate-800 flex flex-col items-center justify-center font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,700&family=Inter:wght@400;600&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
        .btn-radial { background: radial-gradient(circle at center, #ec4899 0%, #be185d 100%); }
        .btn-radial:hover { background: radial-gradient(circle at center, #f472b6 0%, #db2777 100%); }
      `}</style>

      {!showQuiz && !showResult && (
        <div className="w-full max-w-2xl px-6 pt-12 pb-8 text-center">
          <h1 className="text-5xl md:text-6xl font-serif italic mb-4 text-slate-900">
            Personal Color Harmony
          </h1>
          <p className="text-slate-400 uppercase tracking-widest text-xs mb-12">
            Discover Your Perfect Palette
          </p>
        </div>
      )}

      <main className="flex-1 flex flex-col items-center w-full max-w-4xl px-4">
        <div className={`w-full transition-all duration-700 ${showQuiz || showResult ? 'rounded-3xl shadow-2xl border border-pink-50' : 'max-w-md shadow-xl rounded-[3rem]'}`}>
          
          {!showQuiz && !showResult ? (
            <div className="p-12 text-center space-y-10">
              <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mx-auto ring-8 ring-pink-50/50">
                <Sparkles className="text-pink-500 w-12 h-12 animate-pulse" />
              </div>
              <div className="space-y-6">
                <h2 className="text-3xl font-serif text-slate-800">Find Your Season</h2>
                <button
                  onClick={() => setShowQuiz(true)}
                  className="btn-radial w-full text-white py-5 rounded-full font-semibold tracking-wider shadow-xl"
                >
                  START ANALYSIS
                </button>
              </div>
            </div>
          ) : showResult ? (
            <div className="p-8">
              <ColorAnalysisResult result={quizResult} onReset={resetAll} />
            </div>
          ) : (
            <div className="flex flex-col h-[80vh] overflow-hidden p-6 md:p-10">
              {analysisResult && (
                <div className="mb-8 p-6 bg-pink-50/60 rounded-2xl border-l-4 border-pink-400">
                  <p className="text-slate-700 italic">AI Insight: {analysisResult}</p>
                </div>
              )}
              <ColorAnalysisQuiz onComplete={handleQuizComplete} />
            </div>
          )}
        </div>
      </main>

      {/*{!showResult && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-sm z-20">
          <div className=" /90 backdrop-blur-xl border border-white/50 shadow-2xl rounded-full p-3 flex items-center">
            <button onClick={openModal} className="p-4 btn-radial text-white rounded-full">
              <Camera size={22} />
            </button>
            <div className="flex-1 text-center text-xs tracking-widest text-slate-500 uppercase font-medium">
              Optional Photo Analysis
            </div>
          </div>
        </div>
      )}*/}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="  rounded-3xl p-8 md:p-10 max-w-md w-full relative">
            <button onClick={closeModal} className="absolute top-5 right-5 text-slate-400 hover:text-slate-800">
              <X size={24} />
            </button>
            <h3 className="text-2xl font-serif text-center mb-8">Capture Your Essence</h3>

            {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-center text-sm">{error}</div>}

            {mode === 'choose' && (
              <div className="space-y-4">
                <button onClick={startCamera} className="w-full py-5 border border-slate-200 rounded-2xl hover:bg-slate-50 font-medium">Take Photo</button>
                <button onClick={() => fileInputRef.current?.click()} className="w-full py-5 border border-slate-200 rounded-2xl hover:bg-slate-50 font-medium">Upload from Gallery</button>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
              </div>
            )}

            {mode === 'camera' && (
              <div className="space-y-6">
                <div className="rounded-2xl overflow-hidden aspect-square bg-slate-100 border">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                </div>
                <button onClick={capturePhoto} className="btn-radial w-full text-white py-5 rounded-2xl font-semibold">SNAP</button>
              </div>
            )}

            {mode === 'preview' && (
              <div className="space-y-6">
                <div className="rounded-2xl overflow-hidden aspect-square border">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <button 
                  onClick={analyzeImage} 
                  disabled={loading}
                  className="btn-radial w-full text-white py-5 rounded-2xl font-semibold flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : "ANALYZE PHOTO"}
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