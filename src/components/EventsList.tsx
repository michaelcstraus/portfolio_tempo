"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import EventFilters from '@/components/EventFilters';
import { Event } from '@/lib/supabase';

interface EventsListProps {
  initialEvents: Event[];
}

export default function EventsList({ initialEvents }: EventsListProps) {
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(initialEvents);

  return (
    <>
      <EventFilters 
        events={initialEvents} 
        onFilteredEventsChange={setFilteredEvents} 
      />
      
      {filteredEvents.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="text-xl font-medium text-gray-600">No events found</h3>
          <p className="text-gray-500">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <Card key={`${event.event_name}-${event.date}`} className="overflow-hidden flex flex-col">
              <div className="relative h-48 w-full">
                {event.image_link ? (
                  <Image 
                    src={event.image_link} 
                    alt={event.event_name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-500">No image available</p>
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle>{event.event_name}</CardTitle>
                <CardDescription>
                  {new Date(event.date).toLocaleDateString()} at {event.venue}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-gray-600">{event.event_details}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {event.genre}
                  </span>
                  {event.subgenre && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {event.subgenre}
                    </span>
                  )}
                  {event.all_ages && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      All Ages
                    </span>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button asChild variant="outline">
                  <Link href={event.event_link} target="_blank" rel="noopener noreferrer">
                    Event Info
                  </Link>
                </Button>
                <Button asChild>
                  <Link href={event.ticket_link} target="_blank" rel="noopener noreferrer">
                    Buy Tickets
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </>
  );
} 