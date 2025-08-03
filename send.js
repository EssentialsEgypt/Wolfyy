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
    const { platform, threadId, content } = req.body;
    if (!platform || !content) {
      return res.status(400).json({ error: 'Missing platform or content' });
    }
    const { error } = await supabase.from('messages').insert({
      user_id,
      platform,
      thread_id: threadId || null,
      content,
      created_at: new Date().toISOString()
    });
    if (error) {
      throw new Error(error.message);
    }
    await logAudit(user_id, platform, 'sent_message', { threadId });
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export default jwtMiddleware(handler);