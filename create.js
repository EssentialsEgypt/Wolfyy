import supabase from '../../../utils/supabaseClient.js';
import jwtMiddleware from '../../../middleware/jwt.js';
import { logAudit } from '../../../services/logging/audit.js';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { platform, content, scheduledAt } = req.body;
    if (!platform || !content || !scheduledAt) {
      return res.status(400).json({ error: 'Missing platform, content or scheduledAt' });
    }
    const { error } = await supabase.from('scheduled_posts').insert({
      user_id,
      platform,
      content,
      scheduled_at: new Date(scheduledAt).toISOString(),
      status: 'scheduled'
    });
    if (error) {
      throw new Error(error.message);
    }
    await logAudit(user_id, platform, 'scheduled_post', { scheduledAt });
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export default jwtMiddleware(handler);