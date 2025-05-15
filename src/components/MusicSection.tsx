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
            A selection of my personal music projects that I've worked on over the years.
          </p>
        </div>

        <Tabs defaultValue="playlist" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="playlist" className="flex items-center gap-2">
              <Music className="h-4 w-4" />
              <span>Playlist</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Disc className="h-4 w-4" />
              <span>Projects</span>
            </TabsTrigger>
          </TabsList>

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

          <TabsContent value="projects" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="overflow-hidden transition-all duration-300 hover:shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl mb-1">{project.title}</CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <Mic className="h-3 w-3" /> {project.artist} • {project.year}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        {project.genre}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-3">
                      <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        <Headphones className="h-3 w-3" /> Role: {project.role}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{project.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 