export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  // Placeholder response for auto-messages API
  res.status(200).json({ messages: [] });
}
