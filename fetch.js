import { fetchData } from '../../../services/platforms/twitter.js';
import jwtMiddleware from '../../../middleware/jwt.js';

async function handler(req, res) {
  try {
    const user_id = req.user?.id;
    if (!user_id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const data = await fetchData(user_id);
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

export default jwtMiddleware(handler);