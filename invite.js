import supabase from '../../../utils/supabaseClient.js';
import jwtMiddleware from '../../../middleware/jwt.js';
import { logAudit } from '../../../services/logging/audit.js';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const inviter_id = req.user?.id;
    if (!inviter_id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { email, role = 'member', workspaceId } = req.body;
    if (!email || !workspaceId) {
      return res.status(400).json({ error: 'Missing email or workspaceId' });
    }
    const { error } = await supabase
      .from('invitations')
      .insert({ inviter_id, email, role, workspace_id: workspaceId, status: 'pending', created_at: new Date().toISOString() });
    if (error) {
      throw new Error(error.message);
    }
    await logAudit(inviter_id, 'workspace', 'invited_user', { email, role, workspaceId });
    // Note: send email to invitee via external service (not implemented)
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export default jwtMiddleware(handler);