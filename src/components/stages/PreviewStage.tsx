
"use client";

import { useState, type FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, MessageSquare,ThumbsUp, Loader2 } from "lucide-react";

interface PreviewStageProps {
  previewUrl: string;
  onProvideFeedback: (feedback: string) => void;
  onFinalizeProject: () => void;
  isLoading: boolean;
}

export default function PreviewStage({ previewUrl, onProvideFeedback, onFinalizeProject, isLoading }: PreviewStageProps) {
  const [feedback, setFeedback] = useState('');

  const handleSubmitFeedback = (e: FormEvent) => {
    e.preventDefault();
    if (!feedback.trim() || isLoading) return;
    onProvideFeedback(feedback);
    setFeedback('');
  };

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Eye className="w-16 h-16 text-primary" />
        </div>
        <CardTitle className="text-3xl font-headline">Website Preview Ready!</CardTitle>
        <CardDescription className="text-muted-foreground">
          Your website has been notionally "deployed" locally. You can "preview" it at the URL below.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 text-center">
        <div className="p-4 border rounded-md bg-muted/20">
          <p className="text-sm text-muted-foreground">Preview URL (simulated):</p>
          <a 
            href={previewUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-lg font-semibold text-accent hover:underline"
            onClick={(e) => e.preventDefault()} // Prevent actual navigation for this simulation
          >
            {previewUrl}
          </a>
          <p className="text-xs text-muted-foreground mt-1">(This is a simulated URL. In a real CLI, this would be a live local server.)</p>
        </div>

        <form onSubmit={handleSubmitFeedback} className="space-y-4">
          <div>
            <label htmlFor="feedback" className="block text-sm font-medium text-foreground mb-1 text-left">Provide Feedback or Request Changes:</label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="e.g., Change the hero section title, add a contact form..."
              rows={4}
              className="bg-input text-foreground"
              disabled={isLoading}
            />
          </div>
          <Button type="submit" disabled={isLoading || !feedback.trim()} className="w-full sm:w-auto bg-secondary hover:bg-secondary/90 text-secondary-foreground">
            {isLoading && feedback.trim() ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <MessageSquare className="mr-2 h-4 w-4" />
            )}
            Submit Feedback
          </Button>
        </form>
      </CardContent>
      <CardFooter className="p-6">
        <Button onClick={onFinalizeProject} disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3">
          {isLoading ? (
             <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <ThumbsUp className="mr-2 h-5 w-5" />
          )}
          Looks Good! Finalize Project
        </Button>
      </CardFooter>
    </Card>
  );
}
