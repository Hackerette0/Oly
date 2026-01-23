// src/pages/ColorAnalysis.jsx
import { useState } from 'react';
import ColorAnalysisQuiz from '../components/ColorAnalysisQuiz';
import { Camera, Send } from 'lucide-react';   // ← make sure you have lucide-react installed

export default function ColorAnalysis() {
  const [showQuiz, setShowQuiz] = useState(false);

  const quickSuggestions = [
    "What's my undertone?",
    "Best colors for warm skin",
    "Jewelry that suits cool tones",
    "Olive skin makeup tips",
    "High contrast winter palette",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50 flex flex-col">
      {/* Header / Title Area */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-400 text-white py-10 px-6 text-center shadow-md">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Personal Color Harmony 🌸</h1>
        <p className="text-pink-100 max-w-md mx-auto">
          Discover your undertone & the shades that make you glow naturally
        </p>
      </div>

      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-4 pt-6 pb-24">
        {/* Chat-like container */}
        <div className="flex-1 bg-white/70 backdrop-blur-sm rounded-3xl border border-pink-200 shadow-xl overflow-hidden flex flex-col">
          {!showQuiz ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <span className="text-4xl">✨</span>
              </div>
              <h2 className="text-2xl font-semibold text-pink-700 mb-4">
                Hi! 🌷 I'm your Color Harmony Assistant
              </h2>
              <p className="text-gray-600 mb-8 max-w-md">
                Answer a few quick questions and I'll tell you your undertone (warm / cool / olive) and the most flattering colors & jewelry tones for you!
              </p>

              <button
                onClick={() => setShowQuiz(true)}
                className="bg-pink-500 hover:bg-pink-600 text-white px-10 py-4 rounded-full text-lg font-medium shadow-lg transform hover:scale-105 transition-all"
              >
                Start Color Quiz →
              </button>
            </div>
          ) : (
            <div className="flex-1 p-5 overflow-y-auto">
              <ColorAnalysisQuiz />
            </div>
          )}
        </div>

        {/* Quick suggestions */}
        {!showQuiz && (
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            {quickSuggestions.map((text, i) => (
              <button
                key={i}
                onClick={() => setShowQuiz(true)}
                className="bg-white border border-pink-300 text-pink-600 px-5 py-3 rounded-full text-sm font-medium hover:bg-pink-50 hover:border-pink-400 transition shadow-sm"
              >
                {text}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bottom input bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-pink-200 shadow-lg px-4 py-3 z-10">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button className="p-3 text-pink-500 hover:text-pink-600 rounded-full hover:bg-pink-50 transition">
            <Camera size={24} />
          </button>

          <input
            type="text"
            placeholder="Ask about your colors... (coming soon)"
            className="flex-1 bg-pink-50 border border-pink-200 rounded-full px-6 py-3 focus:outline-none focus:border-pink-400 placeholder:text-pink-400/70"
            disabled
          />

          <button className="p-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition">
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
