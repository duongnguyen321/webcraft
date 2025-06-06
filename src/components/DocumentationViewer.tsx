
"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ProjectDocumentation } from '@/app/page';
import ReactMarkdown from 'react-markdown';

interface DocumentationViewerProps {
  documentation: ProjectDocumentation;
}

export default function DocumentationViewer({ documentation }: DocumentationViewerProps) {
  return (
    <ScrollArea className="h-[calc(80vh-120px)] p-1">
      <Accordion type="multiple" defaultValue={['chat', 'prd']} className="w-full space-y-2">
        
        <AccordionItem value="chat">
          <AccordionTrigger className="font-headline text-lg hover:no-underline">Chat History</AccordionTrigger>
          <AccordionContent>
            <Card className="bg-card">
              <CardContent className="p-4 max-h-96 overflow-y-auto font-code text-sm">
                {documentation.chatMessages.length > 0 ? (
                  documentation.chatMessages.map((msg, index) => (
                    <div key={index} className={`mb-2 p-2 rounded-md ${msg.type === 'user' ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground'}`}>
                      <strong>{msg.type.toUpperCase()}:</strong>
                      <ReactMarkdown components={{ p: ({node, ...props}) => <span className="inline" {...props} /> }}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No chat history available.</p>
                )}
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="prd">
          <AccordionTrigger className="font-headline text-lg hover:no-underline">Product Requirements Document (PRD)</AccordionTrigger>
          <AccordionContent>
            <Card className="bg-card">
              <CardContent className="p-4 max-h-96 overflow-y-auto">
                {documentation.prd ? (
                  <ReactMarkdown className="prose prose-sm dark:prose-invert max-w-none">
                    {documentation.prd}
                  </ReactMarkdown>
                ) : (
                  <p className="text-muted-foreground">No PRD generated yet.</p>
                )}
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="project_details">
          <AccordionTrigger className="font-headline text-lg hover:no-underline">Project Details</AccordionTrigger>
          <AccordionContent>
            <Card className="bg-card">
              <CardContent className="p-4 space-y-3">
                {documentation.projectDetails ? (
                  <>
                    <div>
                      <h4 className="font-semibold text-foreground">Tasks:</h4>
                      {documentation.projectDetails.tasks.length > 0 ? (
                        <ul className="list-disc list-inside ml-4 text-muted-foreground">
                          {documentation.projectDetails.tasks.map((task, i) => <li key={i}>{task}</li>)}
                        </ul>
                      ) : <p className="text-muted-foreground text-sm">No tasks defined.</p>}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Tech Stack:</h4>
                      <p className="text-muted-foreground text-sm">{documentation.projectDetails.techStack || "Not defined."}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Cost Estimate:</h4>
                      <p className="text-muted-foreground text-sm">{documentation.projectDetails.costEstimate || "Not estimated."}</p>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground">No project details available yet.</p>
                )}
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="artifacts">
          <AccordionTrigger className="font-headline text-lg hover:no-underline">Generated Artifacts</AccordionTrigger>
          <AccordionContent>
            <Card className="bg-card">
              <CardContent className="p-4 max-h-96 overflow-y-auto font-code text-sm">
                {documentation.generatedArtifacts.length > 0 ? (
                  documentation.generatedArtifacts.map((artifact, index) => (
                    <div key={index} className="mb-2 p-2 rounded-md bg-muted">
                      <strong className="text-foreground">{artifact.type.toUpperCase()}:</strong>
                      <pre className="whitespace-pre-wrap bg-slate-800 text-slate-100 p-2 rounded mt-1">{artifact.content}</pre>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No artifacts generated yet.</p>
                )}
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="feedback">
          <AccordionTrigger className="font-headline text-lg hover:no-underline">Feedback History</AccordionTrigger>
          <AccordionContent>
            <Card className="bg-card">
              <CardContent className="p-4 max-h-96 overflow-y-auto">
                {documentation.feedbackHistory.length > 0 ? (
                  documentation.feedbackHistory.map((item, index) => (
                    <div key={index} className="mb-3 p-2 border-b border-border last:border-b-0">
                      <p className="font-semibold text-foreground">User Feedback:</p>
                      <p className="text-muted-foreground text-sm mb-1">{item.userFeedback}</p>
                      <p className="font-semibold text-foreground">AI Analysis & New Tasks:</p>
                      {item.aiAnalysis.taskList.length > 0 ? (
                        <ul className="list-disc list-inside ml-4 text-muted-foreground text-sm">
                          {item.aiAnalysis.taskList.map((task: string, i: number) => <li key={i}>{task}</li>)}
                        </ul>
                      ): <p className="text-muted-foreground text-sm">No new tasks from this feedback.</p>}
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No feedback history available.</p>
                )}
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </ScrollArea>
  );
}

// Add this to your global css or a prose specific css file if you want more control over markdown styling
// For now, using prose-sm for basic styling.
// Ensure you have @tailwindcss/typography plugin if you use prose classes heavily.
// The current tailwind.config.ts does not list it, so basic HTML tags from markdown will be styled by browser/tailwind defaults.
