"use client";

import React, { useState } from "react";
import { Lock, Unlock, Image, Video, X, Eye } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { AspectRatio } from "./ui/aspect-ratio";

interface MediaItem {
  id: string;
  type: "image" | "video";
  title: string;
  description: string;
  url: string;
  thumbnail?: string;
}

interface ProtectedMediaGalleryProps {
  password?: string;
  mediaItems?: MediaItem[];
}

const ProtectedMediaGallery = ({
  password = "portfolio123",
  mediaItems = [
    {
      id: "1",
      type: "image",
      title: "Game Concept Art",
      description: "Early concept art for Project Nebula",
      url: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=800&q=80",
    },
    {
      id: "2",
      type: "image",
      title: "Character Design",
      description: "Main character design iterations",
      url: "https://images.unsplash.com/photo-1551279880-03041531948f?w=800&q=80",
    },
    {
      id: "3",
      type: "video",
      title: "Gameplay Demo",
      description: "Early gameplay prototype footage",
      url: "https://www.example.com/video1.mp4",
      thumbnail:
        "https://images.unsplash.com/photo-1559662780-c3bab6f7d00f?w=800&q=80",
    },
    {
      id: "4",
      type: "image",
      title: "Environment Design",
      description: "World building concepts",
      url: "https://images.unsplash.com/photo-1561059488-916d69792237?w=800&q=80",
    },
    {
      id: "5",
      type: "video",
      title: "Animation Reel",
      description: "Character animation showcase",
      url: "https://www.example.com/video2.mp4",
      thumbnail:
        "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80",
    },
    {
      id: "6",
      type: "image",
      title: "UI Design",
      description: "Interface mockups and wireframes",
      url: "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=800&q=80",
    },
  ],
}: ProtectedMediaGalleryProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputPassword, setInputPassword] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPassword === password) {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setInputPassword("");
  };

  const filteredMedia = mediaItems.filter((item) => {
    if (activeTab === "all") return true;
    return item.type === activeTab;
  });

  return (
    <div className="w-full bg-background p-6 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Protected Media Gallery</h2>
        {isAuthenticated && (
          <Button variant="outline" onClick={handleLogout}>
            <Lock className="mr-2 h-4 w-4" /> Lock Gallery
          </Button>
        )}
      </div>

      {!isAuthenticated ? (
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="flex justify-center mb-6">
              <div className="bg-primary/10 p-4 rounded-full">
                <Lock className="h-10 w-10 text-primary" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-center mb-4">
              This content is password protected
            </h3>
            <p className="text-muted-foreground text-center mb-6">
              Please enter the password to access the media gallery.
            </p>
            <form onSubmit={handlePasswordSubmit}>
              <div className="space-y-4">
                <Input
                  type="password"
                  placeholder="Enter password"
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  className="w-full"
                />
                {error && <p className="text-destructive text-sm">{error}</p>}
                <Button type="submit" className="w-full">
                  <Unlock className="mr-2 h-4 w-4" /> Unlock Gallery
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Media</TabsTrigger>
              <TabsTrigger value="image">
                <Image className="mr-2 h-4 w-4" /> Images
              </TabsTrigger>
              <TabsTrigger value="video">
                <Video className="mr-2 h-4 w-4" /> Videos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMedia.map((item) => (
                  <MediaCard
                    key={item.id}
                    item={item}
                    onSelect={setSelectedMedia}
                  />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="image" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMedia.map((item) => (
                  <MediaCard
                    key={item.id}
                    item={item}
                    onSelect={setSelectedMedia}
                  />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="video" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMedia.map((item) => (
                  <MediaCard
                    key={item.id}
                    item={item}
                    onSelect={setSelectedMedia}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {selectedMedia && (
        <Dialog
          open={!!selectedMedia}
          onOpenChange={(open) => !open && setSelectedMedia(null)}
        >
          <DialogContent className="max-w-4xl">
            <div className="absolute right-4 top-4 z-10">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedMedia(null)}
                className="rounded-full h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              {selectedMedia.type === "image" ? (
                <div className="overflow-hidden rounded-lg">
                  <AspectRatio ratio={16 / 9}>
                    <img
                      src={selectedMedia.url}
                      alt={selectedMedia.title}
                      className="w-full h-full object-cover"
                    />
                  </AspectRatio>
                </div>
              ) : (
                <div className="overflow-hidden rounded-lg">
                  <AspectRatio ratio={16 / 9}>
                    <video
                      src={selectedMedia.url}
                      controls
                      className="w-full h-full object-cover"
                    />
                  </AspectRatio>
                </div>
              )}
              <div>
                <h3 className="text-xl font-semibold">{selectedMedia.title}</h3>
                <p className="text-muted-foreground">
                  {selectedMedia.description}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

interface MediaCardProps {
  item: MediaItem;
  onSelect: (item: MediaItem) => void;
}

const MediaCard = ({ item, onSelect }: MediaCardProps) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="relative">
        <AspectRatio ratio={16 / 9}>
          <img
            src={item.type === "video" ? item.thumbnail : item.url}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        </AspectRatio>
        {item.type === "video" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
              <Video className="h-8 w-8 text-white" />
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 rounded-full"
          onClick={() => onSelect(item)}
        >
          <Eye className="h-4 w-4 text-white" />
        </Button>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold truncate">{item.title}</h3>
        <p className="text-sm text-muted-foreground truncate">
          {item.description}
        </p>
      </CardContent>
    </Card>
  );
};

export default ProtectedMediaGallery;
