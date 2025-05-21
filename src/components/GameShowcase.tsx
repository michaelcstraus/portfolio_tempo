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
      controls: "Select your bet, I recommend staying on the defualt values. Press the spin button to spin the reels.",
      tags: ["Inovation", "Shooter", "Space"],
      role: "I helped originate the concept for Times Machine Extra and led early prototyping efforts, building a fully playable Unity prototype to validate gameplay and gather user feedback before production. I handled wireframing and UX design, wrote the full game rules and marketing copy, and served as daily Producer throughout development. I also managed outsourced art and sound studios and took on the role of Sound Director and shared the role of Sound Designer."
    },
    { id: "game2",
      title: "Lucky Money Tree",
      description:
        "A premium feeling Instant-Win style game with engaging characters and a fun multipler sequence.",
      thumbnailUrl:
        "https://cdn.prod.website-files.com/5eea6df1518e5b7e3f7203af/66b26c17ce7e1a74dd85dd97_63cedf80d6c8154ea37af039_Lucky-Money-Tree-screenshot.png",
      gameUrl: "https://rmg.boomfantasy.com/moneytree/1/dist/index.html",
      controls: "Choose your bet amount, Spam the Spin button to win big!",
      tags: ["Casino", "Roulette","3D"],
      role: "I championed the introduction of instant-win mechanics into Boom's game library, identifying the trend early and pushing Lucky Money Tree as a vehicle for innovation. I led the R&D phase to implement dynamic, layered Spine animations—engineering a blend system that made the tree react fluidly and convincingly to player interactions. In addition to daily production oversight, I served as Sound Director, shaping the game's audio and coordinating external sound resources to match the game's whimsical, high-energy feel."
    },
    { id: "game3",
      title: "Fanatics Fire Roulette",
      description:
        "A true 3D Game optimized for mobile web. American Roulette with Fire Multiplier. Win up to 500X your bet!",
      thumbnailUrl:
        "/images/games/fire_roulette_thumb.png",
      gameUrl: "https://rmg.boomfantasy.com/hotspotroulette/1/dist/index.html?landscape=true",
      controls: "Place your bets on the table, Press the Spin button to start the game",
      tags: ["Casino", "Roulette","3D"],
      role: "As Producer and UX Designer, I led end-to-end development on Fire Roulette, including wireframes, player flow, and client communication with Fanatics. I directed R&D to integrate high-resolution 3D assets and real-time volumetric fire while keeping the game optimized for mobile web. I also was the architect of the ball control system—designing a solution that ensured accurate outcomes without sacrificing visual fidelity. Rounding out my role, I served as Music Director and created the game's complete sound design."
    },
    { id: "game10",
      title: "Caesars' Pick and Win Daily Rewards",
      description:
        "A Daily Reward System for Caesars Casino",
      thumbnailUrl:
        "https://images.actionnetwork.com/1200x675/blog/2025/01/Caesar-1.webp",
      gameUrl: "https://images.actionnetwork.com/1200x675/blog/2025/01/Caesar-1.webp",
      controls: "The player is Awarded an amount of daily picks. If the player fills a meter over the course of a week, they are awarded the prize.  There are also instant win prizes that can be won at any time.",
      tags: ["Casino", "Reward System"],
      role: "As Producer and UX Designer, I led end-to-end development on The Caesars' Daily Reward Bonus game, including wireframes, player flow, full stack production, integration with the Caesars API, and client communication with Caesars"
    },
    { id: "game9",
      title: "Fanatics Multihand Blackjack with Sidebets",
      description:
        "A Premium Blackjack experience with Sidebets and Multihand play.",
      thumbnailUrl:
        "https://gambling.com/cdn-cgi/image/,h=,format=webp/https://objects.kaxmedia.com/genesis/fanatics-casino-app.png?v=f5eda9e1e8272d91414338a43ad68e9c6b9b5d57",
      gameUrl: "https://rmg.boomfantasy.com/blackjackmultihand2/dist/index.html?landscape=true",
      controls: "Place your bets on the table, Press the deal button to start the game",
      tags: ["Casino", "Blackjack","3D"],
      role: "As Producer and UX Designer, I led end-to-end development on The Fanatics Blackjack Games and their Alternate Skins, including wireframes, player flow, and client communication with Fanatics.  Rounding out my role, I served as Music Director, created the game's complete sound design, and composed the Piano Trio Background music"
    },
    {
      id: "game4",
      title: "$mash Comet",
      description:
        "A truly Innovative iGaming experience. ",
      thumbnailUrl:
        "https://cdn.prod.website-files.com/5eea6df1518e5b7e3f7203af/66916a5603c4a506f9e85989_%24mash-comet-website-thumbnail-1200x627.png",
      gameUrl: "https://rmg.boomfantasy.com/blastradius/1/dist/index.html",
      controls: "Find a Prize or Prizes you want and click on it until you win. I Recommend setting the bet to at least $.10",
      tags: ["Inovation", "Instant Win", "WYSIWYG"],
      role: "I led the early concept development and prototyping of Blast Radius, building a Unity prototype to test gameplay mechanics before full production. My responsibilities included UX design, wireframing, and daily production oversight. I authored the game rules, wrote marketing copy, and managed external art and sound vendors. As Sound Director, I shaped the game's audio identity—including recording custom alien vocals featuring myself and my daughter for the game's signature 'oop-eeep' backing music."
    },
    {
      id: "game5",
      title: "Retro Riches",
      description:
        "A Fever dream of an iGaming experience. A mixture of unique mechanics and a long term persistence system.",
      thumbnailUrl:
        "https://www.gamingintelligence.com/wp-content/uploads/2021/07/H5G_RetroRichesmob-1024x576.jpg",
      gameUrl: "https://slotcatalog.com/en/slots/Retro-Riches?ajax=1&blck=demo-widget",
      controls: "Select your bet, Press the spin button to spin the reels.",
      tags: ["Innovation", "Retro", "Dots and Shapes"],
      role: "Born from a vague 'dots and shapes' prompt from our CEO, I led the innovation and feature design of Retro Riches, translating that spark into a fully playable Unity prototype in just two weeks. The prototype revealed surprisingly engaging gameplay, prompting full development. I designed and implemented a long-term progression system that tracks player collections across sessions—expanding their symbol bank over time and increasing prize potential. The result was a fresh take on slots with a persistent, player-driven meta layer."
    },
    {
      id: "game6",
      title: "Beat The House",
      description:
        "Experience the thrill of a completely beat-synced slot machine, featuring short and medium-term persistence features that elevate your gameplay.",
      thumbnailUrl:
        "https://www.high5games.com/wp-content/themes/h5g/assets/img/games/2990/banner.jpg",
      gameUrl: "https://slotcatalog.com/en/slots/Beat-The-House?ajax=1&blck=demo-widget",
      controls: "Select your bet, Press the spin button to spin the reels. Various layers of the music track are added as you fill in each column of the meter",
      tags: ["Racing", "Action", "Sports"],
      role: "Technical Director and Physics Programmer. Implemented the vehicle physics system, track design tools, and AI racing opponents. Optimized performance for smooth gameplay. I worked on the innovation team, built the original prototype, and served as technical sound programmer, working on the beat syncing capabilities and R&Ding how to sync the music to certain animations."
    },
    {
      id: "game7",
      title: "Green Machine Deluxe Power Bet",
      description:
        "An updated version of the classic Green Machine Deluxe game with a new Power Bet mechanic.",
      thumbnailUrl:
        "https://slotcatalog.com/userfiles/image/games/High-5-Games/16582/Green-Machine-Deluxe-Power-Bet-7.png",
      gameUrl: "https://slotcatalog.com/en/slots/Green-Machine-Deluxe-Power-Bet?ajax=1&blck=demo-widget",
      controls: "Select your bet, Press the spin button to spin the reels.",
      tags: ["WYSIWYG", "Classic IP", "Buy-A-Bonus"],
      role: 'As part of the Innovation Team, I built the original prototypes for Green Machine with Power Bet, designing and testing new mechanics for one of our most popular IPs. I helped conceptualize the Power Bet feature—a user-activated bonus that adds volatility and excitement through an upfront wager. The goal was to modernize a classic title by giving players more agency and risk-reward strategy, while maintaining the core appeal of the original Green Machine experience.'
    },
      {
      id: "game8",
      title: "Interstellar Attack",
      description:
        "Blow Up Rocks and Aliens for prizes. A combination of short term and long term persistence features that upgrade the player's experience.",
      thumbnailUrl:
        "https://slotcatalog.com/userfiles/image/games/High-5-Games/20615/Interstellar-Attack-6856797.jpg",
      gameUrl: "https://slotcatalog.com/en/slots/Interstellar-Attack?ajax=1&blck=demo-widget",
      controls: "Select your bet. Press the spin button to spin the reels.",
      tags: ["Memory Feature", "Action", "Space"],
      role: "As a member of the Innovation Team, I designed the core mechanics and built the original prototype for Interstellar Attack, a sci-fi-inspired slot game that fuses arcade action with deep progression systems. I implemented both short-term and multi-session persistence features—delivering instant power-ups during gameplay while unlocking upgraded ships and higher RTP over time. I also collaborated with the math team to design a custom JSON protocol that handled persistent player data across sessions, enabling seamless backend integration and personalized progression."
    },
  ],
  title = "Featured Games",
  description = "Over the course of my career I've worked on over 150 iGaming Titles. The Following is A selection of my favorite and more innovative games I've worked on.",
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
    <div className="w-full">
      <div className="mx-auto">
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
          {game.id === "game10" ? "More Info" : "Play Game"}
        </Button>
      </CardFooter>
    </Card>
  );
}
