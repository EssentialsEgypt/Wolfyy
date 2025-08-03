import { getToken } from '../../../../services/platforms/facebook';
import supabase from '../../../../utils/supabaseClient';
import jwtMiddleware from '../../../../middleware/jwt';

async function callbackHandler(req, res) {
  try {
    const { code, redirectUri } = req.query;
    if (!code || !redirectUri) {
      return res.status(400).json({ error: 'Missing code or redirectUri' });
    }

    const tokenData = await getToken(code, redirectUri);

    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(401).json({ error: 'Unauthorized user' });
    }

    const { error } = await supabase
      .from('connections')
      .upsert({
        user_id,
        provider: 'facebook',
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token || null,
        expires_in: tokenData.expires_in || null,
      });

    if (error) {
      throw new Error('Failed to store connection: ' + error.message);
    }

    return res.status(200).json({ success: true, message: 'Facebook connection successful' });
  } catch (error) {
    console.error('Error in Facebook callback:', error);
    return res.status(500).json({ error: error.message });
  }
}

export default jwtMiddleware(callbackHandler);
