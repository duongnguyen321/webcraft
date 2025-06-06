
"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Code2, CheckCircle2, Eye, Loader2 } from "lucide-react";
import type { GeneratedArtifact } from '@/app/page';
import ReactMarkdown from 'react-markdown';

interface CodingProgressStageProps {
  tasks: string[];
  generatedArtifacts: GeneratedArtifact[];
  onCodingComplete: () => void;
  isGeneratingCode: boolean;
  currentTaskIndex: number;
}

export default function CodingProgressStage({ tasks, generatedArtifacts, onCodingComplete, isGeneratingCode, currentTaskIndex }: CodingProgressStageProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (tasks.length > 0) {
      const newProgress = Math.min(100, (currentTaskIndex / tasks.length) * 100);
      setProgress(newProgress);
    }
  }, [currentTaskIndex, tasks.length]);

  const currentTaskDescription = tasks[currentTaskIndex] || "Finalizing project setup...";

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Code2 className="w-8 h-8 text-primary" />
          <CardTitle className="text-3xl font-headline">AI Code Generation</CardTitle>
        </div>
        <CardDescription className="text-muted-foreground">
          Developer AIs are working on the tasks. Please wait while your website is being built.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-foreground">
              {isGeneratingCode && currentTaskIndex < tasks.length ? `Working on: ${currentTaskDescription}` : (currentTaskIndex >= tasks.length && !isGeneratingCode ? "All tasks completed!" : "Initializing...")}
            </span>
            <span className="text-sm font-medium text-primary">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="w-full [&>div]:bg-primary" />
          {isGeneratingCode && currentTaskIndex < tasks.length && (
            <div className="flex items-center justify-center mt-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              <span>Generating code for current task...</span>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-xl font-headline font-semibold mb-2 text-foreground">Generated Artifacts</h3>
          <ScrollArea className="h-64 border rounded-md p-3 bg-muted/20">
            {generatedArtifacts.length > 0 ? (
              <ul className="space-y-2">
                {generatedArtifacts.map((artifact, index) => (
                  <li key={index} className="text-sm p-2 border rounded bg-card">
                    <strong className="text-primary">{artifact.type.toUpperCase()}:</strong>
                    <ReactMarkdown 
                      className="prose prose-sm dark:prose-invert max-w-none mt-1 bg-slate-800 text-slate-100 p-2 rounded font-code"
                      components={{ pre: ({node, ...props}) => <pre className="bg-transparent p-0 m-0" {...props} />}}
                    >
                      {`\`\`\`\n${artifact.content}\n\`\`\``}
                    </ReactMarkdown>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground text-center py-4">No artifacts generated yet. AI is working...</p>
            )}
          </ScrollArea>
        </div>
      </CardContent>
      <CardFooter className="p-6">
        <Button 
          onClick={onCodingComplete} 
          disabled={isGeneratingCode || currentTaskIndex < tasks.length} 
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-3"
        >
          {(isGeneratingCode || currentTaskIndex < tasks.length) ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Building in Progress...
            </>
          ) : (
            <>
              <Eye className="mr-2 h-5 w-5" />
              Proceed to Preview
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
