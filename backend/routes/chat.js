const express = require('express');
const router = express.Router();
const axios = require('axios');
const { protect } = require('../middleware/auth'); // optional

require('dotenv').config();

router.post('/', /* protect, */ async (req, res) => {
  const { message, conversationHistory = [], imageBase64, context = '' } = req.body;

  if (!message && !imageBase64) {
    return res.status(400).json({ error: 'Message or image required' });
  }

  const limitedHistory = conversationHistory.slice(-10);

  // Build Gemini-style contents array
  let contents = [];

  // Add conversation history (Gemini expects alternating user/model, but we map best effort)
  limitedHistory.forEach(msg => {
    contents.push({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    });
  });

  // Current user turn
  let currentParts = [];
  if (message) {
    currentParts.push({ text: message.trim() });
  }
  if (imageBase64) {
    currentParts.push({
      inline_data: {
        mime_type: 'image/jpeg',  // or 'image/png' if you detect it
        data: imageBase64
      }
    });
  }
  if (currentParts.length === 0) {
    currentParts.push({ text: 'Analyze this skin photo for age, texture, elasticity, and recommendations.' });
  }

  contents.push({
    role: 'user',
    parts: currentParts
  });

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${process.env.GEMINI_API_KEY}`,
      // Alternative fast model: gemini-3-flash-preview
      // Stronger vision: gemini-3-pro-preview (more expensive, may need billing enabled)
      {
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,   // Gemini uses maxOutputTokens (not max_tokens)
          topP: 0.9
        },
        systemInstruction: {   // Gemini 1.5+ / 2+ / 3 supports systemInstruction
          parts: [{ text: `You are ōly's expert beauty & skincare shopping assistant — warm, knowledgeable, modern, slightly playful, and always helpful.

Your personality: friendly best friend who knows A LOT about beauty products. Use emojis sparingly but naturally (💄✨🧴🌿).

Core rules:
- Always speak in natural, conversational Indian English (casual but polite)
- Be extremely specific and helpful — name real product types, ingredients, benefits
- Tailor every answer to the user's skin type, concern, budget, or question
- When recommending: suggest 2–4 realistic products/categories + why they suit
- If budget mentioned → give value-for-money options first
- If no skin type given → gently ask for it ("What's your skin type bestie? Dry, oily, combo?")
- Delivery in India: 3–7 days, free over ₹999
- Returns: 7 days easy, unopened products only
- Never invent fake prices — say "around ₹300–800" or "budget-friendly" instead
- If user asks about order status / stock → say "I can help check that — please login or share order ID"
- Never give medical advice — say "consult a dermatologist for skin concerns"
- For image analysis: If user uploads a photo, estimate skin age based on visible texture, elasticity, pores, tone (e.g., "looks mid-20s with some dryness"). Forecast improvements with basic routines (e.g., "consistent hydration could reduce apparent age by 2-5 years in months"). Recommend gentle actives like bakuchiol over retinol for beginners. Focus on hydration anti-aging. Integrate wellness: skincare as nurturing innate vitality — suggest diet (antioxidant foods), sleep, stress relief for inner glow.

Current date: January 2026 — mention any realistic seasonal trends (winter dryness, summer oiliness)

Goal: help user find the perfect product → feel excited → add to cart
Keep answers concise but rich (100–180 words max unless asked for detail)

Context: ${context}` }]
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    // Gemini response structure: candidates[0].content.parts[0].text
    const aiReply = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini. Try again!';

    res.json({ reply: aiReply });
  } catch (error) {
    console.error('Gemini API error:', error?.response?.data || error.message);

    let clientError = 'Failed to get AI response. Please try again later.';
    if (error.response?.status === 401 || error.response?.status === 403) {
      clientError = 'Invalid Gemini API key — check your key and billing.';
    } else if (error.response?.status === 429) {
      clientError = 'Rate limit reached — try again in a minute.';
    } else if (error.response?.data?.error?.message?.includes('model')) {
      clientError = 'Model not available — try gemini-3-flash-preview or check quota.';
    }

    res.status(500).json({ error: clientError });
  }
});

module.exports = router;