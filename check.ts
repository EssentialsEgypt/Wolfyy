import type { NextApiRequest, NextApiResponse } from 'next';
import supabase from '../../../utils/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Example: Check for unanswered DMs older than 2 hours
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();

    // Query DMs from Supabase (assuming a dms table with relevant fields)
    const { data: dms, error: dmsError } = await supabase
      .from('dms')
      .select('id, user_id, created_at, replied')
      .lt('created_at', twoHoursAgo)
      .eq('replied', false);

    if (dmsError) {
      console.error('Error fetching DMs:', dmsError);
      return res.status(500).json({ error: 'Error fetching DMs' });
    }

    // Insert alerts for unanswered DMs
    for (const dm of dms || []) {
      // Check if alert already exists
      const { data: existingAlert, error: existingError } = await supabase
        .from('alerts')
        .select('id')
        .eq('user_id', dm.user_id)
        .eq('type', 'dm_unanswered')
        .eq('message', `🔴 Unanswered DM from ${dm.id} pending for more than 2 hours`)
        .single();

      if (!existingAlert && !existingError) {
        await supabase
          .from('alerts')
          .insert({
            user_id: dm.user_id,
            type: 'dm_unanswered',
            platform: 'internal',
            message: `🔴 Unanswered DM from ${dm.id} pending for more than 2 hours`,
            status: 'pending',
          });
      }
    }

    // TODO: Add other alert checks (scheduled posts, comments sentiment, team activity, campaigns, inbox sentiment)

    res.status(200).json({ message: 'Alerts check completed' });
  } catch (error) {
    console.error('Error in alerts check:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
