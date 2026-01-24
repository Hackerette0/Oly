const express = require('express');
const router = express.Router();
const axios = require('axios');

require('dotenv').config({ path: './.env' });

// Long system prompt – only sent once
const SYSTEM_PROMPT = `You are ōly's expert beauty & skincare shopping assistant — warm, knowledgeable, modern, slightly playful, and always helpful.

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
Keep answers concise but rich (100–300 words max unless asked for detail)`;

router.post('/', async (req, res) => {
  const { message, conversationHistory = [], imageBase64, context = '' } = req.body;

  if (!message && !imageBase64) {
    return res.status(400).json({ error: 'Message or image required' });
  }

  // Build messages array
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT + (context ? `\nContext: ${context}` : '') }
  ];

  // Add conversation history (max 10 turns to save tokens)
  conversationHistory.slice(-10).forEach(msg => {
    messages.push({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    });
  });

  // Current user turn
  let userContent = message ? message.trim() : 'Analyze this skin photo for age, texture, elasticity, and recommendations.';

  const userMessage = {
    role: 'user',
    content: imageBase64
      ? [
          { type: 'text', text: userContent },
          { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
        ]
      : userContent
  };

  messages.push(userMessage);

  try {
    console.log('=== OpenRouter Request Starting ===');
    console.log('API Key exists?', !!process.env.API_KEY);
    console.log('Model: meta-llama/llama-3.2-11b-vision-instruct');
    console.log('Messages count:', messages.length);
    if (imageBase64) console.log('Image attached (length):', imageBase64.length);

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'meta-llama/llama-3.2-11b-vision-instruct',
        messages,
        temperature: 0.75,
        max_tokens: 1500,
        top_p: 0.9
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 90000  // Increased for vision + long replies
      }
    );

    console.log('Using API Key (first 10 chars):', process.env.API_KEY?.slice(0, 10) || 'MISSING');
    console.log('OpenRouter status:', response.status);
    const aiReply = response.data.choices?.[0]?.message?.content?.trim() || 'Hmm... I need a moment to think! Try again? 💭';

    console.log('AI Reply (first 150 chars):', aiReply.substring(0, 150) + '...');
    res.json({ reply: aiReply });
  } catch (error) {
    console.error('OpenRouter full error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    let fallback = 'Sorry, my brain lagged a bit 😅 Ask again or try a different question!';
    if (error.response?.status === 404) fallback += ' (Model not found)';
    if (error.response?.status === 401) fallback += ' (Invalid API key)';
    if (error.response?.status === 429) fallback += ' (Rate limit – wait a minute)';

    res.status(500).json({ reply: fallback });
  }
});

module.exports = router;