import React from 'react';

interface Participant {
  id: string;
  name: string;
  email: string;
}

interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  participants: Participant[];
  location: string;
  reminderMinutesBefore: number;
  agendaItems: string[];
  attachments: { id: string; name: string; url: string }[];
  createdBy: string;
}

interface MeetingListProps {
  meetings: Meeting[];
  currentUserId: string;
  onSelectMeeting: (meeting: Meeting) => void;
  onMarkPresent: (meetingId: string, participantId: string) => void;
  attendance: Record<string, string[]>; // meetingId -> array of participantIds marked present
  isAdmin: boolean;
}

const MeetingList: React.FC<MeetingListProps> = ({
  meetings,
  currentUserId,
  onSelectMeeting,
  onMarkPresent,
  attendance,
  isAdmin,
}) => {
  return (
    <div className="meeting-list">
      {meetings.length === 0 && <p>No meetings scheduled.</p>}
      <ul>
        {meetings.map((meeting) => {
          const userIsParticipant = meeting.participants.some(
            (p) => p.id === currentUserId
          );
          const userMarkedPresent =
            attendance[meeting.id]?.includes(currentUserId) || false;

          return (
            <li key={meeting.id} className="meeting-item">
              <h3 onClick={() => onSelectMeeting(meeting)} style={{cursor: 'pointer'}}>
                {meeting.title}
              </h3>
              <p>
                {meeting.date} at {meeting.time}
              </p>
              <p>{meeting.description}</p>
              <p>
                Location: {meeting.location || 'Not specified'}
              </p>
              <p>Participants: {meeting.participants.map((p) => p.name).join(', ')}</p>
              {userIsParticipant && (
                <button
                  onClick={() => onMarkPresent(meeting.id, currentUserId)}
                  disabled={userMarkedPresent}
                >
                  {userMarkedPresent ? 'Marked Present' : 'Mark Present'}
                </button>
              )}
              {isAdmin && (
                <p>Created by: {meeting.createdBy}</p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MeetingList;
