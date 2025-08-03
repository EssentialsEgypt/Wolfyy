 import { fetchAnalyticsData } from '../../../services/platforms/google';
import supabase from '../../../utils/supabaseClient';


export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Example: Extract user_id from authenticated session or headers
  const user_id = req.headers['x-user-id']; // Adjust as per your auth system

  if (!user_id) {
    return res.status(401).json({ error: 'Unauthorized: Missing user ID' });
  }

  try {
    const analyticsData = await fetchAnalyticsData(user_id);
    return res.status(200).json(analyticsData);
  } catch (error) {
    console.error('Error fetching Google Analytics data:', error);
    return res.status(500).json({ error: 'Failed to fetch Google Analytics data' });
  }
}
