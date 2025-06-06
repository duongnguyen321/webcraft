
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, FolderOpen, Sparkles, RotateCcw } from "lucide-react";
import Link from "next/link";

interface CompletedStageProps {
  sourceCodePath: string;
  onStartNew: () => void;
}

export default function CompletedStage({ sourceCodePath, onStartNew }: CompletedStageProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto text-center shadow-xl">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <Sparkles className="w-16 h-16 text-accent" />
        </div>
        <CardTitle className="text-3xl font-headline">Project Completed!</CardTitle>
        <CardDescription className="text-muted-foreground">
          Congratulations! Your website project has been successfully generated.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-8">
        <div className="p-4 border rounded-md bg-muted/20">
          <p className="text-sm text-muted-foreground">Simulated Source Code Path:</p>
          <p className="text-lg font-semibold text-primary font-code">{sourceCodePath}</p>
          <p className="text-xs text-muted-foreground mt-1">(In a real application, this would be an actual file path on your system.)</p>
        </div>
        <p className="text-foreground">
          All project documentation, including chat history, PRD, and task breakdowns, has been saved. You can access it via the "Docs" button in the header.
        </p>
        <div className="flex items-center justify-center p-3 rounded-md bg-green-50 border border-green-200">
            <CheckCircle2 className="w-6 h-6 text-green-600 mr-3" />
            <p className="text-green-700 font-medium">
                The local development server (simulated) has been stopped.
            </p>
        </div>
      </CardContent>
      <CardFooter className="p-6">
         <Button onClick={onStartNew} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3">
            <RotateCcw className="mr-2 h-5 w-5" /> Start Another Project
        </Button>
      </CardFooter>
    </Card>
  );
}
