import fetch from 'node-fetch';

const TWILIO_API_URL = 'https://api.twilio.com/2010-04-01/Accounts';
const SLACK_API_URL = process.env.ALERTS_SLACK_WEBHOOK || '';
const SENDGRID_API_URL = 'https://api.sendgrid.com/v3/mail/send';

// Send WhatsApp message via Twilio or Chat-API
async function sendWhatsAppMessage({ accountSid, authToken, fromNumber, toNumber, body }) {
  if (!accountSid || !authToken || !fromNumber || !toNumber) {
    console.warn('Missing Twilio WhatsApp credentials');
    return;
  }
  const url = `${TWILIO_API_URL}/${accountSid}/Messages.json`;
  const params = new URLSearchParams();
  params.append('From', `whatsapp:${fromNumber}`);
  params.append('To', `whatsapp:${toNumber}`);
  params.append('Body', body);

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Twilio API error: ${errorText}`);
  }
  return await res.json();
}

// Send email via SendGrid or Resend
async function sendEmail({ apiKey, toEmails, subject, htmlContent }) {
  if (!apiKey) {
    console.warn('Missing SendGrid API key');
    return;
  }
  const res = await fetch(SENDGRID_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: toEmails.map(email => ({ email })),
          subject,
        },
      ],
      from: {
        email: 'no-reply@yourdomain.com',
        name: 'Your Company',
      },
      content: [
        {
          type: 'text/html',
          value: htmlContent,
        },
      ],
    }),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`SendGrid API error: ${errorText}`);
  }
  return await res.json();
}

// Send Slack message via webhook
async function sendSlackMessage(text) {
  if (!SLACK_API_URL) {
    console.warn('Missing Slack webhook URL');
    return;
  }
  const res = await fetch(SLACK_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Slack API error: ${errorText}`);
  }
  return await res.json();
}

// Main sendAlert function
export async function sendAlert({ type, message, channel, userId, contactInfo }) {
  try {
    switch (channel) {
      case 'whatsapp':
        await sendWhatsAppMessage({
          accountSid: process.env.TWILIO_SID,
          authToken: process.env.TWILIO_AUTH_TOKEN,
          fromNumber: process.env.TWILIO_WHATSAPP_FROM,
          toNumber: contactInfo.whatsappNumber,
          body: message,
        });
        break;
      case 'email':
        await sendEmail({
          apiKey: process.env.SENDGRID_API_KEY,
          toEmails: [contactInfo.email],
          subject: `Alert: ${type}`,
          htmlContent: `<p>${message}</p>`,
        });
        break;
      case 'slack':
        await sendSlackMessage(message);
        break;
      default:
        console.log(`Alert for user ${userId}: ${message}`);
    }
  } catch (error) {
    console.error('sendAlert error:', error);
  }
}
