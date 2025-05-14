import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type for Event data based on the table structure mentioned
export interface Event {
  date: string;
  event_name: string;
  venue: string;
  event_details: string;
  ticket_link: string;
  all_ages: boolean;
  event_link: string;
  image_link: string;
  genre: string;
  subgenre: string;
}

/**
 * Fetches all events from Supabase
 */
export async function fetchEvents(): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*');

  if (error) {
    console.error('Error fetching events:', error);
    throw error;
  }

  return data || [];
}

/**
 * Fetches events filtered by genre
 */
export async function fetchEventsByGenre(genre: string): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('genre', genre);

  if (error) {
    console.error('Error fetching events by genre:', error);
    throw error;
  }

  return data || [];
}

/**
 * Fetches events filtered by date range
 */
export async function fetchEventsByDateRange(startDate: string, endDate: string): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate);

  if (error) {
    console.error('Error fetching events by date range:', error);
    throw error;
  }

  return data || [];
} 