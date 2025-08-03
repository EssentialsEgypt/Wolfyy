import supabase from '../../../utils/supabaseClient.js';
import { logAudit } from '../../../services/logging/audit.js';

// Map provider to a placeholder posting function. In a real application this
// would send the content to the respective API. Here we simply mark the post
// as posted.
async function postContent(connection, content) {
  // Stub: In production call the platform API to create a post.
  console.log(`Would post to ${connection.provider}:`, content);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const now = new Date().toISOString();
    const { data: posts, error } = await supabase
      .from('scheduled_posts')
      .select('*')
      .eq('status', 'scheduled')
      .lte('scheduled_at', now);
    if (error) {
      throw new Error(error.message);
    }
    for (const post of posts) {
      try {
        await postContent(post, post.content);
        // Update status to posted
        const { error: updateError } = await supabase
          .from('scheduled_posts')
          .update({ status: 'posted' })
          .eq('id', post.id);
        if (updateError) {
          throw updateError;
        }
        await logAudit(post.user_id, post.platform, 'posted_content', { id: post.id });
      } catch (err) {
        console.error('Error posting scheduled content', err);
        // Mark as failed
        await supabase.from('scheduled_posts').update({ status: 'failed' }).eq('id', post.id);
      }
    }
    res.status(200).json({ success: true, processed: posts.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}