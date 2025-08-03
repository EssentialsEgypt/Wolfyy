import React, { useState, useEffect } from 'react';
import MeetingList from '../components/meetings/meeting-list';
import MeetingForm, { MeetingData } from '../components/meetings/meeting-form';

interface Participant {
  id: string;
  name: string;
  email: string;
}

const MeetingsPage: React.FC = () => {
  const [meetings, setMeetings] = useState<MeetingData[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingData | null>(null);
  const [attendance, setAttendance] = useState<Record<string, string[]>>({});
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<string>('');

  useEffect(() => {
    // Fetch current user info and role
    async function fetchUser() {
      // Placeholder: Replace with actual user fetch logic
      const user = { id: 'user1', isAdmin: true };
      setCurrentUserId(user.id);
      setIsAdmin(user.isAdmin);
    }

    // Fetch participants list
    async function fetchParticipants() {
      // Placeholder: Replace with actual API call
      const users: Participant[] = [
        { id: 'user1', name: 'Alice', email: 'alice@example.com' },
        { id: 'user2', name: 'Bob', email: 'bob@example.com' },
        { id: 'user3', name: 'Charlie', email: 'charlie@example.com' },
      ];
      setParticipants(users);
    }

    // Fetch meetings list
    async function fetchMeetings() {
      const res = await fetch('/api/meetings');
      if (res.ok) {
        const data = await res.json();
        setMeetings(data.meetings);
      }
    }

    // Fetch attendance data
    async function fetchAttendance() {
      // Placeholder: Replace with actual API call
      setAttendance({});
    }

    fetchUser();
    fetchParticipants();
    fetchMeetings();
    fetchAttendance();
  }, []);

  const handleSaveMeeting = async (meeting: MeetingData) => {
    const method = meeting.id ? 'PUT' : 'POST';
    const url = meeting.id ? `/api/meetings/${meeting.id}` : '/api/meetings';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(meeting),
    });
    if (res.ok) {
      const updatedMeeting = await res.json();
      setMeetings((prev) => {
        if (meeting.id) {
          return prev.map((m) => (m.id === meeting.id ? updatedMeeting : m));
        } else {
          return [...prev, updatedMeeting];
        }
      });
      setSelectedMeeting(null);
    } else {
      alert('Failed to save meeting');
    }
  };

  const handleSelectMeeting = (meeting: MeetingData) => {
    setSelectedMeeting(meeting);
  };

  const handleMarkPresent = async (meetingId: string, participantId: string) => {
    // Placeholder: Implement API call to mark attendance
    setAttendance((prev) => {
      const current = prev[meetingId] || [];
      if (!current.includes(participantId)) {
        return { ...prev, [meetingId]: [...current, participantId] };
      }
      return prev;
    });
  };

  return (
    <div className="meetings-page">
      <h1>Meetings</h1>
      {isAdmin && (
        <div className="meeting-form-container">
          <h2>{selectedMeeting ? 'Edit Meeting' : 'Create Meeting'}</h2>
          <MeetingForm
            participants={participants}
            onSave={handleSaveMeeting}
            initialData={selectedMeeting || undefined}
            isAdmin={isAdmin}
          />
          {selectedMeeting && (
            <button onClick={() => setSelectedMeeting(null)}>Cancel Edit</button>
          )}
        </div>
      )}
      <MeetingList
        meetings={meetings}
        currentUserId={currentUserId}
        onSelectMeeting={handleSelectMeeting}
        onMarkPresent={handleMarkPresent}
        attendance={attendance}
        isAdmin={isAdmin}
      />
    </div>
  );
};

export default MeetingsPage;
