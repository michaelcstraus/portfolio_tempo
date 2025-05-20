"use client";

import React from "react";
import { Button } from "./ui/button";
import { Volume2, VolumeX } from "lucide-react";

interface MuteButtonProps {
  isMuted: boolean;
  onToggle: () => void;
}

const MuteButton: React.FC<MuteButtonProps> = ({ isMuted, onToggle }) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onToggle();
  };

  return (
    <Button
      onClick={handleClick}
      variant="ghost"
      size="icon"
      className="fixed top-4 right-4 z-50 text-neutral-400 hover:text-neutral-200 transition-colors"
      aria-label={isMuted ? "Unmute" : "Mute"}
    >
      {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
    </Button>
  );
};

export default MuteButton; 