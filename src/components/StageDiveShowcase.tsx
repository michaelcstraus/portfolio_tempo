"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "./ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Milestone, Rocket, Lightbulb, Target, Users, Code, Search } from "lucide-react";

// Interface for Roadmap items (optional, for more structured data later)
interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "planned";
  icon?: React.ElementType;
}

export default function StageDiveShowcase() {
  // Placeholder data - you'll replace this with actual content
  const origin = {
    title: "The Spark: A Personal Solution",
    description: "StageDivePhilly.com started as a personal tool I made built because I was tired of visiting 15 different websites to find the best live music in Philadelphia. The first iteration was a simple, just a daily output of a csv that I could read.",
    imageUrl: "/images/stagedive/loud_list.png", // Placeholder image
  };

  const evolution = [
    {
      id: "evo1",
      title: "From Script to Structure",
      description: "Realizing its potential, I began structuring it as a proper web application. Key early features included event links and filering by shows added today, built using React and Supabase for the backend.",
      icon: Lightbulb,
    },
    {
      id: "evo2",
      title: "Adding Dynamic Power",
      description: "The next major step was incorporating Auth and adding a save feature so users could save shows they liked. On the backend I started using ML, local LLM's, and AI to filter and classify the events.",
      icon: Code,
    },
    {
      id: "evo3",
      title: "User-Focused Enhancements",
      description: "With a solid foundation, focus shifted to user experience, Designing the React Components from scratch to get the feel I wanted. Adding an expanded search function and refining the UI/UX based on initial feedback.",
      icon: Search,
    },
  ];

  const currentState = {
    title: "StageDivePhilly.com Today",
    description: "Currently, StageDivePhilly.com serves as a tool for music lovers in Philadelphia.",
    imageUrl: "/images/stagedive/stagedive_now.png", // Placeholder - ideally a screenshot
    liveUrl: "https://stagedivephilly.com", // Replace with actual URL
  };

  const futureRoadmap: RoadmapItem[] = [
    {
      id: "future1",
      title: "Short-Term: Enhanced User Interaction",
      description: "Implementing enhanced filtering and tagging capabilities, as well as introducing video previews for select promoted events.",
      status: "planned",
      icon: Users,
    },
    {
      id: "future2",
      title: "Mid-Term: Mobile App & API",
      description: "Developing a native mobile application and a public API, with the integration of predictive elements to enhance user experience. Additionally, expanding the platform to other markets, further increasing its reach and impact.",
      status: "planned",
      icon: Rocket,
    },
    {
      id: "future3",
      title: "Long-Term: Community & Expansion",
      description: "Envisioning a social media-inspired community that bridges the gap between music enthusiasts and artists. This platform will facilitate connections, foster engagement, and provide a space for users to share their experiences, discover new music, and support their favorite artists.",
      status: "planned",
      icon: Target,
    },
  ];

  return (
    <div className="w-full">
      {/* Section Title */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
          The StageDivePhilly.com Journey
        </h2>
        <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
          From a personal script to a full-fledged web application helping music lovers in Philadelphia.
        </p>
      </div>

      {/* Origin Story */}
      <section className="mb-16">
        <Card className="overflow-hidden shadow-lg">
          <div className="md:flex">
            <div className="md:w-1/2">
              <AspectRatio ratio={16 / 9}>
                <img
                  src={origin.imageUrl}
                  alt="Origin of StageDivePhilly"
                  className="w-full h-full object-cover"
                />
              </AspectRatio>
            </div>
            <div className="md:w-1/2 p-6 flex flex-col justify-center">
              <CardHeader className="p-0 mb-4">
                <Lightbulb className="w-10 h-10 text-primary mb-3" />
                <CardTitle className="text-3xl font-semibold">{origin.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-lg text-muted-foreground">{origin.description}</p>
              </CardContent>
            </div>
          </div>
        </Card>
      </section>

      {/* Evolution Section */}
      <section className="mb-16">
        <h3 className="text-3xl font-bold text-center mb-10 flex items-center justify-center">
          <Milestone className="w-8 h-8 mr-3 text-primary" />
          Evolution Highlights
        </h3>
        <div className="grid md:grid-cols-3 gap-8">
          {evolution.map((item) => (
            <Card key={item.id} className="flex flex-col p-6 shadow-md hover:shadow-xl transition-shadow">
              <item.icon className="w-10 h-10 text-primary mb-4" />
              <CardTitle className="text-xl font-semibold mb-2">{item.title}</CardTitle>
              <CardDescription className="text-muted-foreground text-sm flex-grow">{item.description}</CardDescription>
            </Card>
          ))}
        </div>
      </section>

      {/* Current State Section */}
      <section className="mb-16">
         <Card className="overflow-hidden shadow-lg">
          <div className="md:flex flex-row-reverse"> {/* Image on the right */}
            <div className="md:w-1/2">
              <AspectRatio ratio={16 / 9}>
                <img
                  src={currentState.imageUrl}
                  alt="StageDivePhilly.com Current State"
                  className="w-full h-full object-cover"
                />
              </AspectRatio>
            </div>
            <div className="md:w-1/2 p-6 flex flex-col justify-center">
              <CardHeader className="p-0 mb-4">
                 <Rocket className="w-10 h-10 text-primary mb-3" />
                <CardTitle className="text-3xl font-semibold">{currentState.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-0 mb-4">
                <p className="text-lg text-muted-foreground">{currentState.description}</p>
              </CardContent>
              <CardFooter className="p-0">
                <Button asChild size="lg">
                  <a href={currentState.liveUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-5 w-5" /> Visit StageDivePhilly.com
                  </a>
                </Button>
              </CardFooter>
            </div>
          </div>
        </Card>
      </section>

      {/* Future Roadmap Section */}
      <section>
        <h3 className="text-3xl font-bold text-center mb-10 flex items-center justify-center">
          <Target className="w-8 h-8 mr-3 text-primary" />
          The Road Ahead
        </h3>
        <div className="space-y-8">
          {futureRoadmap.map((item) => (
            <Card key={item.id} className="shadow-md hover:shadow-xl transition-shadow">
              <CardHeader className="flex flex-row justify-between items-start">
                <div className="flex items-center">
                  {item.icon && <item.icon className="w-7 h-7 text-primary mr-3" />}
                  <CardTitle className="text-2xl font-semibold">{item.title}</CardTitle>
                </div>
                <Badge 
                  variant={item.status === "completed" ? "default" : item.status === "in-progress" ? "secondary" : "outline"} 
                  className="capitalize whitespace-nowrap"
                >
                  {item.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
} 