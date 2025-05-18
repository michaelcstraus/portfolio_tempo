"use client";

import React, { useState, useEffect } from "react";
import { Progress } from "./ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Gamepad2, Code, Palette, Users, Brain, Film } from "lucide-react";

interface Skill {
  name: string;
  level: number;
  category: string;
}

interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
  skills: string[];
}

interface SkillsDisplayProps {
  skills?: Skill[];
  experiences?: Experience[];
}

const SkillsDisplay = ({
  skills = [
    { name: "Team Leadership", level: 90, category: "soft" },
    { name: "Project Management", level: 85, category: "soft" },
    { name: "Product Management", level: 85, category: "soft" },
    { name: "Innovation Lead", level: 85, category: "soft" },
    { name: "Vendor Management", level: 75, category: "soft" },
    { name: "Client Management", level: 70, category: "soft" },
    { name: "Unity", level: 90, category: "technical" },
    { name: "JavaScript", level: 80, category: "technical" },
    { name: "React", level: 80, category: "technical" },
    { name: "LLM/AI", level: 85, category: "technical" },
    { name: "ThreeJS", level: 75, category: "technical" },
    { name: "Python", level: 80, category: "technical" },
    { name: "NodeJS", level: 75, category: "technical" },
    { name: "C#", level: 80, category: "technical" },
    { name: "FMOD", level: 65, category: "technical" },
    { name: "HowlerJS", level: 65, category: "technical" },
    { name: "UI/UX", level: 80, category: "creative" },
    { name: "Art Directing", level: 85, category: "creative" },
    { name: "Teaching/Mentorship", level: 85, category: "soft" },
    { name: "Music Composition", level: 90, category: "creative" },
    { name: "Sound Design", level: 85, category: "creative" },
    { name: "Music Directing", level: 90, category: "creative" },
    { name: "Storyboarding", level: 90, category: "creative" },
  ],
  experiences = [
    {
      title: "Director of Casino Product",
      company: "Boom Entertainment",
      period: "2022-2025",
      description:
        "Led a team of 5 designers to create award-winning mobile games with over 1M downloads. Responsible for game mechanics, level design, and player experience optimization.",
      skills: ["Game Design", "Team Leadership", "Product Strategy", "Vendor Management"],
    },
    {
      title: "Innovation Director",
      company: "Boom Entertainment",
      period: "2021 - 2022",
      description:
        "Designed game mechanics and levels for 3 AAA console titles. Collaborated with artists and developers to implement engaging player experiences.",
      skills: [
        "Game Design",
        "UI/UX",
        "JavaScript",
        "Collaboration",
      ],
    },
    {
      title: "Adjunct Professor: Sound Design for Games",
      company: "Johns Hopkins University (Peabody Institute)",
      period: "2021 - 2022",
      description:
        "Developed gameplay features and fixed bugs for mobile and web-based games using Unity and JavaScript.",
      skills: ["FMOD", "Unity", "Syllabus Development", "Teaching"],
    },
    {
      title: "Innovation Lead",
      company: "High 5 Games",
      period: "2018 - 2021",
      description:
        "Developed gameplay features and fixed bugs for mobile and web-based games using Unity and JavaScript.",
      skills: ["Unity", "C#", "Bug Fixing", "Audio Programming", "Design", "Team Leadership"],
    },
    {
      title: "Technical Sound Designer",
      company: "High 5 Games",
      period: "2013 - 2018",
      description:
        "Developed gameplay features and fixed bugs for mobile and web-based games using Unity and JavaScript.",
      skills: ["Unity", "C#", "Recording" , "Studio Design", "Audio Programming"],
    },
  ],
}: SkillsDisplayProps) => {
  const [animatedSkills, setAnimatedSkills] = useState<Skill[]>([]);

  // Categories with their icons
  const categories = [
    { id: "all", name: "All Skills", icon: <Brain className="h-4 w-4" /> },
    {
      id: "technical",
      name: "Technical",
      icon: <Code className="h-4 w-4" />,
    },
    { id: "creative", name: "Creative", icon: <Palette className="h-4 w-4" /> },
    { id: "soft", name: "Soft Skills", icon: <Users className="h-4 w-4" /> },
  ];

  // Animate skills on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedSkills(skills);
    }, 500);

    return () => clearTimeout(timer);
  }, [skills]);

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
          Technical Skills, Design Expertise & Professional Experience
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          My expertise spans game design, audio programming, and development, with a focus on innovation and creating engaging player experiences.
        </p>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <div className="flex justify-center mb-8">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="flex items-center gap-2"
              >
                {category.icon}
                <span className="hidden md:inline">{category.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {categories.map((category) => (
          <TabsContent
            key={category.id}
            value={category.id}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {animatedSkills
                .filter(
                  (skill) =>
                    category.id === "all" || skill.category === category.id,
                )
                .map((skill, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{skill.name}</h3>
                      <span className="text-sm text-muted-foreground">
                        {skill.level}%
                      </span>
                    </div>
                    <Progress
                      value={skill.level}
                      className="h-2 bg-muted transition-all duration-1000 ease-in-out"
                    />
                  </div>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-20">
        <h3 className="text-2xl font-bold mb-8 text-center">
          Professional Experience
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {experiences.map((exp, index) => (
            <Card
              key={index}
              className="bg-card hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader>
                <CardTitle className="flex flex-col">
                  <span className="text-xl">{exp.title}</span>
                  <span className="text-sm text-muted-foreground mt-1">
                    {exp.company} | {exp.period}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm">{exp.description}</p>
                <div className="flex flex-wrap gap-2">
                  {exp.skills.map((skill, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="bg-secondary/50"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsDisplay;
