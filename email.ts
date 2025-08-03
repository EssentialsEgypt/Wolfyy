import type { NextApiRequest, NextApiResponse } from 'next';
import { sendEmail } from '../../../lib/notifications';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { toEmails, subject, htmlContent } = req.body;

  if (!toEmails || !Array.isArray(toEmails) || toEmails.length === 0 || !subject || !htmlContent) {
    return res.status(400).json({ error: 'Missing or invalid parameters: toEmails, subject, htmlContent' });
  }

  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'SendGrid API key not configured' });
  }

  try {
    const result = await sendEmail(apiKey, toEmails, subject, htmlContent);
    return res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    console.error('Email API error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
