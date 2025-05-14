import React from 'react';
import { fetchEvents } from '@/lib/supabase';
import EventsList from '@/components/EventsList';

export const revalidate = 3600; // Revalidate at most every hour

export default async function EventsPage() {
  const events = await fetchEvents();

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Upcoming Events</h1>
      <EventsList initialEvents={events} />
    </main>
  );
} 