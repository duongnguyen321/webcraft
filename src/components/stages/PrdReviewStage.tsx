
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Edit3, Rocket, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface PrdReviewStageProps {
  prdContent: string;
  onConfirmProject: () => void;
  onEditRequirements: () => void;
  isLoading: boolean;
}

export default function PrdReviewStage({ prdContent, onConfirmProject, onEditRequirements, isLoading }: PrdReviewStageProps) {
  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-8 h-8 text-primary" />
          <CardTitle className="text-3xl font-headline">Review Product Requirements</CardTitle>
        </div>
        <CardDescription className="text-muted-foreground">
          Please review the generated Product Requirements Document (PRD) below. If everything looks good, confirm to proceed with project planning.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96 border rounded-md p-4 bg-muted/20">
          <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none">
            {prdContent}
          </ReactMarkdown>
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-end gap-4 p-6">
        <Button variant="outline" onClick={onEditRequirements} disabled={isLoading} className="w-full sm:w-auto">
          <Edit3 className="mr-2 h-4 w-4" /> Edit Requirements
        </Button>
        <Button onClick={onConfirmProject} disabled={isLoading} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Rocket className="mr-2 h-4 w-4" />
          )}
          Confirm & Create Project
        </Button>
      </CardFooter>
    </Card>
  );
}
