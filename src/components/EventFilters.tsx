"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CalendarIcon, SearchIcon, XIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Event } from '@/lib/supabase';

interface EventFiltersProps {
  events: Event[];
  onFilteredEventsChange: (filteredEvents: Event[]) => void;
}

export default function EventFilters({ events, onFilteredEventsChange }: EventFiltersProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Extract unique genres from events
  const genres = Array.from(new Set(events.map(event => event.genre)));

  // Apply filters whenever they change
  useEffect(() => {
    let filtered = [...events];
    
    // Filter by date
    if (selectedDate) {
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      filtered = filtered.filter(event => {
        // This handles both full ISO dates and date-only strings
        return event.date.startsWith(dateString);
      });
    }
    
    // Filter by genre
    if (selectedGenre) {
      filtered = filtered.filter(event => event.genre === selectedGenre);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event => 
        event.event_name.toLowerCase().includes(query) || 
        event.venue.toLowerCase().includes(query) ||
        event.event_details.toLowerCase().includes(query)
      );
    }
    
    onFilteredEventsChange(filtered);
  }, [selectedDate, selectedGenre, searchQuery, events, onFilteredEventsChange]);

  // Reset all filters
  const resetFilters = () => {
    setSelectedDate(undefined);
    setSelectedGenre('');
    setSearchQuery('');
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        {/* Date Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={selectedDate ? "text-foreground" : "text-muted-foreground"}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, 'PPP') : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Genre Filter */}
        <Select value={selectedGenre} onValueChange={setSelectedGenre}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Select Genre" />
          </SelectTrigger>
          <SelectContent>
            {genres.map(genre => (
              <SelectItem key={genre} value={genre}>
                {genre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Search Filter */}
        <div className="relative flex-grow">
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10"
          />
          <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>

        {/* Reset Filters Button */}
        <Button variant="ghost" onClick={resetFilters} className="flex-shrink-0">
          <XIcon className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>
    </div>
  );
} 