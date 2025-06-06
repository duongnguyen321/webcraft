
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ListChecks, Cpu, DollarSign, Code2, Loader2 } from "lucide-react";
import type { ProjectDetails } from '@/app/page';

interface PlanningStageProps {
  projectDetails: ProjectDetails | null;
  onStartCoding: () => void;
  isLoading: boolean;
}

export default function PlanningStage({ projectDetails, onStartCoding, isLoading }: PlanningStageProps) {
  if (!projectDetails) {
    return (
      <Card className="w-full max-w-2xl mx-auto text-center py-10 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Analyzing Project...</CardTitle>
        </CardHeader>
        <CardContent>
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground mt-4">Our PM + Tech Lead AI is analyzing the PRD and planning your project. Please wait.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <ListChecks className="w-8 h-8 text-primary" />
          <CardTitle className="text-3xl font-headline">Project Plan Ready</CardTitle>
        </div>
        <CardDescription className="text-muted-foreground">
          The PM + Tech Lead AI has analyzed the PRD and generated the following project plan.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-xl font-headline font-semibold mb-2 flex items-center text-foreground">
            <ListChecks className="w-5 h-5 mr-2 text-primary" /> Actionable Tasks
          </h3>
          <ScrollArea className="h-48 border rounded-md p-3 bg-muted/20">
            {projectDetails.tasks.length > 0 ? (
              <ul className="list-decimal list-inside space-y-1 text-sm text-foreground">
                {projectDetails.tasks.map((task, index) => (
                  <li key={index}>{task}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No tasks defined yet.</p>
            )}
          </ScrollArea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-xl font-headline font-semibold mb-2 flex items-center text-foreground">
              <Cpu className="w-5 h-5 mr-2 text-primary" /> Technology Stack
            </h3>
            <p className="text-sm p-3 border rounded-md bg-muted/20 text-foreground">{projectDetails.techStack}</p>
          </div>
          <div>
            <h3 className="text-xl font-headline font-semibold mb-2 flex items-center text-foreground">
              <DollarSign className="w-5 h-5 mr-2 text-primary" /> Estimated Cost
            </h3>
            <p className="text-sm p-3 border rounded-md bg-muted/20 text-foreground">{projectDetails.costEstimate}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6">
        <Button onClick={onStartCoding} disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3">
          {isLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Code2 className="mr-2 h-5 w-5" />
          )}
          Start AI Code Generation
        </Button>
      </CardFooter>
    </Card>
  );
}
