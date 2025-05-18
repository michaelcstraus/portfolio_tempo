"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  AlertCircle,
  CheckCircle,
  Github,
  Instagram,
  Linkedin,
  Mail,
  Send,
  Twitter,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

interface ContactSectionProps {
  email?: string;
  phone?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    instagram?: string;
  };
}

const ContactSection = ({
  email = "gamedesigner@example.com",
  phone = "+1 (555) 123-4567",
  socialLinks = {
    twitter: "https://twitter.com/gamedesigner",
    linkedin: "https://www.linkedin.com/in/michael-straus-17308544/",
    github: "https://github.com/michaelcstraus",
    instagram: "https://www.instagram.com/stagedivephilly/",
  },
}: ContactSectionProps) => {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    purpose: "",
    message: "",
  });

  const [formStatus, setFormStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });

    // Clear error when field is edited
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  };

  const handleSelectChange = (value: string) => {
    setFormState({
      ...formState,
      purpose: value,
    });

    // Clear error when field is edited
    if (errors.purpose) {
      setErrors({
        ...errors,
        purpose: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formState.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formState.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formState.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formState.purpose) {
      newErrors.purpose = "Please select a purpose";
    }

    if (!formState.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setFormStatus("submitting");

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      });

      const data = await response.json();

      if (response.ok) {
        setFormStatus("success");
        
        // Reset form after successful submission
        setFormState({
          name: "",
          email: "",
          purpose: "",
          message: "",
        });

        // Reset form status after a delay
        setTimeout(() => {
          setFormStatus("idle");
        }, 5000);
      } else {
        console.error('Form submission error:', data.error);
        setFormStatus("error");
        
        // Reset form status after a delay
        setTimeout(() => {
          setFormStatus("idle");
        }, 5000);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setFormStatus("error");
      
      // Reset form status after a delay
      setTimeout(() => {
        setFormStatus("idle");
      }, 5000);
    }
  };

  return (
    <section className="w-full">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            Get In Touch
          </h2>
          <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Have a project in mind or want to discuss a collaboration? I'd
            love to hear from you!
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2">
        {/* Contact Form */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Send a Message</CardTitle>
            <CardDescription>
              Fill out the form below and I'll get back to you as soon as
              possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Your name"
                  value={formState.name}
                  onChange={handleChange}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Your email address"
                  value={formState.email}
                  onChange={handleChange}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose</Label>
                <Select
                  value={formState.purpose}
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger
                    className={errors.purpose ? "border-destructive" : ""}
                  >
                    <SelectValue placeholder="Select a purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="job">Job Opportunity</SelectItem>
                    <SelectItem value="project">
                      Project Collaboration
                    </SelectItem>
                    <SelectItem value="feedback">Feedback</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.purpose && (
                  <p className="text-sm text-destructive">{errors.purpose}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Your message"
                  rows={5}
                  value={formState.message}
                  onChange={handleChange}
                  className={errors.message ? "border-destructive" : ""}
                />
                {errors.message && (
                  <p className="text-sm text-destructive">{errors.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={formStatus === "submitting"}
              >
                {formStatus === "submitting" ? (
                  <>
                    <span className="mr-2 animate-spin">⏳</span>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
            </form>

            {formStatus === "success" && (
              <Alert className="mt-4 bg-green-50 border-green-500">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertTitle>Success!</AlertTitle>
                <AlertDescription>
                  Your message has been sent successfully. I'll get back to
                  you soon.
                </AlertDescription>
              </Alert>
            )}

            {formStatus === "error" && (
              <Alert className="mt-4 bg-red-50 border-destructive">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  There was a problem sending your message. Please try again
                  later.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Contact Information */}
        <div className="flex flex-col space-y-8">
          {/* <Card className="w-full">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Feel free to reach out through any of these channels.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary" />
                <span>{email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span>{phone}</span>
              </div>
            </CardContent>
          </Card> */}

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Social Media</CardTitle>
              <CardDescription>
                Connect with me on social platforms.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {/* {socialLinks.twitter && (
                  <a
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 rounded-md bg-muted p-3 hover:bg-muted/80 transition-colors"
                  >
                    <Twitter className="h-5 w-5" />
                    <span className="sr-only">Twitter</span>
                  </a>
                )} */}

                {socialLinks.linkedin && (
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 rounded-md bg-muted p-3 hover:bg-muted/80 transition-colors"
                  >
                    <Linkedin className="h-5 w-5" />
                    <span className="sr-only">LinkedIn</span>
                  </a>
                )}

                {socialLinks.github && (
                  <a
                    href={socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 rounded-md bg-muted p-3 hover:bg-muted/80 transition-colors"
                  >
                    <Github className="h-5 w-5" />
                    <span className="sr-only">GitHub</span>
                  </a>
                )}

                {socialLinks.instagram && (
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 rounded-md bg-muted p-3 hover:bg-muted/80 transition-colors"
                  >
                    <Instagram className="h-5 w-5" />
                    <span className="sr-only">Instagram</span>
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
