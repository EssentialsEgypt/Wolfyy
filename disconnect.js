import supabase from '../../../../utils/supabaseClient.js';
import jwtMiddleware from '../../../../middleware/jwt.js';
import { logAudit } from '../../../../services/logging/audit.js';

async function handler(req, res) {
  try {
    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { error } = await supabase
      .from('connections')
      .delete()
      .eq('user_id', user_id)
      .eq('provider', 'twitter');
    if (error) {
      throw new Error(error.message);
    }
    await logAudit(user_id, 'twitter', 'disconnected');
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export default jwtMiddleware(handler);