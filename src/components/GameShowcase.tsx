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
import { Gamepad, Info, X, User } from "lucide-react";

interface Game {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  gameUrl: string;
  controls: string;
  tags: string[];
  role?: string;
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
      title: "Times Machine Extra",
      description:
        "Equal parts timeless and innovative, Times Machine Extra is a unique twist on a classic slot game.",
      thumbnailUrl:
        "https://cdn.prod.website-files.com/5eea6df1518e5b7e3f7203af/66b26b409a285feaddd2b68c_66916ef78952473b0b1e32f5_time-machine-extra-website-screenshot.png",
      gameUrl: "https://rmg.boomfantasy.com/timesmachineextra/1/dist/index.html",
      controls: "Select your bet, I recommend staying on the defualt values. Press the spin button or press spacebar to spin the reels.",
      tags: ["Inovation", "Shooter", "Space"],
      role: "I helped originate the concept for Times Machine Extra and led early prototyping efforts, building a fully playable Unity prototype to validate gameplay and gather user feedback before production. I handled wireframing and UX design, wrote the full game rules and marketing copy, and served as daily Producer throughout development. I also managed outsourced art and sound studios and took on the role of Sound Director and shared the role of Sound Designer."
    },
    {
      id: "game2",
      title: "Fanatics Fire Roulette",
      description:
        "A true 3d Game optimized for mobile web. American Roulette with Fire Multiplier. Win up to 500X your bet!",
      thumbnailUrl:
        "/images/games/fire_roulette_thumb.png",
      gameUrl: "https://rmg.boomfantasy.com/hotspotroulette/1/dist/index.html?landscape=true",
      controls: "Place your bets on the table, Press the Spin button to start the game",
      tags: ["Casino", "Roulette","3D"],
      role: "As Producer and UX Designer, I led end-to-end development on Fire Roulette, including wireframes, player flow, and client communication with Fanatics. I directed R&D to integrate high-resolution 3D assets and real-time volumetric fire while keeping the game optimized for mobile web. I also was the architect of the ball control system—designing a solution that ensured accurate outcomes without sacrificing visual fidelity. Rounding out my role, I served as Music Director and created the game’s complete sound design."
    },
    {
      id: "game3",
      title: "$mash Comet",
      description:
        "A truly Innovative iGaming experience. ",
      thumbnailUrl:
        "https://cdn.prod.website-files.com/5eea6df1518e5b7e3f7203af/66916a5603c4a506f9e85989_%24mash-comet-website-thumbnail-1200x627.png",
      gameUrl: "https://rmg.boomfantasy.com/blastradius/1/dist/index.html",
      controls: "Arrow keys to move, Z to attack, X to use item",
      tags: ["Inovation", "Instant Win", "WYSIWYG"],
      role: "I led the early concept development and prototyping of Blast Radius, building a Unity prototype to test gameplay mechanics before full production. My responsibilities included UX design, wireframing, and daily production oversight. I authored the game rules, wrote marketing copy, and managed external art and sound vendors. As Sound Director, I shaped the game’s audio identity—including recording custom alien vocals featuring myself and my daughter for the game's signature “oop-eeep” backing music."
    },
    {
      id: "game4",
      title: "Retro Riches",
      description:
        "Race against time and opponents in this high-octane racing game with customizable vehicles and challenging tracks.",
      thumbnailUrl:
        "https://www.gamingintelligence.com/wp-content/uploads/2021/07/H5G_RetroRichesmob-1024x576.jpg",
      gameUrl: "https://slotcatalog.com/en/slots/Retro-Riches?ajax=1&blck=demo-widget",
      controls: "Arrow keys to steer, Space to boost, Shift to drift",
      tags: ["Racing", "Action", "Sports"],
      role: "Technical Director and Physics Programmer. Implemented the vehicle physics system, track design tools, and AI racing opponents. Optimized performance for smooth gameplay."
    },
    {
      id: "game5",
      title: "Beat The House",
      description:
        "Race against time and opponents in this high-octane racing game with customizable vehicles and challenging tracks.",
      thumbnailUrl:
        "https://www.high5games.com/wp-content/themes/h5g/assets/img/games/2990/banner.jpg",
      gameUrl: "https://slotcatalog.com/en/slots/Beat-The-House?ajax=1&blck=demo-widget",
      controls: "Arrow keys to steer, Space to boost, Shift to drift",
      tags: ["Racing", "Action", "Sports"],
      role: "Technical Director and Physics Programmer. Implemented the vehicle physics system, track design tools, and AI racing opponents. Optimized performance for smooth gameplay."
    },
    {
      id: "game6",
      title: "Green Machine Deluxe Power Bet",
      description:
        "Race against time and opponents in this high-octane racing game with customizable vehicles and challenging tracks.",
      thumbnailUrl:
        "https://slotcatalog.com/userfiles/image/games/High-5-Games/16582/Green-Machine-Deluxe-Power-Bet-7.png",
      gameUrl: "https://slotcatalog.com/en/slots/Green-Machine-Deluxe-Power-Bet?ajax=1&blck=demo-widget",
      controls: "Arrow keys to steer, Space to boost, Shift to drift",
      tags: ["Racing", "Action", "Sports"],
      role: "Technical Director and Physics Programmer. Implemented the vehicle physics system, track design tools, and AI racing opponents. Optimized performance for smooth gameplay."
    },
      {
      id: "game6",
      title: "Interstellar Attack",
      description:
        "Race against time and opponents in this high-octane racing game with customizable vehicles and challenging tracks.",
      thumbnailUrl:
        "https://slotcatalog.com/userfiles/image/games/High-5-Games/20615/Interstellar-Attack-6856797.jpg",
      gameUrl: "https://slotcatalog.com/en/slots/Interstellar-Attack?ajax=1&blck=demo-widget",
      controls: "Arrow keys to steer, Space to boost, Shift to drift",
      tags: ["Racing", "Action", "Sports"],
      role: "Technical Director and Physics Programmer. Implemented the vehicle physics system, track design tools, and AI racing opponents. Optimized performance for smooth gameplay."
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
          <DialogContent className="sm:max-w-[95vw] sm:max-h-[95vh] h-[95vh] w-full max-w-screen-2xl p-2 md:p-4 overflow-hidden flex flex-col">
            <DialogHeader className="shrink-0 px-2">
              <DialogTitle className="flex justify-between items-center">
                <span>{selectedGame?.title}</span>
                <Button variant="ghost" size="icon" onClick={handleCloseGame}>
                  <X className="h-4 w-4" />
                </Button>
              </DialogTitle>
              <DialogDescription className="line-clamp-2">{selectedGame?.description}</DialogDescription>
            </DialogHeader>
            
            {/* Main content area with scrolling */}
            <div className="flex-1 overflow-y-auto pb-4">
              {/* Game iframe container */}
              <div className="w-full aspect-video mb-4 mx-auto max-w-5xl">
                {selectedGame && selectedGame.gameUrl && selectedGame.gameUrl !== "#" ? (
                  <iframe
                    src={selectedGame.gameUrl}
                    title={selectedGame.title}
                    className="w-full h-full border-0 rounded-md"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted rounded-md">
                    <div className="text-center p-6">
                      <Gamepad className="h-16 w-16 mx-auto mb-4 text-primary" />
                      <p className="text-lg font-medium mb-2">
                        Game not available
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        This game doesn't have a playable URL configured yet.
                      </p>
                      <div className="bg-background p-4 rounded-md inline-block">
                        <h4 className="font-medium mb-2 flex items-center">
                          <Gamepad className="mr-2 h-4 w-4" /> Controls:
                        </h4>
                        <p className="text-sm">{selectedGame?.controls}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Information panels */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* My Role Section */}
                {selectedGame && selectedGame.role && (
                  <div className="bg-muted p-4 rounded-md">
                    <h3 className="text-lg font-semibold mb-2 flex items-center">
                      <User className="mr-2 h-4 w-4" /> My Role
                    </h3>
                    <p className="text-sm text-muted-foreground">{selectedGame.role}</p>
                  </div>
                )}
                
                {/* Game Controls Section */}
                <div className="bg-muted p-4 rounded-md">
                  <h4 className="text-lg font-semibold mb-2 flex items-center">
                    <Gamepad className="mr-2 h-4 w-4" /> Game Info
                  </h4>
                  <p className="text-sm mb-2"><span className="font-medium">Controls:</span> {selectedGame?.controls}</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedGame?.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))}
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
