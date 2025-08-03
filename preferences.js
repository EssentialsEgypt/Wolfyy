import supabase from '../../../utils/supabaseClient.js';
import jwtMiddleware from '../../../middleware/jwt.js';

async function handler(req, res) {
  const user_id = req.user?.id;
  if (!user_id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('preferences')
        .select('key,value')
        .eq('user_id', user_id);
      if (error) {
        throw new Error(error.message);
      }
      const preferences = {};
      for (const row of data) {
        preferences[row.key] = row.value;
      }
      return res.status(200).json({ success: true, preferences });
    }
    if (req.method === 'POST') {
      const updates = req.body; // { key: value }
      const entries = Object.entries(updates || {});
      for (const [key, value] of entries) {
        const { error } = await supabase
          .from('preferences')
          .upsert({ user_id, key, value });
        if (error) {
          throw new Error(error.message);
        }
      }
      return res.status(200).json({ success: true });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}

export default jwtMiddleware(handler);