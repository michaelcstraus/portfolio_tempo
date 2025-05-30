"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PasswordProtectedGameShowcase from "@/components/PasswordProtectedGameShowcase";
import SkillsDisplay from "@/components/SkillsDisplay";
import StageDiveShowcase from "@/components/StageDiveShowcase";
import MusicSection from "@/components/MusicSection";
import ContactSection from "@/components/ContactSection";
import { ArrowDown, Gamepad2, Code, Globe, Music, User, Milestone } from "lucide-react";
import { audioManager } from '@/components/AudioManager';
import { Howler } from 'howler';
import MuteButton from "@/components/MuteButton";

const USER_MUTE_PREFERENCE_KEY = 'userMutePreference';

const AUDIO_PROGRAMMER_TITLE = "Audio Programmer";
const CREATIVE_LEAD_TITLE = "Creative Lead";
const GAME_DESIGNER_TITLE = "Game Designer";

const PROFESSIONAL_TITLES = [
  "Product Director...",
  GAME_DESIGNER_TITLE,
  AUDIO_PROGRAMMER_TITLE,
  CREATIVE_LEAD_TITLE,
  "Sound Director",
];

const CHAOTIC_COLORS = ['#FF1493', '#FF8C00', '#ADFF2F', '#00BFFF', '#BA55D3', '#FFD700'];
const HARMONIOUS_PALETTE_CL = ['#ec4899', '#22d3ee', '#a855f7', '#ffffff']; // Pink, Cyan, Purple, White

// Define sound names for consistency
const SOUND_GLITCH = 'glitch';
const SOUND_POP = 'pop';
const SOUND_GAME_MUSIC = 'gameMusic';
const SOUND_GAME_WIN = 'gameWin';
// const SOUND_PRODUCT_DIRECTOR_LAND = 'productDirectorLand';
// const SOUND_GAME_DESIGNER_LAND = 'gameDesignerLand';
const SOUND_AUDIO_PROGRAMMER_LAND = 'audioProgrammerLand';
// const SOUND_CREATIVE_LEAD_LAND = 'creativeLeadLand';
// const SOUND_SOUND_DIRECTOR_LAND = 'soundDirectorLand';

export default function Home() {
  const [activeTab, setActiveTab] = useState("games");
  const tabsRef = useRef<HTMLDivElement>(null);

  const [displayedTitle, setDisplayedTitle] = useState(PROFESSIONAL_TITLES[0]);
  const [isGlowing, setIsGlowing] = useState(false);
  const [currentGlowClass, setCurrentGlowClass] = useState('');
  const activeTitleIndexRef = useRef(0);
  
  // State for letter animation
  const [isLetterAnimating, setIsLetterAnimating] = useState(false);
  const [animatedLetters, setAnimatedLetters] = useState<Array<{ char: string; isVisible: boolean; hasPunched: boolean }>>([]);
  const letterAnimationTimeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // State for Creative Lead animation
  const [isCreativeLeadAnimating, setIsCreativeLeadAnimating] = useState(false);
  const [creativeLeadLetters, setCreativeLeadLetters] = useState<Array<{ char: string; currentColor: string; finalColor: string; isSettled: boolean }>>([]);
  const chaoticColorIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const settlePhaseStartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const creativeLetterSettleTimeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // State for Game Designer game
  const [isGameDesignerAnimating, setIsGameDesignerAnimating] = useState(false);
  type GameLetterStatus = 'neutral' | 'good' | 'popped';
  type GameLetter = { char: string; id: string; status: GameLetterStatus; key: string };
  const [gameDesignerLetters, setGameDesignerLetters] = useState<GameLetter[]>([]);
  const gameRoundTimerRef = useRef<NodeJS.Timeout | null>(null);
  const gameWonRef = useRef(false);

  // New state for game timer and winner message
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const [gameEndTime, setGameEndTime] = useState<number | null>(null);
  const [showWinnerMessage, setShowWinnerMessage] = useState(false);

  // New state and ref for live game timer
  const [currentGameTime, setCurrentGameTime] = useState(0);
  const liveGameTimerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Add a state to track if we're paused on the Game Designer title
  const [gameDesignerPaused, setGameDesignerPaused] = useState(false);

  const glitchEffectIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const nextTitleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isGlitchSoundPlayingRef = useRef(false);
  const wasGameMusicPlayingBeforeHiddenRef = useRef(false);

  // Refs to mirror state for access in visibility handler
  const isGameDesignerAnimatingRef = useRef(isGameDesignerAnimating);
  const displayedTitleRef = useRef(displayedTitle);
  const gameDesignerPausedRef = useRef(gameDesignerPaused);
  const showWinnerMessageRef = useRef(showWinnerMessage);

  const GLOW_CLASSES = [
    'text-glow-style-1',
    'text-glow-style-2',
    'text-glow-style-3',
    'text-glow-style-4',
    'text-glow-style-5',
  ];

  const [isMobile, setIsMobile] = useState(false);
  const initialMobileLoadRef = useRef(true); // To track if auto-start has occurred
  const [isMuted, setIsMuted] = useState(false); // State for mute status

  const generateGlitchedText = (text: string, intensity: number = 0.7) => {
    const chars = "!<>-_\\\\/[]{}—=+*^?#"; // Escaped backslash for regex and string literal
    return text
      .split("")
      .map(char => (char !== ' ' && Math.random() > (1 - intensity) ? chars[Math.floor(Math.random() * chars.length)] : char))
      .join("");
  };

  const clearLetterAnimationTimeouts = () => {
    letterAnimationTimeoutsRef.current.forEach(clearTimeout);
    letterAnimationTimeoutsRef.current = [];
  };

  const clearCreativeLeadAnimationTimeouts = () => {
    if (chaoticColorIntervalRef.current) clearInterval(chaoticColorIntervalRef.current);
    if (settlePhaseStartTimeoutRef.current) clearTimeout(settlePhaseStartTimeoutRef.current);
    creativeLetterSettleTimeoutsRef.current.forEach(clearTimeout);
    chaoticColorIntervalRef.current = null;
    settlePhaseStartTimeoutRef.current = null;
    creativeLetterSettleTimeoutsRef.current = [];
  };

  const clearGameDesignerTimers = () => {
    if (gameRoundTimerRef.current) clearTimeout(gameRoundTimerRef.current);
    gameRoundTimerRef.current = null;
    if (liveGameTimerIntervalRef.current) clearInterval(liveGameTimerIntervalRef.current); // Clear live timer
    liveGameTimerIntervalRef.current = null;
    
    audioManager.stopSound(SOUND_GAME_MUSIC);
  };

  const cleanUpTimers = () => {
    if (glitchEffectIntervalRef.current) clearInterval(glitchEffectIntervalRef.current);
    if (nextTitleTimeoutRef.current) clearTimeout(nextTitleTimeoutRef.current);
    glitchEffectIntervalRef.current = null;
    nextTitleTimeoutRef.current = null;

    if (isGlitchSoundPlayingRef.current) {
      audioManager.stopSound(SOUND_GLITCH);
      isGlitchSoundPlayingRef.current = false;
    }
    clearLetterAnimationTimeouts();
    clearCreativeLeadAnimationTimeouts();
    clearGameDesignerTimers();
  };

  const endGameDesignerGame = (gameWon: boolean = false) => {
    setIsGameDesignerAnimating(false);
    if (liveGameTimerIntervalRef.current) clearInterval(liveGameTimerIntervalRef.current); 
    liveGameTimerIntervalRef.current = null;
    
    audioManager.stopSound(SOUND_GAME_MUSIC);
    
    if (gameRoundTimerRef.current) clearTimeout(gameRoundTimerRef.current);
    gameRoundTimerRef.current = null;

    if (gameWon) {
      if (!document.hidden) audioManager.playSound(SOUND_GAME_WIN);
      setShowWinnerMessage(true);
      nextTitleTimeoutRef.current = setTimeout(() => {
        setShowWinnerMessage(false); 
        setGameStartTime(null); setGameEndTime(null); setCurrentGameTime(0);
        startGlitchSequence();
      }, 2500); 
    } else {
      setShowWinnerMessage(false);
      setGameStartTime(null); setGameEndTime(null); setCurrentGameTime(0);
      nextTitleTimeoutRef.current = setTimeout(startGlitchSequence, 800 + Math.random() * 500); 
    }
  };

  const startGameDesignerRound = () => {
    if (gameRoundTimerRef.current) clearTimeout(gameRoundTimerRef.current);
    setGameDesignerLetters(prevLetters => {
      const activeLetters = prevLetters.filter(l => l.status !== 'popped' && l.char !== ' ');
      if (activeLetters.length === 0) {
        if (gameStartTime && !gameEndTime) {
          console.log("All letters popped in startGameDesignerRound - Setting game end state for useEffect to handle.");
          setGameEndTime(Date.now());
          gameWonRef.current = true;
        }
        return prevLetters; // Important: if game is over, don't light up new letters
      }
      
      // Reset all non-space letters to neutral first
      let newLetters = prevLetters.map(l => {
        if (l.char === ' ') return l; // Keep spaces as is
        return l.status === 'good' ? { ...l, status: 'neutral' as GameLetterStatus } : l;
      });
      
      // Ensure at least 1 letter is highlighted from non-space, non-popped letters
      const numGoodTargets = Math.max(1, Math.min(activeLetters.length, Math.floor(Math.random() * 2) + 1));
      const availableIndices = activeLetters.map(l => newLetters.findIndex(nl => nl.id === l.id)).filter(index => index !== -1);
      
      for (let i = 0; i < numGoodTargets; i++) {
        if (availableIndices.length === 0) break;
        const randomIndex = Math.floor(Math.random() * availableIndices.length);
        const letterIndexToChange = availableIndices.splice(randomIndex, 1)[0];
        if (newLetters[letterIndexToChange]) {
          newLetters[letterIndexToChange] = {
            ...newLetters[letterIndexToChange],
            status: 'good' as GameLetterStatus
          };
        }
      }
      return newLetters;
    });
    
    // Schedule next round with a variable delay - this will only be used if no letters are clicked
    // The win condition check within setGameDesignerLetters should prevent new rounds if game is won.
    gameRoundTimerRef.current = setTimeout(() => {
      startGameDesignerRound();
    }, 1500 + Math.random() * 500);
  };

  // Add auto-advance timeout reference
  const gameDesignerAutoAdvanceRef = useRef<NodeJS.Timeout | null>(null);

  // Ref to signal that the auto-advance mechanism should trigger a sequence change
  const forceGameDesignerAdvanceRef = useRef(false);

  // Add a ref to track if auto-advance is already set up
  const isAutoAdvanceSetupRef = useRef(false);

  // Auto-advance for Game Designer title
  useEffect(() => {
    // Auto-advance for Game Designer title
    if (displayedTitle === GAME_DESIGNER_TITLE && gameDesignerPaused) {
      // Cancel any existing auto-advance timer
      if (gameDesignerAutoAdvanceRef.current) {
        clearTimeout(gameDesignerAutoAdvanceRef.current);
        gameDesignerAutoAdvanceRef.current = null;
      }
      
      // Set up the auto-advance timer
      console.log("AUTO-ADVANCE: Setting 5s timer for Game Designer idle");
      gameDesignerAutoAdvanceRef.current = setTimeout(() => {
        // Check condition again, in case something else changed gameDesignerPaused
        if (displayedTitle === GAME_DESIGNER_TITLE && gameDesignerPaused) {
          console.log("AUTO-ADVANCE: 5s idle timer fired. Setting flag and unpausing.");
          forceGameDesignerAdvanceRef.current = true;
          setGameDesignerPaused(false); // This will trigger the other useEffect to call startGlitchSequence
        } else {
          console.log("AUTO-ADVANCE: 5s idle timer fired, but conditions no longer met.");
        }
      }, 5000);
    }
    
    // Always clean up timer when component unmounts or Game Designer is no longer active or paused
    return () => {
      if (gameDesignerAutoAdvanceRef.current) {
        clearTimeout(gameDesignerAutoAdvanceRef.current);
        gameDesignerAutoAdvanceRef.current = null;
        console.log("AUTO-ADVANCE: Cleaned up 5s idle timer in useEffect cleanup.");
      }
    };
  }, [displayedTitle, gameDesignerPaused]);

  // Update the handleLetterClick function
  const handleLetterClick = (letterId: string) => {
    const clickedLetter = gameDesignerLetters.find(l => l.id === letterId);
    
    if (gameDesignerPaused && displayedTitle === GAME_DESIGNER_TITLE && clickedLetter?.status === 'good') {
      if (gameDesignerAutoAdvanceRef.current) {
        clearTimeout(gameDesignerAutoAdvanceRef.current);
        gameDesignerAutoAdvanceRef.current = null;
      }
      
      gameWonRef.current = false;
      setGameEndTime(null);
      setGameDesignerPaused(false);
      setGameStartTime(Date.now());
      setCurrentGameTime(0);
      
      if (!document.hidden) audioManager.playSound(SOUND_GAME_MUSIC);
      
      if (liveGameTimerIntervalRef.current) clearInterval(liveGameTimerIntervalRef.current);
      liveGameTimerIntervalRef.current = setInterval(() => {
        setGameStartTime(prevStartTime => {
          if (prevStartTime) {
            setCurrentGameTime((Date.now() - prevStartTime) / 1000);
          }
          return prevStartTime;
        });
      }, 100);
      
      if (!document.hidden) audioManager.playSound(SOUND_POP);
      
      setGameDesignerLetters(prevLetters => {
        const newLetters = prevLetters.map(l => {
          if (l.id === letterId && l.status === 'good') {
            return { ...l, status: 'popped' as GameLetterStatus };
          }
          return l;
        });
        
        const nonSpaceLetters = newLetters.filter(l => l.char !== ' ');
        // CORRECTED calculation for poppedNonSpaceLetters
        const poppedNonSpaceLetters = newLetters.filter(l => l.status === 'popped' && l.char !== ' ');
        
        console.log(`Popped: ${poppedNonSpaceLetters.length}/${nonSpaceLetters.length} letters`);
        
        if (poppedNonSpaceLetters.length === nonSpaceLetters.length) {
          console.log("All letters popped on first interactive click - Setting game end state for useEffect.");
          if (!gameEndTime) { // Ensure gameEndTime is set only once
            setGameEndTime(Date.now());
            gameWonRef.current = true;
          }
        } else {
          const remainingLitLetters = newLetters.filter(l => l.status === 'good' && l.char !== ' ');
          if (remainingLitLetters.length === 0) {
            if (gameRoundTimerRef.current) {
              clearTimeout(gameRoundTimerRef.current);
              gameRoundTimerRef.current = null;
            }
            setTimeout(() => startGameDesignerRound(), 0);
          }
        }
        return newLetters;
      });
      return;
    }
    
    // For ongoing gameplay (not the first click that starts the game)
    if (!gameDesignerPaused && displayedTitle === GAME_DESIGNER_TITLE) {
      const letterBeforeClick = gameDesignerLetters.find(l => l.id === letterId);
      
      if (letterBeforeClick && letterBeforeClick.status === 'good') {
        if (!document.hidden) audioManager.playSound(SOUND_POP);
        
        setGameDesignerLetters(prevLetters => {
          const newLetters = prevLetters.map(l => {
            if (l.id === letterId && l.status === 'good') {
              return { ...l, status: 'popped' as GameLetterStatus };
            }
            return l;
          });
          
          const nonSpaceLetters = newLetters.filter(l => l.char !== ' ');
          // CORRECTED calculation for poppedNonSpaceLetters
          const poppedNonSpaceLetters = newLetters.filter(l => l.status === 'popped' && l.char !== ' ');
          
          console.log(`Popped: ${poppedNonSpaceLetters.length}/${nonSpaceLetters.length} letters`);
          
          if (poppedNonSpaceLetters.length === nonSpaceLetters.length) {
            console.log("All letters popped in ongoing play - Setting game end state for useEffect.");
            if (!gameEndTime) { // Ensure gameEndTime is set only once
              setGameEndTime(Date.now());
              gameWonRef.current = true;
            }
          } else {
            const remainingLitLetters = newLetters.filter(l => l.status === 'good' && l.char !== ' ');
            if (remainingLitLetters.length === 0) {
              if (gameRoundTimerRef.current) {
                clearTimeout(gameRoundTimerRef.current);
                gameRoundTimerRef.current = null;
              }
              setTimeout(() => startGameDesignerRound(), 0);
            }
          }
          return newLetters;
        });
      }
    }
  };

  // Add effect to auto-advance if user doesn't interact
  useEffect(() => {
    // Clean up auto-advance timer on unmount
    return () => {
      if (gameDesignerAutoAdvanceRef.current) {
        clearTimeout(gameDesignerAutoAdvanceRef.current);
        gameDesignerAutoAdvanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (gameWonRef.current && gameEndTime && gameStartTime) {
      console.log("Win condition detected in useEffect - endGameDesignerGame(true)");
      endGameDesignerGame(true);
      gameWonRef.current = false; // Reset flag after handling the win
    }
  }, [gameEndTime, gameStartTime]); // Dependencies

  // New useEffect to start the game designer round only when letters are ready
  useEffect(() => {
    if (isGameDesignerAnimating && displayedTitle === GAME_DESIGNER_TITLE) {
      // Only proceed if no game round is currently scheduled by its own timer
      if (!gameRoundTimerRef.current) { 
        // Ensure letters are populated and not all are already popped (e.g., from a quick re-entry)
        if (gameDesignerLetters.length > 0 && gameDesignerLetters.some(l => l.status !== 'popped')) {
          startGameDesignerRound();
        }
      }
    }

    // Cleanup function for this effect
    return () => {
      // If the effect's conditions are no longer met (e.g., title changes or animation stops for GD),
      // ensure its specific round timer is cleared.
      // This check is to ensure we only clear if we're exiting the GD state that this effect instance might have managed.
      if (!(isGameDesignerAnimating && displayedTitle === GAME_DESIGNER_TITLE)) {
        if (gameRoundTimerRef.current) {
          clearTimeout(gameRoundTimerRef.current);
          gameRoundTimerRef.current = null;
        }
      }
    };
  }, [isGameDesignerAnimating, displayedTitle, gameDesignerLetters]); // Dependencies

  const startGlitchSequence = () => {
    setIsGlowing(false);
    setCurrentGlowClass('');
    setIsLetterAnimating(false);
    setAnimatedLetters([]);
    setIsCreativeLeadAnimating(false);
    setCreativeLeadLetters([]);
    
    // Don't reset if we're already in Game Designer mode and it's paused
    if (displayedTitle === GAME_DESIGNER_TITLE && gameDesignerPaused) {
      return;
    }
    
    // Clear any existing auto-advance timer when starting a new sequence
    if (gameDesignerAutoAdvanceRef.current) {
      clearTimeout(gameDesignerAutoAdvanceRef.current);
      gameDesignerAutoAdvanceRef.current = null;
    }
    
    setIsGameDesignerAnimating(false); 
    setShowWinnerMessage(false); 
    setGameStartTime(null); 
    setGameEndTime(null); 
    setCurrentGameTime(0); // Reset live timer value too
    gameWonRef.current = false; // Explicitly reset the win flag
    cleanUpTimers(); // This will clear liveGameTimerIntervalRef via clearGameDesignerTimers

    const nextIndex = (activeTitleIndexRef.current + 1) % PROFESSIONAL_TITLES.length;
    const targetTitle = PROFESSIONAL_TITLES[nextIndex];
    
    // Ensure gameDesignerPaused is false if the target is not Game Designer.
    // If it is Game Designer, it will be set to true after the glitch.
    if (targetTitle !== GAME_DESIGNER_TITLE) {
      setGameDesignerPaused(false);
    }
    
    let iterations = 0;
    const maxIterations = 5 + Math.floor(Math.random() * 5);
    const glitchDuration = 50;

    glitchEffectIntervalRef.current = setInterval(() => {
      if (iterations < maxIterations) {
        if (!isGlitchSoundPlayingRef.current && !document.hidden) {
          audioManager.playSound(SOUND_GLITCH);
          isGlitchSoundPlayingRef.current = true;
        }
        setDisplayedTitle(generateGlitchedText(targetTitle));
        iterations++;
      } else {
        if (glitchEffectIntervalRef.current) clearInterval(glitchEffectIntervalRef.current);
        glitchEffectIntervalRef.current = null;
        
        if (isGlitchSoundPlayingRef.current) {
          audioManager.stopSound(SOUND_GLITCH);
          isGlitchSoundPlayingRef.current = false;
        }

        // Play the appropriate landing sound based on the target title
        if (!document.hidden) {
            // if (targetTitle === GAME_DESIGNER_TITLE) audioManager.playSound(SOUND_GAME_DESIGNER_LAND);
            if (targetTitle === AUDIO_PROGRAMMER_TITLE) audioManager.playSound(SOUND_AUDIO_PROGRAMMER_LAND);
            // else if (targetTitle === CREATIVE_LEAD_TITLE) audioManager.playSound(SOUND_CREATIVE_LEAD_LAND);
            // else if (targetTitle === "Product Director") audioManager.playSound(SOUND_PRODUCT_DIRECTOR_LAND);
            // else if (targetTitle === "Sound Director") audioManager.playSound(SOUND_SOUND_DIRECTOR_LAND);
        }
        
        activeTitleIndexRef.current = nextIndex;
        setDisplayedTitle(targetTitle);

        // Defensive clear: Ensure no old timer makes us switch away from the landed title prematurely
        if (nextTitleTimeoutRef.current) {
            clearTimeout(nextTitleTimeoutRef.current);
            nextTitleTimeoutRef.current = null;
        }

        // Reset all animation states before setting the active one
        setIsLetterAnimating(false);
        setIsCreativeLeadAnimating(false);
        setIsGameDesignerAnimating(false); // Explicitly set to false before specific title logic

        if (targetTitle === GAME_DESIGNER_TITLE) {
          setDisplayedTitle(targetTitle); // Set title *after* glitch
          setGameDesignerPaused(true); 
          setIsGameDesignerAnimating(true);
          setGameDesignerLetters(
            GAME_DESIGNER_TITLE.split('').map((char, idx) => ({
              char,
              id: `${char}-${idx}`,
              status: 'neutral' as GameLetterStatus,
              key: `${char}-${idx}-${Date.now()}`
            }))
          );
        } else if (targetTitle === AUDIO_PROGRAMMER_TITLE) {
          setDisplayedTitle(targetTitle); // Set title *after* glitch
          setGameDesignerPaused(false); // Ensure GD is not paused
          setIsLetterAnimating(true);
          setIsGlowing(false);
          setCurrentGlowClass('');
          const lettersAP = AUDIO_PROGRAMMER_TITLE.split('').map(char => ({ char, isVisible: true, hasPunched: false }));
          setAnimatedLetters(lettersAP);

          lettersAP.forEach((_, letterIndex) => {
            const punchTimeout = setTimeout(() => {
              setAnimatedLetters(prev => prev.map((l, i) => i === letterIndex ? { ...l, hasPunched: true } : l));
              const unpunchTimeout = setTimeout(() => {
                setAnimatedLetters(prev => prev.map((l,i) => i === letterIndex ? {...l, hasPunched: false} : l));
              }, 300);
              letterAnimationTimeoutsRef.current.push(unpunchTimeout);
            }, letterIndex * 75);
            letterAnimationTimeoutsRef.current.push(punchTimeout);
          });
          nextTitleTimeoutRef.current = setTimeout(startGlitchSequence, 1500 + Math.random() * 1000 + (lettersAP.length * 75) + 300);
        } else if (targetTitle === CREATIVE_LEAD_TITLE) {
          setDisplayedTitle(targetTitle); // Set title *after* glitch
          setGameDesignerPaused(false); // Ensure GD is not paused
          setIsCreativeLeadAnimating(true);
          setIsGlowing(false);
          setCurrentGlowClass('');
          const creativeWordLength = "Creative".length;
          const lettersCL = CREATIVE_LEAD_TITLE.split('').map((char, index) => {
            let finalColorForLetter;
            if (index < creativeWordLength) { // Letters of "Creative"
              finalColorForLetter = HARMONIOUS_PALETTE_CL[0]; // Pink
            } else if (char === ' ') {
              finalColorForLetter = 'transparent';
            } else { // Letters of "Lead"
              finalColorForLetter = HARMONIOUS_PALETTE_CL[1]; // Cyan
            }
            return {
              char,
              currentColor: CHAOTIC_COLORS[Math.floor(Math.random() * CHAOTIC_COLORS.length)],
              finalColor: finalColorForLetter,
              isSettled: false,
            };
          });
          setCreativeLeadLetters(lettersCL);

          chaoticColorIntervalRef.current = setInterval(() => {
            setCreativeLeadLetters(prevLetters => prevLetters.map(l => l.isSettled ? l : { ...l, currentColor: CHAOTIC_COLORS[Math.floor(Math.random() * CHAOTIC_COLORS.length)] }));
          }, 75);

          settlePhaseStartTimeoutRef.current = setTimeout(() => {
            if (chaoticColorIntervalRef.current) clearInterval(chaoticColorIntervalRef.current); chaoticColorIntervalRef.current = null;
            lettersCL.forEach((letter, letterIndex) => {
              if (letter.char === ' ') {
                setCreativeLeadLetters(prev => prev.map((l, i) => i === letterIndex ? { ...l, isSettled: true, currentColor: 'transparent' } : l));
                return;
              }
              const settleTimeout = setTimeout(() => {
                setCreativeLeadLetters(prev => prev.map((l, i) => i === letterIndex ? { ...l, currentColor: l.finalColor, isSettled: true } : l));
              }, letterIndex * 75);
              creativeLetterSettleTimeoutsRef.current.push(settleTimeout);
            });
            const totalSettleTime = (lettersCL.length * 75) + 100;
            nextTitleTimeoutRef.current = setTimeout(startGlitchSequence, 1500 + Math.random() * 1000 + totalSettleTime);
          }, 1200);
        } else { // Default titles (e.g., "Product Director", "Sound Director")
          setDisplayedTitle(targetTitle); // Set title *after* glitch
          setGameDesignerPaused(false); // Ensure GD is not paused
          setIsLetterAnimating(false);
          setIsCreativeLeadAnimating(false);
          setIsGameDesignerAnimating(false);
          setIsGlowing(true);
          setCurrentGlowClass(GLOW_CLASSES[nextIndex % GLOW_CLASSES.length]);
          nextTitleTimeoutRef.current = setTimeout(startGlitchSequence, 1500 + Math.random() * 1000);
        }
      }
    }, glitchDuration);
  };

  // useEffect: Handles the actual advancement after gameDesignerPaused is set to false by the auto-advance timeout
  useEffect(() => {
    if (displayedTitle === GAME_DESIGNER_TITLE && !gameDesignerPaused && forceGameDesignerAdvanceRef.current) {
      console.log("AUTO-ADVANCE: Detected forced advance signal. Calling startGlitchSequence.");
      forceGameDesignerAdvanceRef.current = false; // Reset the flag
      // Check if a game was in progress and "abandon" it by stopping music etc.
      if (audioManager.isPlaying(SOUND_GAME_MUSIC)) {
        audioManager.stopSound(SOUND_GAME_MUSIC);
      }
      // Reset game state as it's being auto-advanced away
      setGameStartTime(null);
      setGameEndTime(null);
      setCurrentGameTime(0);
      gameWonRef.current = false;
      setShowWinnerMessage(false);

      startGlitchSequence();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayedTitle, gameDesignerPaused]); // startGlitchSequence is omitted as it's not memoized; logic relies on other deps.

  const handleMouseEnter = () => {
    if (isMobile) {
      return; // On mobile, animations auto-start and run; mouse enter does nothing extra.
    }
    // Original desktop logic for mouse enter:
    if (showWinnerMessage && PROFESSIONAL_TITLES[activeTitleIndexRef.current] === GAME_DESIGNER_TITLE) {
      return;
    }
    startGlitchSequence();
  };

  const handleMouseLeave = () => {
    if (isMobile) {
      return; // On mobile, animations auto-start and run; mouse leave does not stop them.
    }
    // Original desktop logic for mouse leave:
    if (PROFESSIONAL_TITLES[activeTitleIndexRef.current] === GAME_DESIGNER_TITLE && showWinnerMessage) {
      if (glitchEffectIntervalRef.current) {
        clearInterval(glitchEffectIntervalRef.current);
        glitchEffectIntervalRef.current = null;
      }
      clearLetterAnimationTimeouts();
      clearCreativeLeadAnimationTimeouts();
      return;
    }
    cleanUpTimers();
    const lastSettledTitle = PROFESSIONAL_TITLES[activeTitleIndexRef.current];
    setDisplayedTitle(lastSettledTitle);
    setIsGlowing(false);
    setCurrentGlowClass('');
    setIsLetterAnimating(false);
    setIsCreativeLeadAnimating(false);
    if (lastSettledTitle === AUDIO_PROGRAMMER_TITLE) {
      setAnimatedLetters(AUDIO_PROGRAMMER_TITLE.split('').map(char => ({ char, isVisible: true, hasPunched: false })));
    } else {
      setAnimatedLetters([]);
    }
    if (lastSettledTitle === CREATIVE_LEAD_TITLE) {
      const creativeWordLength = "Creative".length;
      setCreativeLeadLetters(CREATIVE_LEAD_TITLE.split('').map((char, index) => {
        let finalColorForLetter;
        if (index < creativeWordLength) {
          finalColorForLetter = HARMONIOUS_PALETTE_CL[0];
        } else if (char === ' ') {
          finalColorForLetter = 'transparent';
        } else {
          finalColorForLetter = HARMONIOUS_PALETTE_CL[1];
        }
        return {
          char,
          currentColor: finalColorForLetter,
          finalColor: finalColorForLetter,
          isSettled: true,
        };
      }));
    } else {
      setCreativeLeadLetters([]);
    }
    if (lastSettledTitle === GAME_DESIGNER_TITLE) {
      setIsGameDesignerAnimating(true);
      setGameDesignerPaused(true);
      setGameDesignerLetters(
        GAME_DESIGNER_TITLE.split('').map((char, idx) => ({
          char, id: `${char}-${idx}`, status: 'neutral' as GameLetterStatus, key: `${char}-${idx}-${Date.now()}`
        }))
      );
      gameWonRef.current = false;
      setShowWinnerMessage(false);
      setGameStartTime(null);
      setGameEndTime(null);
      setCurrentGameTime(0);
    } else {
      setIsGameDesignerAnimating(false);
      setGameDesignerLetters([]);
      gameWonRef.current = false;
      setGameDesignerPaused(false);
      setShowWinnerMessage(false);
      setGameStartTime(null);
      setGameEndTime(null);
      setCurrentGameTime(0);
    }
  };

  // Effects to keep refs in sync with state for visibility handler
  useEffect(() => { isGameDesignerAnimatingRef.current = isGameDesignerAnimating; }, [isGameDesignerAnimating]);
  useEffect(() => { displayedTitleRef.current = displayedTitle; }, [displayedTitle]);
  useEffect(() => { gameDesignerPausedRef.current = gameDesignerPaused; }, [gameDesignerPaused]);
  useEffect(() => { showWinnerMessageRef.current = showWinnerMessage; }, [showWinnerMessage]);

  const scrollToTabs = (tabValue: string) => {
    setActiveTab(tabValue);
    
    if (tabsRef.current) {
      setTimeout(() => {
        tabsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  // Update the initial letter highlighting effect
  useEffect(() => {
    // Highlight a random letter when Game Designer title first appears
    if (displayedTitle === GAME_DESIGNER_TITLE && gameDesignerPaused) {
      setGameDesignerLetters(prevLetters => {
        // Only modify if no letter is already highlighted (prevent re-runs)
        if (!prevLetters.some(l => l.status === 'good')) {
          // Choose a random letter to highlight first, excluding spaces
          const nonSpaceLetters = prevLetters.filter(l => l.char !== ' ' && l.status !== 'popped');
          if (nonSpaceLetters.length === 0) return prevLetters; // Safety check
          
          const randomLetter = nonSpaceLetters[Math.floor(Math.random() * nonSpaceLetters.length)];
          
          return prevLetters.map(l => {
            if (l.id === randomLetter.id) {
              return { ...l, status: 'good' as GameLetterStatus };
            }
            return l;
          });
        }
        return prevLetters;
      });
    }
  }, [displayedTitle, gameDesignerPaused, gameDesignerLetters]);

  // New useEffect to load sounds
  useEffect(() => {
    const soundsToLoad = [
      { name: SOUND_GLITCH, path: '/sounds/glitch_loop.wav', loop: true, volume: 0.7 },
      { name: SOUND_POP, path: '/sounds/pop.wav', volume: 0.7 },
      { name: SOUND_GAME_MUSIC, path: '/sounds/8bitloop.mp3', loop: true, volume: 0.5 },
      { name: SOUND_GAME_WIN, path: '/sounds/8bitterm.ogg', volume: 0.5 },
      // { name: SOUND_PRODUCT_DIRECTOR_LAND, path: '/sounds/product_director_land.ogg'},
      // { name: SOUND_GAME_DESIGNER_LAND, path: '/sounds/game_designer_land.ogg', volume: 0.5 },
      { name: SOUND_AUDIO_PROGRAMMER_LAND, path: '/sounds/audio_programmer_land.mp3', volume: .5 },
      // { name: SOUND_CREATIVE_LEAD_LAND, path: '/sounds/creative_lead_land.ogg'},
      // { name: SOUND_SOUND_DIRECTOR_LAND, path: '/sounds/sound_director_land.ogg'},
    ];

    Promise.all(
      soundsToLoad.map(sound => 
        audioManager.loadSound(sound.name, sound.path, sound.loop)
      )
    ).then(() => {
      console.log("All sounds loaded via AudioManager");
    }).catch(error => {
      console.error("Error loading one or more sounds:", error);
    });

    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log("Tab hidden, pausing/stopping Howler audio");
        Howler.mute(true);

        if (audioManager.isPlaying(SOUND_GAME_MUSIC)) {
          audioManager.pauseSound(SOUND_GAME_MUSIC);
          wasGameMusicPlayingBeforeHiddenRef.current = true;
        }
        if (isGlitchSoundPlayingRef.current && audioManager.getSound(SOUND_GLITCH)?.playing()) { 
            audioManager.pauseSound(SOUND_GLITCH);
        }

      } else {
        console.log("Tab visible, resuming Howler audio");
        Howler.mute(false);

        if (wasGameMusicPlayingBeforeHiddenRef.current) {
          if (isGameDesignerAnimatingRef.current &&
              displayedTitleRef.current === GAME_DESIGNER_TITLE &&
              !gameDesignerPausedRef.current &&
              !showWinnerMessageRef.current &&
              audioManager.getSound(SOUND_GAME_MUSIC)?.state() === 'loaded') {
            audioManager.resumeSound(SOUND_GAME_MUSIC);
          }
          wasGameMusicPlayingBeforeHiddenRef.current = false;
        }
        
        if (isGlitchSoundPlayingRef.current && 
            audioManager.getSound(SOUND_GLITCH)?.state() === 'loaded' && 
            !audioManager.getSound(SOUND_GLITCH)?.playing()) {
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      console.log("Home component unmounting. Unloading all sounds.");
      audioManager.unloadAllSounds();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      Howler.mute(false); 
    };
  }, []);

  // Effect for mobile detection and initializing mute state from localStorage
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(navigator.maxTouchPoints > 0 || window.innerWidth < 768);
    };
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    // Initialize mute state from localStorage
    const savedMutePreference = localStorage.getItem(USER_MUTE_PREFERENCE_KEY);
    if (savedMutePreference !== null) {
      const muted = JSON.parse(savedMutePreference);
      setIsMuted(muted);
      Howler.mute(muted);
      console.log(`Loaded mute preference from localStorage: ${muted ? 'Muted' : 'Unmuted'}`);
    } else {
      // If no preference, ensure Howler matches our default state (which is unmuted)
      Howler.mute(isMuted); // isMuted is initially false
      console.log(`No mute preference in localStorage, default: ${isMuted ? 'Muted' : 'Unmuted'}`);
    }

    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  // Effect to auto-start animations on mobile
  useEffect(() => {
    let autoStartTimer: NodeJS.Timeout | null = null;
    if (isMobile && initialMobileLoadRef.current) {
      console.log("Mobile device detected, scheduling auto-start of title sequence in 3 seconds.");
      autoStartTimer = setTimeout(() => {
        console.log("Auto-starting title sequence now (mobile).");
        startGlitchSequence(); 
        initialMobileLoadRef.current = false;
      }, 3000);
    } else {
      if (autoStartTimer) clearTimeout(autoStartTimer);
    }
    return () => {
      if (autoStartTimer) clearTimeout(autoStartTimer);
    };
  }, [isMobile]); // This effect should depend on isMobile

  const toggleMute = () => {
    const newMuteState = !isMuted;
    Howler.mute(newMuteState);
    setIsMuted(newMuteState);
    try {
      localStorage.setItem(USER_MUTE_PREFERENCE_KEY, JSON.stringify(newMuteState));
      console.log(`Saved mute preference to localStorage: ${newMuteState ? 'Muted' : 'Unmuted'}`);
    } catch (error) {
      console.error("Failed to save mute preference to localStorage:", error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-background">
      <MuteButton isMuted={isMuted} onToggle={toggleMute} />
      {/* Hero Section */}
      <section className="w-full min-h-screen flex flex-col items-center justify-center relative bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-900 text-white p-4 md:p-8">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80')] opacity-40 bg-cover bg-center mix-blend-overlay"></div>

        <div className="max-w-5xl mx-auto text-center z-10 space-y-6">
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight animate-fade-in"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-cyan-400">
              Michael Straus
            </span>
            <br />
            <span 
              className={`text-white ${isGlowing && !isLetterAnimating && !isCreativeLeadAnimating && !isGameDesignerAnimating && !showWinnerMessage ? currentGlowClass : ''}`}
              style={{ display: 'inline-block', cursor: 'default', minHeight: '1.2em' }} 
            >
              {/* Consistent positioning wrapper */}
              <div className="relative flex flex-col items-center justify-center">
                {/* PRIORITY 1: Winner Message */}
                {showWinnerMessage && gameStartTime && gameEndTime ? (
                  <span className="text-2xl md:text-3xl winner-message">
                    Winner! Time: {((gameEndTime - gameStartTime) / 1000).toFixed(2)}s
                  </span>
                ) 
                /* PRIORITY 2: Game Designer Game Active */
                : isGameDesignerAnimating && displayedTitle === GAME_DESIGNER_TITLE ? (
                  <div className="flex flex-col items-center">
                    <div>
                      {gameDesignerLetters.map((letter) => (
                        <span 
                          key={letter.key} 
                          onClick={() => handleLetterClick(letter.id)}
                          className={`letter-game-clickable ${letter.status === 'good' ? 'letter-game-target-good' : letter.status === 'popped' ? 'letter-pop-out' : 'letter-game-neutral'}`}
                          style={{ display: letter.char === ' ' ? 'inline' : 'inline-block' }}
                        >
                          {letter.char === ' ' ? '\u00A0' : letter.char}
                        </span>
                      ))}
                    </div>
                  </div>
                )
                /* PRIORITY 3: Creative Lead Animation */
                : isCreativeLeadAnimating && displayedTitle === CREATIVE_LEAD_TITLE ? (
                  <div>
                    {creativeLeadLetters.map((letter, index) => (
                      <span key={index} style={{ color: letter.currentColor, display: 'inline-block', transition: 'color 0.1s ease-in-out' }}>
                        {letter.char === ' ' ? '\u00A0' : letter.char}
                      </span>
                    ))}
                  </div>
                )
                /* PRIORITY 4: Audio Programmer Animation */
                : isLetterAnimating && displayedTitle === AUDIO_PROGRAMMER_TITLE ? (
                  <div>
                    {animatedLetters.map((letter, index) => (
                      <span 
                        key={index} 
                        className={`inline-block ${letter.isVisible ? 'letter-visible' : 'letter-hidden'} ${letter.hasPunched ? 'letter-animate-punch' : ''}`}
                        style={{ animationDelay: `${index * 0}s` }} 
                      >
                        {letter.char === ' ' ? '\u00A0' : letter.char} 
                      </span>
                    ))}
                  </div>
                )
                /* DEFAULT: Render the glitched/normal title */
                : (
                  <div>
                    {displayedTitle.split('').map((char, index) => (
                      <span key={index} style={{ display: char === ' ' ? 'inline' : 'inline-block' }}>
                        {char === ' ' ? '\u00A0' : char}
                      </span>
                    ))}
                  </div>
                )}
                
                {/* Timer that appears below without shifting content */}
                {isGameDesignerAnimating && gameStartTime && !showWinnerMessage && (
                  <div 
                    className="absolute -bottom-6 left-0 right-0 text-center text-sm md:text-base"
                    style={{ fontVariantNumeric: 'tabular-nums' }}
                  >
                    Time: {currentGameTime.toFixed(1)}s
                  </div>
                )}
              </div>
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto">
            Blending technical expertise with creative vision
          </p>

          <div className="flex flex-wrap gap-4 justify-center mt-8">
            <Button
              size="lg"
              className="bg-pink-600 hover:bg-pink-700 text-white"
              onClick={() => scrollToTabs("games")}
            >
              View My Work
            </Button>
            <Button
              size="lg"
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-medium"
              onClick={() => scrollToTabs("contact")}
            >
              Contact Me
            </Button>
          </div>
        </div>

        <div 
          className="absolute bottom-10 animate-bounce cursor-pointer" 
          onClick={() => scrollToTabs("games")}
        >
          <ArrowDown className="h-10 w-10 text-white/70 hover:text-white transition-colors" />
        </div>
      </section>

      {/* Navigation Tabs */}
      <div ref={tabsRef} className="w-full max-w-6xl mx-auto px-4 mt-8">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full"
          style={{ minWidth: '100%' }}
        >
          <TabsList className="w-full grid grid-cols-5 mb-8">
            <TabsTrigger value="games" className="flex items-center gap-2">
              <Gamepad2 className="h-4 w-4" />
              <span className="hidden sm:inline">Games</span>
            </TabsTrigger>
            <TabsTrigger value="stagedive" className="flex items-center gap-2">
              <Milestone className="h-4 w-4" />
              <span className="hidden sm:inline">StageDive</span>
            </TabsTrigger>
            <TabsTrigger value="music" className="flex items-center gap-2">
              <Music className="h-4 w-4" />
              <span className="hidden sm:inline">Music</span>
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              <span className="hidden sm:inline">Skills</span>
            </TabsTrigger>
            <TabsTrigger value="contact" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Contact</span>
            </TabsTrigger>
          </TabsList>

          <div className="TabsContent-wrapper">
            <TabsContent value="games" className="space-y-8 pb-16">
              <PasswordProtectedGameShowcase />
            </TabsContent>

            <TabsContent value="skills" className="space-y-8 pb-16">
              <SkillsDisplay />
            </TabsContent>

            <TabsContent value="stagedive" className="space-y-8 pb-16">
              <StageDiveShowcase />
            </TabsContent>

            <TabsContent value="music" className="space-y-8 pb-16">
              <MusicSection spotifyPlaylistUrl="https://open.spotify.com/embed/playlist/2pJtpscottccINgiUvWwlY?utm_source=generator" />
            </TabsContent>

            <TabsContent value="contact" className="space-y-8 pb-16">
              <ContactSection />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="w-full bg-black/90 text-white py-8 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Globe className="h-5 w-5 text-pink-500" />
              Michael Straus
            </h3>
            <p className="text-gray-400">
              Blending technical expertise with creative vision
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => scrollToTabs("games")}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Games
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToTabs("skills")}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Skills
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToTabs("stagedive")}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  StageDive
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToTabs("music")}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Music
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToTabs("contact")}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <Link
                href="https://www.linkedin.com/in/michael-straus-17308544/"
                className="text-gray-400 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-linkedin"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect width="4" height="12" x="2" y="9"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </Link>
              <Link
                href="https://github.com/michaelcstraus"
                className="text-gray-400 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-github"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                  <path d="M9 18c-4.51 2-5-2-7-2"></path>
                </svg>
              </Link>
              <Link
                href="https://www.instagram.com/stagedivephilly/"
                className="text-gray-400 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-instagram"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-gray-800 text-center text-gray-500">
          <p>
            © {new Date().getFullYear()} Michael Straus. All rights
            reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
