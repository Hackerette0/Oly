const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const { image } = req.body; 

  if (!image) {
    return res.status(400).json({ error: 'No image provided' });
  }

  try {
    // 1. Clean the base64 string (Remove metadata prefix if it exists)
    const cleanBase64 = image.includes('base64,') 
      ? image.split('base64,')[1] 
      : image;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000', // Often required for OpenRouter
        'X-Title': 'Color Harmony App',
      },
      body: JSON.stringify({
        model: 'google/gemini-flash-1.5', 
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: "Analyze this photo as a professional color consultant. Identify the skin undertone (cool, warm, neutral, olive), the seasonal color type, and suggest a palette of 5 colors that would look best on this person.",
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${cleanBase64}`, // Ensure strict format
                },
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();

    // Debugging: If it fails, we need to see exactly what OpenRouter says
    if (data.error) {
      console.error("OpenRouter Error Details:", data.error);
      return res.status(422).json({ 
        error: `AI Service Error: ${data.error.message || 'Check model availability'}` 
      });
    }

    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({ error: 'Model failed to generate a response.' });
    }

    const analysis = data.choices[0].message.content;
    res.json({ analysis });

  } catch (err) {
    console.error("Internal Server Error:", err);
    res.status(500).json({ error: 'Internal connection error' });
  }
});

module.exports = router;