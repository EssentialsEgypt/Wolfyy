"use client";

import { useState, useEffect, useCallback } from "react";
import supabase from "@/utils/supabaseClient";
import SchedulerCalendar from "@/components/SchedulerCalendar";

type ScheduledPost = {
  id: string;
  content: string;
  scheduled_at: string;
  platform: string;
  status: string;
};

type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  platform: string;
  status: string;
};

export default function SchedulerPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]); // Scheduled posts as calendar events
  const [loading, setLoading] = useState(true);

  const fetchScheduledPosts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from<ScheduledPost>("scheduled_posts")
      .select("*")
      .order("scheduled_at", { ascending: true });
    if (!error && data) {
      const mappedEvents: CalendarEvent[] = data.map((post) => ({
        id: post.id,
        title: post.content.substring(0, 20) + (post.content.length > 20 ? "..." : ""),
        start: new Date(post.scheduled_at),
        end: new Date(post.scheduled_at),
        platform: post.platform,
        status: post.status,
      }));
      setEvents(mappedEvents);
    }
    setLoading(false);
  }, []);

  // Fetch posts on mount
  useEffect(() => {
    fetchScheduledPosts();
  }, [fetchScheduledPosts]);

  const handleEventAdd = async (newEvent: Omit<CalendarEvent, "id">) => {
    try {
      const response = await fetch("/api/scheduler/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      });
      if (!response.ok) throw new Error("Failed to add event");
      const data = await response.json();
      // Add new event with returned id
      setEvents((prev) => [
        ...prev,
        {
          id: data[0].id,
          title: newEvent.title,
          start: new Date(newEvent.start),
          end: new Date(newEvent.end),
          platform: newEvent.platform,
          status: newEvent.status,
        },
      ]);
    } catch (error) {
      console.error("Add event error:", error);
      alert("Failed to add event");
    }
  };

  const handleEventUpdate = async (updatedEvent: CalendarEvent) => {
    try {
      const response = await fetch("/api/scheduler/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedEvent),
      });
      if (!response.ok) throw new Error("Failed to update event");
      const data = await response.json();
      setEvents((prev) =>
        prev.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
      );
    } catch (error) {
      console.error("Update event error:", error);
      alert("Failed to update event");
    }
  };

  const handleEventDelete = async (eventId: string) => {
    try {
      const response = await fetch("/api/scheduler/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: eventId }),
      });
      if (!response.ok) throw new Error("Failed to delete event");
      setEvents((prev) => prev.filter((event) => event.id !== eventId));
    } catch (error) {
      console.error("Delete event error:", error);
      alert("Failed to delete event");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Content Scheduler</h1>
      {loading ? (
        <p>Loading scheduled posts...</p>
      ) : (
        <SchedulerCalendar
          events={events}
          onEventAdd={handleEventAdd}
          onEventUpdate={handleEventUpdate}
          onEventDelete={handleEventDelete}
        />
      )}
    </div>
  );
}
