// components/ColorAnalysisResult.jsx
export default function ColorAnalysisResult({ answers, onReset }) {
  // Very simplified scoring logic (you can make this more sophisticated later)
  let undertone = 'Neutral';
  let season = 'Soft Autumn / Soft Summer blend';
  let description = 'Balanced tones — you can borrow from both warm and cool palettes.';
  let bestColors = ['Taupe', 'Muted rose', 'Soft teal', 'Olive green', 'Warm beige', 'Mauve'];
  let jewelry = 'Both gold and silver (rose gold especially flattering)';
  let accent = 'muted-rose-400';

  // Cool indicators
  if (
    answers.veins === 'blue' ||
    answers.jewelry === 'silver' ||
    answers.sun === 'burn'
  ) {
    undertone = 'Cool';
    season = 'Winter or Cool Summer';
    description = 'Your cool undertone with possibly high contrast suggests a **Winter** palette (or Cool Summer if softer).';
    bestColors = ['Sapphire blue', 'Emerald', 'True red', 'Pure white', 'Black', 'Cool plum'];
    jewelry = 'Silver, white gold, platinum';
    accent = 'blue-400';
  }
  // Warm indicators
  else if (
    answers.veins === 'green' ||
    answers.jewelry === 'gold' ||
    answers.sun === 'tan'
  ) {
    undertone = 'Warm';
    season = 'Autumn or Warm Spring';
    description = 'Your warm undertone suggests an **Autumn** palette (rich, earthy) or **Warm Spring** if brighter.';
    bestColors = ['Warm terracotta', 'Olive', 'Mustard', 'Peach', 'Camel', 'Golden brown'];
    jewelry = 'Gold, bronze, rose gold';
    accent = 'amber-400';
  }
  // High contrast → more likely Winter/Deep Autumn
  if (answers.contrast === 'high') {
    season = season.includes('Winter') ? 'Deep/Clear Winter' : 'Deep Autumn';
    description += ' High contrast adds depth — deep, rich shades will harmonize best.';
  }

  return (
    <div className="max-w-3xl mx-auto bg-gray-900/70 backdrop-blur-md p-10 rounded-2xl border border-purple-900/40 text-center">
      <h2 className="text-4xl font-bold mb-6">
        Your Personal Color Harmony: <span className={`text-${accent}`}>{undertone} {season}</span>
      </h2>

      <p className="text-xl mb-8 leading-relaxed">{description}</p>

      <div className="grid md:grid-cols-2 gap-8 mb-10">
        <div>
          <h3 className="text-2xl font-semibold mb-4">Best Clothing & Makeup Tones</h3>
          <ul className="text-left space-y-2 text-lg">
            {bestColors.map(c => <li key={c}>• {c}</li>)}
          </ul>
          <p className="mt-4 text-gray-300">
            These shades will make your skin look lively and harmonious without needing heavy makeup.
          </p>
        </div>

        <div>
          <h3 className="text-2xl font-semibold mb-4">Jewelry Recommendation</h3>
          <p className="text-lg mb-4">{jewelry}</p>
          <p className="text-gray-300">
            Choose metals and stones that echo your undertone — they enhance your natural glow.
          </p>
        </div>
      </div>

      <button
        onClick={onReset}
        className="px-10 py-4 bg-purple-600 hover:bg-purple-700 rounded-full text-lg font-medium transition"
      >
        Analyze Again
      </button>

      <p className="mt-8 text-sm text-gray-500">
        This is a simplified analysis — for the most accurate result, consult a professional color analyst or drape fabrics in person.
      </p>
    </div>
  );
}