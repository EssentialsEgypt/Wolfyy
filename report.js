import jwtMiddleware from '../../../middleware/jwt.js';
import { fetchData as fetchFacebook } from '../../../services/platforms/facebook.js';
import { fetchData as fetchInstagram } from '../../../services/platforms/instagram.js';
import { fetchData as fetchTikTok } from '../../../services/platforms/tiktok.js';
import { fetchData as fetchGoogle } from '../../../services/platforms/google.js';
import { fetchData as fetchLinkedIn } from '../../../services/platforms/linkedin.js';
import { fetchData as fetchSnapchat } from '../../../services/platforms/snapchat.js';
import { fetchData as fetchTwitter } from '../../../services/platforms/twitter.js';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    // In a real implementation you would fetch data concurrently and
    // transform it into meaningful metrics. Here we call each provider
    // sequentially and return raw results keyed by provider.
    const results = {};
    const providers = {
      facebook: fetchFacebook,
      instagram: fetchInstagram,
      tiktok: fetchTikTok,
      google: fetchGoogle,
      linkedin: fetchLinkedIn,
      snapchat: fetchSnapchat,
      twitter: fetchTwitter
    };
    for (const [provider, fn] of Object.entries(providers)) {
      try {
        results[provider] = await fn(user_id);
      } catch (err) {
        results[provider] = { error: err.message };
      }
    }
    res.status(200).json({ success: true, results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export default jwtMiddleware(handler);