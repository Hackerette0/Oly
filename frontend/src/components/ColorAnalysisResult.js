// components/ColorAnalysisResult.jsx
export default function ColorAnalysisResult({ result, onReset }) {
  const { season, description, palette, accent } = result;

  let jewelryRecommendation = "";
  let gemstoneNotes = "";
  let additionalTips = "";

  if (season.includes("Winter") || season.includes("Cool")) {
    jewelryRecommendation = "Silver, white gold, or platinum – these cool metals enhance your crisp, high-contrast glow without overwhelming your features.";
    gemstoneNotes = "Go for diamonds, sapphires, emeralds, rubies, or clear quartz for bold, icy sparkle.";
    additionalTips = "Avoid warm yellow gold; opt for high-polish or matte finishes for elegance.";
  } 
  else if (season.includes("Summer") || season.includes("Soft Neutral")) {
    jewelryRecommendation = "Silver or white gold as primary choices; rose gold works as a soft, flattering accent if you lean neutral.";
    gemstoneNotes = "Pearls, aquamarine, rose quartz, amethyst, moonstone, or light blue topaz – keep it delicate and muted.";
    additionalTips = "Layer delicate pieces for a romantic, ethereal look; avoid heavy or overly warm metals.";
  } 
  else if (season.includes("Autumn") || season.includes("Warm")) {
    jewelryRecommendation = "Yellow gold, rose gold, or bronze – these warm metals bring out your rich, earthy radiance.";
    gemstoneNotes = "Amber, citrine, garnet, topaz, peridot, tiger's eye, or carnelian for grounded, golden vibes.";
    additionalTips = "Textured or brushed finishes feel natural; layer chunky pieces for depth.";
  } 
  else if (season.includes("Spring")) {
    jewelryRecommendation = "Yellow gold or rose gold – light, sunny metals add warmth and brightness to your fresh palette.";
    gemstoneNotes = "Citrine, peridot, aquamarine, peach sapphire, or clear quartz – choose bright and cheerful stones.";
    additionalTips = "Delicate, playful designs shine; mix rose gold with subtle silver for versatility.";
  } 
  else {
    jewelryRecommendation = "Both silver/white gold and rose gold/yellow gold work well – experiment with mixed metals for balance.";
    gemstoneNotes = "Versatile stones like rose quartz, amethyst, or light topaz suit your adaptable undertone.";
    additionalTips = "Rose gold is especially forgiving and flattering across neutral tones.";
  }

  return (
    <div className="max-w-3xl mx-auto  /80 backdrop-blur-md p-10 rounded-3xl border border-pink-100 shadow-xl text-center">
      <h2 className="text-4xl font-bold mb-6">
        Your Season: <span className={`text-${accent}`}>{season}</span>
      </h2>

      <p className="text-xl mb-10 leading-relaxed text-slate-700">{description}</p>

      <div className="mb-12">
        <h3 className="text-2xl font-semibold mb-6">Your Color Palette</h3>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-4 max-w-2xl mx-auto">
          {palette.map((hex, i) => (
            <div key={i} className="flex flex-col items-center">
              <div
                className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-slate-200 shadow-md"
                style={{ backgroundColor: hex }}
              />
              <p className="mt-2 text-xs font-mono text-slate-600">{hex}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-10 mb-12 text-left">
        <div>
          <h3 className="text-2xl font-semibold mb-4 text-slate-800">Jewelry Tones</h3>
          <p className="text-lg leading-relaxed text-slate-700">{jewelryRecommendation}</p>
        </div>

        <div>
          <h3 className="text-2xl font-semibold mb-4 text-slate-800">Gemstone & Accent Ideas</h3>
          <p className="text-lg leading-relaxed text-slate-700">{gemstoneNotes}</p>
        </div>
      </div>

      <div className="mb-12 text-left">
        <h3 className="text-2xl font-semibold mb-4 text-slate-800">Popular Additions & Tips</h3>
        <p className="text-lg leading-relaxed text-slate-700">{additionalTips}</p>
        <ul className="mt-4 space-y-2 text-slate-600 text-left list-disc pl-6">
          <li>Layer necklaces or stack rings for dimension</li>
          <li>Choose matte vs. polished based on your contrast level</li>
          <li>Mixed metals (e.g., rose gold + silver) are trendy and forgiving for blends</li>
          <li>Match jewelry metal to your most flattering everyday outfit tones</li>
        </ul>
      </div>

      <button
        onClick={onReset}
        className="px-12 py-4 bg-pink-600 hover:bg-pink-700 text-white rounded-full text-lg font-medium transition shadow-lg"
      >
        Analyze Again
      </button>

      <p className="mt-10 text-sm text-slate-500">
        This AI-assisted analysis draws from seasonal color theory — for the most precise results, consider professional draping or in-person testing.
      </p>
    </div>
  );
}