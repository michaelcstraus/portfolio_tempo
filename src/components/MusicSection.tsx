"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Music, Disc, Mic, Headphones } from "lucide-react";

interface MusicProject {
  id: string;
  title: string;
  artist: string;
  role: string;
  year: number;
  genre: string;
  description: string;
}

interface MusicSectionProps {
  spotifyPlaylistUrl?: string;
  projects?: MusicProject[];
}

export default function MusicSection({
  spotifyPlaylistUrl = "https://open.spotify.com/embed/playlist/YOUR_PLAYLIST_ID_HERE?utm_source=generator",
  projects = [
    {
      id: "music1",
      title: "Sample Track 1",
      artist: "Artist Name",
      role: "Producer, Sound Designer",
      year: 2023,
      genre: "Electronic",
      description: "Led production and sound design for this electronic track, featuring innovative synth work and layered percussion."
    },
    {
      id: "music2",
      title: "Sample Track 2",
      artist: "Another Artist",
      role: "Composer, Mixing Engineer",
      year: 2022,
      genre: "Alternative",
      description: "Composed the main melody and handled mixing duties for this alternative track, focusing on spatial audio techniques."
    },
    {
      id: "music3",
      title: "Sample Track 3",
      artist: "Band Name",
      role: "Sound Director, Vocal Producer",
      year: 2021,
      genre: "Rock",
      description: "Directed overall sound design and produced vocal recordings, implementing advanced editing techniques."
    }
  ]
}: MusicSectionProps) {
  return (
    <div className="w-full bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            Music Portfolio
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            My journey into game design started with a deep love for music and audio. Over the years, I’ve worked as a recording and performing artist, mixed and mastered records, crafted sound design for games, and even taught audio production at the college level. I’ve helped design studio spaces, built dynamic music systems, and collaborated on projects that shaped my creative process.
            <br />
            <br />
            The playlist below features some of my favorite personal music projects and bands I’ve been part of—each track represents a piece of my path. I played bass in all of them, and on various songs I also wrote, arranged, recorded, or mixed the material.

          </p>
        </div>

        <Tabs defaultValue="playlist" className="w-full">
          {/* <TabsList className="flex justify-center mb-8">
            <TabsTrigger value="playlist" className="flex items-center gap-2">
              <Music className="h-4 w-4" />
              <span>Playlist</span>
            </TabsTrigger>
          </TabsList> */}

          <TabsContent value="playlist" className="space-y-8">
            <div className="bg-card rounded-lg overflow-hidden shadow-lg">
              <div className="aspect-video w-full max-w-4xl mx-auto">
                <iframe 
                  src={spotifyPlaylistUrl}
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                  loading="lazy"
                  className="rounded-md"
                ></iframe>
              </div>
            </div>
          </TabsContent>

          {/* Future sub-tabs can be added here */}
        </Tabs>
      </div>
    </div>
  );
} 