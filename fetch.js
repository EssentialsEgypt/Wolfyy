import { fetchData } from '../../../services/platforms/facebook';
import jwtMiddleware from '../../../middleware/jwt';

async function fetchHandler(req, res) {
  try {
    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(401).json({ error: 'Unauthorized access' });
    }

    const campaigns = await fetchData(user_id);
    return res.status(200).json({ success: true, campaigns });
  } catch (error) {
    console.error('Error fetching Facebook data:', error);
    return res.status(500).json({ error: error.message });
  }
}

export default jwtMiddleware(fetchHandler);
