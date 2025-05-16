"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "./ui/aspect-ratio";
import { ExternalLink } from "lucide-react";

interface WebProject {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  demoUrl: string;
  repoUrl?: string;
}

interface WebDesignProps {
  projects?: WebProject[];
}

export default function WebDesign({
  projects = [
    {
      id: "project1",
      title: "E-Commerce Platform",
      description: "A responsive e-commerce platform with cart functionality, user authentication, and payment processing.",
      technologies: ["React", "Next.js", "Tailwind CSS", "Stripe"],
      imageUrl: "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=800&q=80",
      demoUrl: "#",
      repoUrl: "#",
    },
    {
      id: "project2",
      title: "Portfolio Website",
      description: "A personal portfolio website showcasing projects and skills with a modern, minimalist design.",
      technologies: ["HTML", "CSS", "JavaScript", "GSAP"],
      imageUrl: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&q=80",
      demoUrl: "#",
    },
    {
      id: "project3",
      title: "Weather Dashboard",
      description: "A real-time weather application using weather API with location search and forecast visualization.",
      technologies: ["React", "Chart.js", "OpenWeather API"],
      imageUrl: "https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&q=80",
      demoUrl: "#",
      repoUrl: "#",
    },
    {
      id: "project4",
      title: "Corporate Website",
      description: "A modern corporate website for a financial services company with content management system.",
      technologies: ["WordPress", "PHP", "jQuery", "SCSS"],
      imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80",
      demoUrl: "#",
    },
    {
      id: "project5",
      title: "Restaurant Booking System",
      description: "An online reservation system for restaurants with table management and customer notifications.",
      technologies: ["Vue.js", "Node.js", "Express", "MongoDB"],
      imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
      demoUrl: "#",
      repoUrl: "#",
    },
    {
      id: "project6",
      title: "Social Media Dashboard",
      description: "An analytics dashboard for social media performance with data visualization and reporting.",
      technologies: ["React", "Redux", "D3.js", "Firebase"],
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      demoUrl: "#",
      repoUrl: "#",
    },
  ],
}: WebDesignProps) {
  return (
    <div className="w-full bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            Web Design Projects
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            My web development portfolio showcasing responsive, interactive, and user-friendly websites and applications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-lg">
              <div className="overflow-hidden">
                <AspectRatio ratio={16 / 9}>
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </AspectRatio>
              </div>
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button asChild variant="default">
                  <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
                  </a>
                </Button>
                {project.repoUrl && (
                  <Button asChild variant="outline">
                    <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                      Code
                    </a>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 