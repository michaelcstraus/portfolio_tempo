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
        "Led end-to-end development on multiple high-impact casino games from concept to launch. Oversaw cross-functional teams including game design, math, art, engineering, and audio. Spearheaded innovation pipelines, rapid prototyping, and market-driven feature development. Collaborated with partners and internal stakeholders to ensure timely delivery, regulatory compliance, and performance optimization. Known for turning creative concepts into successful, data-informed products that drive revenue and engagement.",
      skills: ["Game Design", "Team Leadership", "Product Strategy", "Vendor Management"],
    },
    {
      title: "Innovation Director",
      company: "Boom Entertainment",
      period: "2021 - 2022",
      description:
        "Drove the creative vision and early development of new game concepts within Boom’s in-house studio. Led a small, agile innovation team focused on rapid prototyping, feature experimentation, and long-term engagement mechanics. Collaborated closely with math, engineering, and product teams to test ideas, build playable demos, and validate concepts with data. Helped define the future roadmap by translating vague ideas into scalable, player-centric experiences.",
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
        "Developed curriculum and taught a Sound Design for Game Audio covering creative and technical aspects of game production.",
      skills: ["FMOD", "Unity", "Syllabus Development", "Teaching"],
    },
    {
      title: "Innovation Lead",
      company: "High 5 Games",
      period: "2018 - 2021",
      description:
        "Founding Member of the Game Innovation Team, leading rapid prototyping in Unity to develop and iterate on product concepts. Designed and developed 25+ unique state-of-the-art games.",
      skills: ["Unity", "C#", "Bug Fixing", "Audio Programming", "Design", "Team Leadership"],
    },
    {
      title: "Technical Sound Designer",
      company: "High 5 Games",
      period: "2013 - 2018",
      description:
        "Oversaw the sound team and audio delivery across over 100 slot game titles. Designed, built, and maintained sound facilities at three locations, including 1 World Trade Center.",
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
