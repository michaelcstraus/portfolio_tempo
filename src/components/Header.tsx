"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CalendarDays, Home, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full bg-background border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="font-bold text-lg">
          Event Platform
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          <Link 
            href="/" 
            className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent"
          >
            <Home className="mr-2 h-4 w-4" />
            Home
          </Link>
          <Link 
            href="/events" 
            className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent"
          >
            <CalendarDays className="mr-2 h-4 w-4" />
            Events
          </Link>
        </nav>

        {/* Mobile Navigation Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <nav className="container mx-auto px-4 py-3 flex flex-col space-y-2 bg-background">
            <Link 
              href="/" 
              className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent"
              onClick={() => setIsMenuOpen(false)}
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </Link>
            <Link 
              href="/events" 
              className="flex items-center px-3 py-2 text-sm rounded-md hover:bg-accent"
              onClick={() => setIsMenuOpen(false)}
            >
              <CalendarDays className="mr-2 h-4 w-4" />
              Events
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
} 