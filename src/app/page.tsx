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

export default function Home() {
  const [activeTab, setActiveTab] = useState("games");
  const tabsRef = useRef<HTMLDivElement>(null);

  // --- Start of Glitch Text Effect Code ---
  const professionalTitles = [
    "Game Director / Designer",
    "Audio Programmer",
    "Innovation Lead",
    "Creative Technologist",
    "Technical Sound Designer",
  ];

  const [displayedTitle, setDisplayedTitle] = useState(professionalTitles[0]);
  const activeTitleIndexRef = useRef(0);
  const glitchEffectIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const nextTitleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const generateGlitchedText = (text: string, intensity: number = 0.7) => {
    const chars = "!<>-_\\\\/[]{}—=+*^?#"; // Escaped backslash for regex and string literal
    return text
      .split("")
      .map(char => (char !== ' ' && Math.random() > (1 - intensity) ? chars[Math.floor(Math.random() * chars.length)] : char))
      .join("");
  };

  const cleanUpTimers = () => {
    if (glitchEffectIntervalRef.current) clearInterval(glitchEffectIntervalRef.current);
    if (nextTitleTimeoutRef.current) clearTimeout(nextTitleTimeoutRef.current);
    glitchEffectIntervalRef.current = null;
    nextTitleTimeoutRef.current = null;
  };

  const startGlitchSequence = () => {
    cleanUpTimers(); // Clear any existing timers before starting a new sequence

    // Determine the next title index based on the last settled title
    const nextIndex = (activeTitleIndexRef.current + 1) % professionalTitles.length;
    const targetTitle = professionalTitles[nextIndex];
    
    let iterations = 0;
    const maxIterations = 5 + Math.floor(Math.random() * 5); 
    const glitchDuration = 50; 

    glitchEffectIntervalRef.current = setInterval(() => {
      if (iterations < maxIterations) {
        setDisplayedTitle(generateGlitchedText(targetTitle));
        iterations++;
      } else {
        if (glitchEffectIntervalRef.current) clearInterval(glitchEffectIntervalRef.current);
        glitchEffectIntervalRef.current = null;
        
        setDisplayedTitle(targetTitle); 
        activeTitleIndexRef.current = nextIndex; // Update the settled title index
        
        // Schedule the next glitch in the sequence
        nextTitleTimeoutRef.current = setTimeout(startGlitchSequence, 1500 + Math.random() * 1000); 
      }
    }, glitchDuration);
  };

  const handleMouseEnter = () => {
    // Sequence always starts/resumes by trying to glitch to the *next* title
    // after the one currently stored in activeTitleIndexRef.
    startGlitchSequence();
  };

  const handleMouseLeave = () => {
    cleanUpTimers();
    // Ensure the displayed title is the last one that was cleanly settled.
    // This handles cases where mouse leaves mid-glitch.
    setDisplayedTitle(professionalTitles[activeTitleIndexRef.current]);
  };

  useEffect(() => {
    // Cleanup function to be called when the component unmounts
    return () => {
      cleanUpTimers();
    };
  }, []); // Empty dependency array ensures this runs only on mount and unmount
  // --- End of Glitch Text Effect Code ---

  const scrollToTabs = (tabValue: string) => {
    setActiveTab(tabValue);
    
    if (tabsRef.current) {
      // Add a small delay to ensure the DOM has updated
      setTimeout(() => {
        tabsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

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
              className="text-white"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{ display: 'inline-block', cursor: 'default' }} 
            >
              {displayedTitle}
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto">
            Crafting immersive experiences through innovative design,
            and engaging mechanics. 
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
              Game Designer Portfolio
            </h3>
            <p className="text-gray-400">
              Creating memorable gaming experiences through innovative design
              and storytelling.
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
            © {new Date().getFullYear()} Game Designer Portfolio. All rights
            reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
