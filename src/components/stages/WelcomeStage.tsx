
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, MessageSquare, Settings, FileText, Play } from "lucide-react";

interface WelcomeStageProps {
  onStartNewProject: () => void;
  // onChatWithAI: () => void; // Assuming this is part of new project for now
  // onViewConfig: () => void; // Handled by AppShell
  // onViewDocs: () => void; // Handled by AppShell
}

export default function WelcomeStage({ onStartNewProject }: WelcomeStageProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Zap className="w-16 h-16 text-primary" />
        </div>
        <CardTitle className="text-3xl font-headline">Welcome to Webcraft AI Terminal</CardTitle>
        <CardDescription className="text-lg text-muted-foreground">
          Let's build your next website with the power of AI.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6 p-8">
        <p className="text-center text-foreground">
          Get started by describing your project, and our AI assistants will guide you through the process from idea to a deployed (local) preview.
        </p>
        <Button 
          onClick={onStartNewProject} 
          className="w-full max-w-xs bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6 rounded-lg shadow-md transition-transform hover:scale-105"
        >
          <Play className="mr-2 h-5 w-5" /> Start New Project
        </Button>
        <div className="text-sm text-muted-foreground pt-4">
          You can access Configuration and Project Documentation using the buttons in the header.
        </div>
      </CardContent>
    </Card>
  );
}
