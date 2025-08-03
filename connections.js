import supabase from '../../../utils/supabaseClient.js';
import jwtMiddleware from '../../../middleware/jwt.js';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { data, error } = await supabase
      .from('connections')
      .select('provider, expires_at, shop')
      .eq('user_id', user_id);
    if (error) {
      throw new Error(error.message);
    }
    res.status(200).json({ success: true, connections: data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export default jwtMiddleware(handler);