import React, { useState } from 'react';

const questions = [
  { id: 1, q: "Look at your wrist veins. What color are they?", options: ["Blue or Purple", "Green or Olive", "I see both"] },
  { id: 2, q: "How does your skin react to the sun?", options: ["Burns instantly", "Burns then slowly tans", "Tans easily"] },
  { id: 3, q: "Which jewelry brings you the most 'glow'?", options: ["Cool Silver", "Warm Gold", "Both feel harmonious"] },
  { id: 4, q: "What best describes your eyes?", options: ["Bright & Piercing", "Soft & Muted", "Deep & Rich"] },
  { id: 5, q: "What is the contrast between your hair and skin?", options: ["Strikingly High", "Balanced/Medium", "Soft/Low Contrast"] },
  { id: 6, q: "Your natural hair highlights in the sun are...", options: ["Ashy/Sandy", "Golden/Reddish", "Neutral/Dark"] },
  { id: 7, q: "Which 'Neutral' makes you look more awake?", options: ["Stark White", "Creamy Ivory", "Soft Grey"] },
  { id: 8, q: "Your natural lip color is closest to...", options: ["Cool Mauve", "Warm Peach", "Deep Rose"] },
  { id: 9, q: "When you wear black, you feel...", options: ["Powerful & Clear", "A bit washed out", "It feels too heavy"] },
  { id: 10, q: "Your skin undertone feels more...", options: ["Pink/Rosy", "Yellow/Golden", "Neutral/Beige"] },
  { id: 11, q: "In the morning, your skin looks...", options: ["Bright/Transparent", "Matte/Velvety", "Warm/Opaque"] },
  { id: 12, q: "Which color makes your eyes 'pop'?", options: ["Jewel Tones", "Earthy Terracotta", "Powdery Pastels"] },
  { id: 13, q: "If you blush, the color is...", options: ["Cool Berry", "Warm Coral", "Soft Rose"] },
  { id: 14, q: "Which 'Summer' shade suits you best?", options: ["Icy Sky Blue", "Misty Sage Green", "Lavender"] },
  { id: 15, q: "Which landscape feels most like 'you'?", options: ["Frozen Tundra", "Golden Forest", "Tropical Garden"] }
];

export default function ColorAnalysisQuiz({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [scores, setScores] = useState({ cool: 0, warm: 0 });

  const handleAnswer = (idx) => {
    const newScores = { ...scores };
    
    // Logic: Option 0 usually aligns with Cool, Option 1 with Warm, Option 2 is Neutral
    if (idx === 0) newScores.cool += 1;
    if (idx === 1) newScores.warm += 1;
    // Option 2 (Neutral) doesn't heavily weight either, keeping it balanced
    
    setScores(newScores);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final calculation based on the 15 responses
      const finalResult = newScores.cool >= newScores.warm ? "Winter/Summer" : "Spring/Autumn";
      if (onComplete) {
        onComplete(finalResult);
      }
    }
  };

  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="max-w-xl mx-auto py-4">
      {/* Aesthetic Minimalist Progress Bar */}
      <div className="w-full h-[1px] bg-slate-100 mb-12 relative">
        <div 
          className="absolute top-0 left-0 h-full bg-pink-400 transition-all duration-700 ease-in-out" 
          style={{ width: `${progress}%` }} 
        />
        <span className="absolute -bottom-6 left-0 text-[10px] tracking-[0.2em] text-slate-300 uppercase font-sans-aesthetic">
          Question {currentStep + 1} of {questions.length}
        </span>
      </div>

      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <h2 className="text-3xl md:text-4xl font-serif-aesthetic italic text-slate-900 leading-tight">
          {questions[currentStep].q}
        </h2>

        <div className="grid gap-3">
          {questions[currentStep].options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              className="group relative w-full text-left p-6 rounded-2xl border border-slate-100 hover:border-pink-200 hover:bg-pink-50/30 transition-all duration-300 ease-out"
            >
              <div className="flex items-center justify-between">
                <span className="font-sans-aesthetic text-sm tracking-wide text-slate-600 group-hover:text-pink-700 transition-colors">
                  {option}
                </span>
                <div className="w-2 h-2 rounded-full bg-slate-100 group-hover:bg-pink-400 transition-all duration-300" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}