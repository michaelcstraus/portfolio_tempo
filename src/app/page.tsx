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

const AUDIO_PROGRAMMER_TITLE = "Audio Programmer";
const CREATIVE_LEAD_TITLE = "Creative Lead";
const GAME_DESIGNER_TITLE = "Game Designer";

const PROFESSIONAL_TITLES = [
  "Product Director",
  GAME_DESIGNER_TITLE,
  AUDIO_PROGRAMMER_TITLE,
  CREATIVE_LEAD_TITLE,
  "Sound Director",
];

const CHAOTIC_COLORS = ['#FF1493', '#FF8C00', '#ADFF2F', '#00BFFF', '#BA55D3', '#FFD700'];
const HARMONIOUS_PALETTE_CL = ['#ec4899', '#22d3ee', '#a855f7', '#ffffff']; // Pink, Cyan, Purple, White

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
  const popSoundRef = useRef<HTMLAudioElement | null>(null); // Sound for letter pop
  const gameWonRef = useRef(false); // <-- ADDED

  // New state for game timer and winner message
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const [gameEndTime, setGameEndTime] = useState<number | null>(null);
  const [showWinnerMessage, setShowWinnerMessage] = useState(false);

  // New state and ref for live game timer
  const [currentGameTime, setCurrentGameTime] = useState(0);
  const liveGameTimerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Add a state to track if we're paused on the Game Designer title
  const [gameDesignerPaused, setGameDesignerPaused] = useState(false);

  // --- Start of Glitch Text Effect Code ---
  const glitchEffectIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const nextTitleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Audio refs
  const glitchSoundRef = useRef<HTMLAudioElement | null>(null);
  const settleSoundRef = useRef<HTMLAudioElement | null>(null);
  const isGlitchSoundPlayingRef = useRef(false);

  const GLOW_CLASSES = [
    'text-glow-style-1',
    'text-glow-style-2',
    'text-glow-style-3',
    'text-glow-style-4',
    'text-glow-style-5',
  ];

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
  };

  const cleanUpTimers = () => {
    if (glitchEffectIntervalRef.current) clearInterval(glitchEffectIntervalRef.current);
    if (nextTitleTimeoutRef.current) clearTimeout(nextTitleTimeoutRef.current);
    glitchEffectIntervalRef.current = null;
    nextTitleTimeoutRef.current = null;

    if (glitchSoundRef.current && isGlitchSoundPlayingRef.current) {
      glitchSoundRef.current.pause();
      glitchSoundRef.current.currentTime = 0;
      isGlitchSoundPlayingRef.current = false;
    }
    clearLetterAnimationTimeouts();
    clearCreativeLeadAnimationTimeouts();
    clearGameDesignerTimers();
  };

  const endGameDesignerGame = (gameWon: boolean = false) => {
    setIsGameDesignerAnimating(false);
    if (liveGameTimerIntervalRef.current) clearInterval(liveGameTimerIntervalRef.current); // Stop live timer
    liveGameTimerIntervalRef.current = null;
    
    // Ensure the game's own round timer is stopped
    if (gameRoundTimerRef.current) clearTimeout(gameRoundTimerRef.current);
    gameRoundTimerRef.current = null;

    // setCurrentGameTime(0); // Reset live display, or let winner message show final from gameEndTime

    if (gameWon) {
      setShowWinnerMessage(true);
      nextTitleTimeoutRef.current = setTimeout(() => {
        setShowWinnerMessage(false); 
        setGameStartTime(null); setGameEndTime(null); setCurrentGameTime(0); // Reset all game times
        startGlitchSequence();
      }, 2500); 
    } else {
      setShowWinnerMessage(false);
      setGameStartTime(null); setGameEndTime(null); setCurrentGameTime(0); // Reset all game times
      nextTitleTimeoutRef.current = setTimeout(startGlitchSequence, 800 + Math.random() * 500); 
    }
  };

  const startGameDesignerRound = () => {
    if (gameRoundTimerRef.current) clearTimeout(gameRoundTimerRef.current);
    setGameDesignerLetters(prevLetters => {
      const activeLetters = prevLetters.filter(l => l.status !== 'popped');
      if (activeLetters.length === 0) {
        if (gameStartTime && !gameEndTime) { // Ensure gameEndTime is set if somehow missed
          setGameEndTime(Date.now());
          gameWonRef.current = true; // Signal win to useEffect
        }
        // endGameDesignerGame(true) will be called by useEffect if gameEndTime is set
        return []; 
      }
      
      // Reset all letters to neutral first
      let newLetters = prevLetters.map(l => l.status === 'good' ? { ...l, status: 'neutral' as GameLetterStatus } : l );
      
      // Ensure at least 1 letter is highlighted
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
    
    // Schedule next round with a variable delay
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

  // Update the handleLetterClick function to only start the game when clicking a lit letter
  const handleLetterClick = (letterId: string) => {
    // Get the letter being clicked
    const clickedLetter = gameDesignerLetters.find(l => l.id === letterId);
    
    // If we're in paused state and the clicked letter is 'good' (lit), start the game
    if (gameDesignerPaused && displayedTitle === GAME_DESIGNER_TITLE && clickedLetter?.status === 'good') {
      // Clear any auto-advance timer
      if (gameDesignerAutoAdvanceRef.current) {
        clearTimeout(gameDesignerAutoAdvanceRef.current);
        gameDesignerAutoAdvanceRef.current = null;
      }
      
      // Start the game
      setGameDesignerPaused(false);
      
      // Start the timer
      setGameStartTime(Date.now());
      setCurrentGameTime(0);
      
      if (liveGameTimerIntervalRef.current) clearInterval(liveGameTimerIntervalRef.current);
      liveGameTimerIntervalRef.current = setInterval(() => {
        setGameStartTime(prevStartTime => {
          if (prevStartTime) {
            setCurrentGameTime((Date.now() - prevStartTime) / 1000);
          }
          return prevStartTime;
        });
      }, 100);
      
      // Play pop sound and mark the clicked letter as popped
      if (popSoundRef.current) {
        popSoundRef.current.currentTime = 0;
        popSoundRef.current.play().catch(e => console.error("Pop sound error", e));
      }
      
      // Pop the clicked letter
      setGameDesignerLetters(prevLetters => {
        return prevLetters.map(l => {
          if (l.id === letterId && l.status === 'good') {
            return { ...l, status: 'popped' as GameLetterStatus };
          }
          return l;
        });
      });
      
      // Schedule rounds to start after a short delay
      setTimeout(() => {
        startGameDesignerRound();
      }, 800);
      
      return;
    }
    
    // For ongoing gameplay (not the first click)
    // Only process clicks during active gameplay
    if (!gameDesignerPaused && displayedTitle === GAME_DESIGNER_TITLE) {
      const letterBeforeClick = gameDesignerLetters.find(l => l.id === letterId);
      
      // Check if the letter is a valid target
      if (letterBeforeClick && letterBeforeClick.status === 'good') {
        // Play pop sound and mark letter as popped
        if (popSoundRef.current) {
          popSoundRef.current.currentTime = 0;
          popSoundRef.current.play().catch(e => console.error("Pop sound error", e));
        }
        
        setGameDesignerLetters(prevLetters => {
          const newLetters = prevLetters.map(l => {
            if (l.id === letterId && l.status === 'good') {
              return { ...l, status: 'popped' as GameLetterStatus };
            }
            return l;
          });
          
          const totalGameLetters = newLetters.filter(l => l.char !== ' ').length;
          const poppedGameLetters = newLetters.filter(l => l.status === 'popped' && l.char !== ' ').length;
          
          if (poppedGameLetters === totalGameLetters && totalGameLetters > 0) {
            if (!gameEndTime) {
              setGameEndTime(Date.now());
              gameWonRef.current = true;
              
              // Clear any auto-advance timer when the game is won
              if (gameDesignerAutoAdvanceRef.current) {
                clearTimeout(gameDesignerAutoAdvanceRef.current);
                gameDesignerAutoAdvanceRef.current = null;
              }
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
        if (glitchSoundRef.current && !isGlitchSoundPlayingRef.current) {
          if (glitchSoundRef.current.duration && Number.isFinite(glitchSoundRef.current.duration)) {
            try { const randomStartTime = Math.random() * glitchSoundRef.current.duration; glitchSoundRef.current.currentTime = randomStartTime; } catch (error) { console.error("Error setting random currentTime for glitch sound:", error); if (glitchSoundRef.current) glitchSoundRef.current.currentTime = 0; }
          } else { if (glitchSoundRef.current) glitchSoundRef.current.currentTime = 0; }
          glitchSoundRef.current.play().catch(error => console.error("Error playing glitch sound:", error));
          isGlitchSoundPlayingRef.current = true;
        }
        setDisplayedTitle(generateGlitchedText(targetTitle));
        iterations++;
      } else {
        if (glitchEffectIntervalRef.current) clearInterval(glitchEffectIntervalRef.current);
        glitchEffectIntervalRef.current = null;
        
        if (glitchSoundRef.current && isGlitchSoundPlayingRef.current) {
          glitchSoundRef.current.pause();
          glitchSoundRef.current.currentTime = 0;
          isGlitchSoundPlayingRef.current = false;
        }
        // Play settle sound only if NOT transitioning to Game Designer
        if (settleSoundRef.current && targetTitle !== GAME_DESIGNER_TITLE) {
          settleSoundRef.current.play().catch(error => console.error("Error playing settle sound:", error));
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
        // setGameDesignerPaused(false); // This will be set to true specifically for Game Designer if it's the target

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
          // No nextTitleTimeoutRef for Game Designer to pause here; auto-advance useEffect will handle it.
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
      startGlitchSequence();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayedTitle, gameDesignerPaused]); // startGlitchSequence is omitted as it's not memoized; logic relies on other deps.

  const handleMouseEnter = () => {
    startGlitchSequence();
  };

  const handleMouseLeave = () => {
    // If the Game Designer game was won and the winner message is currently showing,
    // we want to preserve its display and the timeout that will transition away from it.
    // We should only clear other incidental animation timers.
    if (PROFESSIONAL_TITLES[activeTitleIndexRef.current] === GAME_DESIGNER_TITLE && showWinnerMessage) {
      if (glitchEffectIntervalRef.current) {
        clearInterval(glitchEffectIntervalRef.current);
        glitchEffectIntervalRef.current = null;
      }
      clearLetterAnimationTimeouts(); // Stop any Audio Programmer letter punches
      clearCreativeLeadAnimationTimeouts(); // Stop any Creative Lead color cycling
      
      // DO NOT call cleanUpTimers() here as it would clear nextTitleTimeoutRef.
      // DO NOT reset displayedTitle or other Game Designer specific states here.
      return; // Exit early to let the winner sequence complete.
    }

    // Standard cleanup for all other scenarios:
    // - Mouse leave during a normal title display (not Game Designer win).
    // - Mouse leave during an unfinished/abandoned Game Designer game.
    // - Mouse leave during other animated titles.
    cleanUpTimers(); // This will clear nextTitleTimeoutRef, glitchEffectIntervalRef, and all game/animation timers.

    const lastSettledTitle = PROFESSIONAL_TITLES[activeTitleIndexRef.current];
    setDisplayedTitle(lastSettledTitle); // Revert to the actual settled title
    setIsGlowing(false);
    setCurrentGlowClass('');
    setIsLetterAnimating(false);
    setIsCreativeLeadAnimating(false);
    // isGameDesignerAnimating will be set based on whether lastSettledTitle is GAME_DESIGNER_TITLE below.

    // Reset animation states for specific titles if they were the ones settled on
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
          finalColorForLetter = HARMONIOUS_PALETTE_CL[0]; // Pink
        } else if (char === ' ') {
          finalColorForLetter = 'transparent';
        } else {
          finalColorForLetter = HARMONIOUS_PALETTE_CL[1]; // Cyan
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
      // This case means the mouse left when Game Designer was the settled title,
      // but NOT during a winner message display (due to the early return above).
      // So, game was paused or abandoned mid-play.
      setIsGameDesignerAnimating(true); // Keep interactive styling for Game Designer title
      setGameDesignerPaused(true);    // Revert to paused state, ready for next interaction or auto-advance
      setGameDesignerLetters(
        GAME_DESIGNER_TITLE.split('').map((char, idx) => ({
          char, id: `${char}-${idx}`, status: 'neutral' as GameLetterStatus, key: `${char}-${idx}-${Date.now()}`
        }))
      ); // Reset letters
      gameWonRef.current = false; // Ensure win flag is false
      setShowWinnerMessage(false); // Ensure winner message is hidden
      // Reset game times as the game was abandoned or not completed
      setGameStartTime(null);
      setGameEndTime(null);
      setCurrentGameTime(0);
    } else {
      // Settling on a title that is NOT Game Designer.
      // Ensure all Game Designer specific states are fully reset.
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

  useEffect(() => {
    glitchSoundRef.current = new Audio('/sounds/glitch_loop.wav'); 
    if (glitchSoundRef.current) {
      glitchSoundRef.current.loop = true;
    }
    settleSoundRef.current = new Audio('/sounds/land.wav');
    popSoundRef.current = new Audio('/sounds/pop.wav');

    return () => {
      cleanUpTimers();
      if (glitchSoundRef.current) {
        glitchSoundRef.current.pause();
        if (glitchSoundRef.current) {
          glitchSoundRef.current.srcObject = null; 
          glitchSoundRef.current.src = '';
        }
      }
      if (settleSoundRef.current) {
        settleSoundRef.current.pause();
        if (settleSoundRef.current) {
          settleSoundRef.current.srcObject = null;
          settleSoundRef.current.src = '';
        }
      }
      if (popSoundRef.current) {
        popSoundRef.current.pause();
        if (popSoundRef.current) {
          popSoundRef.current.srcObject = null;
          popSoundRef.current.src = '';
        }
      }
    };
  }, []);

  const scrollToTabs = (tabValue: string) => {
    setActiveTab(tabValue);
    
    if (tabsRef.current) {
      setTimeout(() => {
        tabsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  // Add the letter highlighting effect back
  useEffect(() => {
    // Highlight a random letter when Game Designer title first appears
    if (displayedTitle === GAME_DESIGNER_TITLE && gameDesignerPaused) {
      setGameDesignerLetters(prevLetters => {
        // Only modify if no letter is already highlighted (prevent re-runs)
        if (!prevLetters.some(l => l.status === 'good')) {
          // Choose a random letter to highlight first
          const nonSpaceLetters = prevLetters.filter(l => l.char !== ' ');
          if (nonSpaceLetters.length === 0) return prevLetters; // Safety check
          
          const randomLetter = nonSpaceLetters[Math.floor(Math.random() * nonSpaceLetters.length)];
          
          return prevLetters.map(l => {
            if (l.id === randomLetter.id) {
              return { ...l, status: 'good' as GameLetterStatus };
            }
            return { ...l, status: 'neutral' as GameLetterStatus };
          });
        }
        return prevLetters;
      });
    }
  }, [displayedTitle, gameDesignerPaused, gameDesignerLetters]);

  return (
    <main className="flex min-h-screen flex-col items-center bg-background">
      {/* Hero Section */}
      <section className="w-full min-h-screen flex flex-col items-center justify-center relative bg-gradient-to-br from-purple-900 via-violet-800 to-indigo-900 text-white p-4 md:p-8">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80')] opacity-40 bg-cover bg-center mix-blend-overlay"></div>

        <div className="max-w-5xl mx-auto text-center z-10 space-y-6">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight animate-fade-in">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-cyan-400">
              Michael Straus
            </span>
            <br />
            <span 
              className={`text-white ${isGlowing && !isLetterAnimating && !isCreativeLeadAnimating && !isGameDesignerAnimating && !showWinnerMessage ? currentGlowClass : ''}`}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
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
{/* >>>>>>> main */}
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
      <div ref={tabsRef}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-6xl mx-auto mt-8 px-4">
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
