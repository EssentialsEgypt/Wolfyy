"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  platform: string;
  status: string;
};

type SchedulerCalendarProps = {
  events: CalendarEvent[];
  onEventUpdate: (event: CalendarEvent) => void;
  onEventDelete: (eventId: string) => void;
  onEventAdd: (event: Omit<CalendarEvent, "id">) => void;
};

const localizer = momentLocalizer(moment);

export default function SchedulerCalendar({
  events,
  onEventUpdate,
  onEventDelete,
  onEventAdd,
}: SchedulerCalendarProps) {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState<Omit<CalendarEvent, "id"> | null>(null);

  const eventStyleGetter = (event: CalendarEvent) => {
    let backgroundColor = "#3174ad"; // default blue
    if (event.status === "posted") backgroundColor = "#4caf50"; // green
    else if (event.status === "failed") backgroundColor = "#f44336"; // red
    else if (event.status === "scheduled") backgroundColor = "#ff9800"; // orange

    return {
      style: {
        backgroundColor,
        borderRadius: "4px",
        color: "white",
        border: "none",
        padding: "2px 4px",
      },
    };
  };

  const onSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const onSelectSlot = (slotInfo: any) => {
    setNewEvent({
      title: "",
      start: slotInfo.start,
      end: slotInfo.end,
      platform: "",
      status: "scheduled",
    });
    setShowModal(true);
  };

  const handleModalClose = () => {
    setSelectedEvent(null);
    setNewEvent(null);
    setShowModal(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (selectedEvent) {
      setSelectedEvent({ ...selectedEvent, [name]: value });
    } else if (newEvent) {
      setNewEvent({ ...newEvent, [name]: value });
    }
  };

  const handleSave = () => {
    if (selectedEvent) {
      onEventUpdate(selectedEvent);
    } else if (newEvent) {
      onEventAdd(newEvent);
    }
    handleModalClose();
  };

  const handleDelete = () => {
    if (selectedEvent) {
      onEventDelete(selectedEvent.id);
      handleModalClose();
    }
  };

  const moveEvent = ({ event, start, end }: { event: CalendarEvent; start: Date; end: Date }) => {
    const updatedEvent = { ...event, start, end };
    onEventUpdate(updatedEvent);
  };

  return (
    <div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        views={[Views.MONTH, Views.WEEK, Views.DAY]}
        selectable
        onSelectEvent={onSelectEvent}
        onSelectSlot={onSelectSlot}
        eventPropGetter={eventStyleGetter}
        onEventDrop={moveEvent}
        draggableAccessor={() => true}
      />

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full">
            <h2 className="text-xl font-bold mb-4">{selectedEvent ? "Edit Event" : "Add Event"}</h2>
            <label className="block mb-2">
              Title
              <input
                type="text"
                name="title"
                value={selectedEvent ? selectedEvent.title : newEvent?.title || ""}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-2 py-1"
              />
            </label>
            <label className="block mb-2">
              Platform
              <input
                type="text"
                name="platform"
                value={selectedEvent ? selectedEvent.platform : newEvent?.platform || ""}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-2 py-1"
              />
            </label>
            <label className="block mb-2">
              Status
              <select
                name="status"
                value={selectedEvent ? selectedEvent.status : newEvent?.status || "scheduled"}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-2 py-1"
              >
                <option value="scheduled">Scheduled</option>
                <option value="posted">Posted</option>
                <option value="failed">Failed</option>
              </select>
            </label>
            <div className="flex justify-end space-x-2 mt-4">
              {selectedEvent && (
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              )}
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={handleModalClose}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
