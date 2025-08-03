import jwtMiddleware from '../../../middleware/jwt.js';

// This endpoint demonstrates how to call the OpenAI API to generate
// captions for social media posts. To enable it you must set
// OPENAI_API_KEY in your environment and ensure outbound network access.

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Missing prompt' });
    }
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'OpenAI API key is not configured' });
    }
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that writes concise social media captions.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 60
      })
    });
    const data = await response.json();
    if (data.error) {
      throw new Error(data.error.message);
    }
    const caption = data.choices?.[0]?.message?.content?.trim();
    res.status(200).json({ success: true, caption });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export default jwtMiddleware(handler);