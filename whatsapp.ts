import type { NextApiRequest, NextApiResponse } from 'next';
import { sendWhatsAppMessage } from '../../../lib/notifications';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { toNumber, body } = req.body;

  if (!toNumber || !body) {
    return res.status(400).json({ error: 'Missing required parameters: toNumber, body' });
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_WHATSAPP_FROM_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    return res.status(500).json({ error: 'Twilio credentials not configured' });
  }

  try {
    const result = await sendWhatsAppMessage(accountSid, authToken, fromNumber, toNumber, body);
    return res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    console.error('WhatsApp API error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
