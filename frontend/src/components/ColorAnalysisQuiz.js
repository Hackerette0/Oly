// components/ColorAnalysisQuiz.jsx
import { useState } from 'react';
import ColorAnalysisResult from './ColorAnalysisResult';

const questions = [
  {
    id: 'veins',
    question: "Look at the veins on your inner wrist in natural daylight. What color do they appear?",
    options: [
      { value: 'blue', label: 'Mostly blue / purple → Cool' },
      { value: 'green', label: 'Mostly green → Warm' },
      { value: 'mixed', label: 'Mix of blue & green / unclear → Neutral / Olive-leaning' },
    ],
  },
  {
    id: 'jewelry',
    question: "Which jewelry metal looks better against your skin?",
    options: [
      { value: 'silver', label: 'Silver / white gold looks harmonious' },
      { value: 'gold', label: 'Gold / rose gold looks harmonious' },
      { value: 'both', label: 'Both look good (or neither stands out)' },
    ],
  },
  {
    id: 'sun',
    question: "How does your skin react to sun exposure?",
    options: [
      { value: 'burn', label: 'Burns easily, then tans lightly (cool)' },
      { value: 'tan', label: 'Tans easily, rarely burns (warm)' },
      { value: 'neutral', label: 'Somewhere in between' },
    ],
  },
  {
    id: 'contrast',
    question: "How would you describe the contrast between your hair, eyes, and skin?",
    options: [
      { value: 'high', label: 'High contrast (e.g. dark hair + light skin)' },
      { value: 'low', label: 'Low contrast / soft blending' },
      { value: 'medium', label: 'Medium' },
    ],
  },
];

export default function ColorAnalysisQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const currentQ = questions[step];

  const handleAnswer = (value) => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: value }));
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // done → show result
      setStep('result');
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers({});
  };

  if (step === 'result') {
    return <ColorAnalysisResult answers={answers} onReset={reset} />;
  }

  return (
    <div className="max-w-2xl mx-auto bg-gray-900/60 backdrop-blur-sm p-8 rounded-2xl border border-purple-900/30">
        
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Question {step + 1} of {questions.length}</span>
          <span>{Math.round(((step + 1) / questions.length) * 100)}%</span>
        </div>
        <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500"
            style={{ width: `${((step + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-6">{currentQ.question}</h2>

      <div className="grid gap-4">
    {currentQ.options.map(opt => (
      <button
        key={opt.value}
        onClick={() => handleAnswer(opt.value)}
        className="p-5 text-left rounded-2xl border-2 border-pink-200 hover:border-pink-400 bg-white/80 hover:bg-pink-50 transition-all hover:shadow-md"
      >
        {opt.label}
      </button>
    ))}
  </div>
    </div>
  );
}