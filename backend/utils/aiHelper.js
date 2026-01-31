// backend/utils/aiHelper.js
const sharp = require('sharp');
const fs = require('fs').promises;

async function analyzeSkin(imagePath) {
  try {
    const buffer = await fs.readFile(imagePath);

    // Get original metadata safely
    const metadata = await sharp(buffer).metadata();
    console.log('[AI] Image metadata:', {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format
    });

    // Crop to center ~60% (face approximation) — but only if dimensions are valid
    let workingBuffer = buffer;
    if (metadata.width > 100 && metadata.height > 100) {
      const cropSize = Math.floor(Math.min(metadata.width, metadata.height) * 0.6);
      const left = Math.floor((metadata.width - cropSize) / 2);
      const top = Math.floor((metadata.height - cropSize) / 2);

      if (cropSize > 50 && left >= 0 && top >= 0) {
        workingBuffer = await sharp(buffer)
          .extract({ left, top, width: cropSize, height: cropSize })
          .toBuffer();
        console.log('[AI] Cropped to:', cropSize, '×', cropSize);
      } else {
        console.log('[AI] Crop skipped — dimensions too small');
      }
    }

    // Get stats
    const stats = await sharp(workingBuffer).stats();

    if (!stats || !stats.channels || stats.channels.length < 3) {
      console.log('[AI] Invalid stats object — falling back');
      return { hydration: null, acneSeverity: null };
    }

    const channels = stats.channels; // [red, green, blue]

    // Safe averages
    const avgBrightness = channels.reduce((sum, ch) => sum + (ch?.mean || 0), 0) / 3;
    const avgContrast  = channels.reduce((sum, ch) => sum + (ch?.stdDev || 0), 0) / 3;

    // Hydration proxy
    const textureVariance = Math.max(...channels.map(ch => ch?.stdDev || 0));
    let hydrationRaw = (avgBrightness * 0.6) + (100 - avgContrast * 1.5) + (100 - textureVariance * 2);
    let hydration = Math.max(10, Math.min(95, Math.round(hydrationRaw)));

    // Acne proxy
    const redMean = channels[0]?.mean || 128;
    const redVariance = channels[0]?.stdDev || 0;
    let acneRaw = (redVariance * 0.8) + (redMean > 140 ? 30 : 0);
    let acneSeverity = Math.max(0, Math.min(10, Math.round(acneRaw / 8)));

    const scores = { hydration, acneSeverity };

    // Safe debug logging
    console.log('[AI ANALYSIS] Result:', scores);
    console.log('[DEBUG STATS]', {
      avgBrightness: Number.isFinite(avgBrightness) ? avgBrightness.toFixed(1) : 'invalid',
      avgContrast:  Number.isFinite(avgContrast)  ? avgContrast.toFixed(1)  : 'invalid',
      textureVariance: Number.isFinite(textureVariance) ? textureVariance.toFixed(1) : 'invalid',
      redMean: Number.isFinite(redMean) ? redMean.toFixed(1) : 'invalid',
      redVariance: Number.isFinite(redVariance) ? redVariance.toFixed(1) : 'invalid'
    });

    return scores;
  } catch (err) {
    console.error('[AI ANALYSIS] Failed:', err.message);
    console.error('[AI STACK]', err.stack?.split('\n').slice(0, 3).join('\n'));
    return { hydration: null, acneSeverity: null };
  }
}

module.exports = { analyzeSkin };