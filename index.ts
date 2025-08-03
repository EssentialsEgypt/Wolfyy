 import { NextApiRequest, NextApiResponse } from 'next';

import type { NextApiRequest, NextApiResponse } from 'next';

interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  description?: string;
  participants?: string[];
  location?: string;
  reminderMinutesBefore?: number;
  agendaItems?: string[];
  attachments?: any[];
}

let meetings: Meeting[] = [];

const generateId = () => Math.random().toString(36).substr(2, 9);

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json({ meetings });
  } else if (req.method === 'POST') {
    const meeting: Meeting = req.body;
    if (!meeting.title || !meeting.date || !meeting.time) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const newMeeting = { ...meeting, id: generateId() };
    meetings.push(newMeeting);
    res.status(201).json(newMeeting);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
