import fetch from 'node-fetch';

const SLACK_API_URL = 'https://slack.com/api/chat.postMessage';
const TWILIO_API_URL = 'https://api.twilio.com/2010-04-01/Accounts';
const EMAIL_API_URL = 'https://api.sendgrid.com/v3/mail/send'; // Example using SendGrid

// Send a message to Slack channel
export async function sendSlackMessage(token: string, channel: string, text: string) {
  try {
    const res = await fetch(SLACK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        channel,
        text,
      }),
    });
    const data = await res.json();
    if (!data.ok) {
      throw new Error(`Slack API error: ${data.error}`);
    }
    return data;
  } catch (error) {
    console.error('sendSlackMessage error:', error);
    throw error;
  }
}

// Send a WhatsApp message via Twilio API
export async function sendWhatsAppMessage(
  accountSid: string,
  authToken: string,
  fromNumber: string,
  toNumber: string,
  body: string
) {
  try {
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
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('sendWhatsAppMessage error:', error);
    throw error;
  }
}

// Send an email via SendGrid API
export async function sendEmail(
  apiKey: string,
  toEmails: string[],
  subject: string,
  htmlContent: string
) {
  try {
    const res = await fetch(EMAIL_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: toEmails.map((email) => ({ email })),
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
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('sendEmail error:', error);
    throw error;
  }
}
