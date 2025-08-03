import { getToken } from '../../../../services/platforms/twitter.js';
import supabase from '../../../../utils/supabaseClient.js';
import jwtMiddleware from '../../../../middleware/jwt.js';
import { logAudit } from '../../../../services/logging/audit.js';

async function handler(req, res) {
  try {
    const { code, redirectUri } = req.query;
    if (!code) {
      return res.status(400).json({ error: 'Missing code' });
    }
    const callback = redirectUri || `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/twitter/callback`;
    const tokenData = await getToken(code, callback);
    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { access_token, refresh_token, expires_in } = tokenData;
    const expires_at = expires_in ? new Date(Date.now() + expires_in * 1000).toISOString() : null;
    const { error } = await supabase
      .from('connections')
      .upsert({
        user_id,
        provider: 'twitter',
        access_token,
        refresh_token: refresh_token || null,
        expires_at
      });
    if (error) {
      throw new Error(error.message);
    }
    await logAudit(user_id, 'twitter', 'connected');
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export default jwtMiddleware(handler);