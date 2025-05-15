"use client";

import React, { useState } from "react";
import GameShowcase from "./GameShowcase";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Lock, Unlock, Gamepad2 } from "lucide-react";

interface PasswordProtectedGameShowcaseProps {
  password?: string;
}

export default function PasswordProtectedGameShowcase({
  password = "gamepass123", // Default password for the games section
}: PasswordProtectedGameShowcaseProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputPassword, setInputPassword] = useState("");
  const [error, setError] = useState("");

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

  return (
    <div className="w-full bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            Game Design Portfolio
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            View my interactive game designs and playable projects.
          </p>
        </div>

        {!isAuthenticated ? (
          <div className="max-w-md mx-auto">
            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-center mb-6">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <Gamepad2 className="h-10 w-10 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-center mb-4">
                  Game Portfolio Access
                </h3>
                <p className="text-muted-foreground text-center mb-6">
                  This content is password protected. Please enter the password to access my game design portfolio.
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
                      <Unlock className="mr-2 h-4 w-4" /> Unlock Game Portfolio
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div>
            <div className="flex justify-end mb-6">
              <Button variant="outline" onClick={handleLogout}>
                <Lock className="mr-2 h-4 w-4" /> Lock Portfolio
              </Button>
            </div>
            <GameShowcase />
          </div>
        )}
      </div>
    </div>
  );
} 