"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Gamepad, Info, X } from "lucide-react";

interface Game {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  gameUrl: string;
  controls: string;
  tags: string[];
}

interface GameShowcaseProps {
  games?: Game[];
  title?: string;
  description?: string;
}

export default function GameShowcase({
  games = [
    {
      id: "game1",
      title: "Cosmic Defender",
      description:
        "A fast-paced space shooter where you defend Earth from alien invaders. Features multiple weapon upgrades and challenging boss battles.",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1614294149010-950b698f72c0?w=800&q=80",
      gameUrl: "#",
      controls: "WASD to move, Space to shoot, E for special ability",
      tags: ["Action", "Shooter", "Space"],
    },
    {
      id: "game2",
      title: "Puzzle Quest",
      description:
        "A mind-bending puzzle adventure through mysterious landscapes. Solve increasingly complex puzzles to unlock the story.",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=800&q=80",
      gameUrl: "#",
      controls: "Mouse to select and move pieces, R to reset puzzle",
      tags: ["Puzzle", "Adventure", "Strategy"],
    },
    {
      id: "game3",
      title: "Dungeon Crawler",
      description:
        "Explore procedurally generated dungeons, defeat monsters, and collect loot in this roguelike adventure.",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1605899435973-ca2d1a8861cf?w=800&q=80",
      gameUrl: "#",
      controls: "Arrow keys to move, Z to attack, X to use item",
      tags: ["RPG", "Roguelike", "Adventure"],
    },
    {
      id: "game4",
      title: "Speed Racer",
      description:
        "Race against time and opponents in this high-octane racing game with customizable vehicles and challenging tracks.",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&q=80",
      gameUrl: "#",
      controls: "Arrow keys to steer, Space to boost, Shift to drift",
      tags: ["Racing", "Action", "Sports"],
    },
  ],
  title = "Featured Games",
  description = "Check out my latest game projects. Click on any game to play directly in your browser!",
}: GameShowcaseProps) {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "carousel">("grid");

  const handlePlayGame = (game: Game) => {
    setSelectedGame(game);
    setIsPlaying(true);
  };

  const handleCloseGame = () => {
    setIsPlaying(false);
  };

  return (
    <div className="w-full bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary mb-4">{title}</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {description}
          </p>
        </div>

        <div className="flex justify-end mb-6">
          <Tabs
            defaultValue="grid"
            className="w-[200px]"
            onValueChange={(value) => setViewMode(value as "grid" | "carousel")}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="grid">Grid</TabsTrigger>
              <TabsTrigger value="carousel">Carousel</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {games.map((game) => (
              <GameCard key={game.id} game={game} onPlay={handlePlayGame} />
            ))}
          </div>
        ) : (
          <Carousel className="w-full">
            <CarouselContent>
              {games.map((game) => (
                <CarouselItem
                  key={game.id}
                  className="md:basis-1/2 lg:basis-1/3"
                >
                  <div className="p-1">
                    <GameCard game={game} onPlay={handlePlayGame} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-4" />
            <CarouselNext className="-right-4" />
          </Carousel>
        )}

        <Dialog open={isPlaying} onOpenChange={setIsPlaying}>
          <DialogContent className="sm:max-w-[90vw] sm:max-h-[90vh] h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex justify-between items-center">
                <span>{selectedGame?.title}</span>
                <Button variant="ghost" size="icon" onClick={handleCloseGame}>
                  <X className="h-4 w-4" />
                </Button>
              </DialogTitle>
              <DialogDescription>{selectedGame?.description}</DialogDescription>
            </DialogHeader>
            <div className="flex-1 bg-muted rounded-md overflow-hidden relative h-full">
              {/* Game iframe would be embedded here */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-6">
                  <Gamepad className="h-16 w-16 mx-auto mb-4 text-primary" />
                  <p className="text-lg font-medium mb-2">
                    Game would load here
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    In a real implementation, an iframe or embedded HTML5 game
                    would appear here.
                  </p>
                  <div className="bg-background p-4 rounded-md inline-block">
                    <h4 className="font-medium mb-2 flex items-center">
                      <Gamepad className="mr-2 h-4 w-4" /> Controls:
                    </h4>
                    <p className="text-sm">{selectedGame?.controls}</p>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

interface GameCardProps {
  game: Game;
  onPlay: (game: Game) => void;
}

function GameCard({ game, onPlay }: GameCardProps) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg h-full flex flex-col bg-card">
      <div className="relative">
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={game.thumbnailUrl}
            alt={game.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background"
          onClick={() => setShowInfo(!showInfo)}
        >
          <Info className="h-4 w-4" />
        </Button>
      </div>
      <CardHeader>
        <CardTitle>{game.title}</CardTitle>
        <CardDescription>{game.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {showInfo && (
          <div className="bg-muted p-3 rounded-md text-sm">
            <h4 className="font-medium mb-1 flex items-center">
              <Gamepad className="mr-2 h-4 w-4" /> Controls:
            </h4>
            <p className="mb-2">{game.controls}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {game.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={() => onPlay(game)}
          variant="default"
        >
          Play Game
        </Button>
      </CardFooter>
    </Card>
  );
}
