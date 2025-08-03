import type { NextApiRequest, NextApiResponse } from 'next';
import { sendSlackMessage } from '../../../lib/notifications';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { channel, text } = req.body;

  if (!channel || !text) {
    return res.status(400).json({ error: 'Missing required parameters: channel, text' });
  }

  const token = process.env.SLACK_BOT_TOKEN;
  if (!token) {
    return res.status(500).json({ error: 'Slack bot token not configured' });
  }

  try {
    const result = await sendSlackMessage(token, channel, text);
    return res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    console.error('Slack API error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
