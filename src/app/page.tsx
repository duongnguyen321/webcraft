
"use client";

import { useState, useEffect, useCallback } from 'react';
import AppShell from '@/components/AppShell';
import WelcomeStage from '@/components/stages/WelcomeStage';
import ChatStage from '@/components/stages/ChatStage';
import PrdReviewStage from '@/components/stages/PrdReviewStage';
import PlanningStage from '@/components/stages/PlanningStage';
import CodingProgressStage from '@/components/stages/CodingProgressStage';
import PreviewStage from '@/components/stages/PreviewStage';
import CompletedStage from '@/components/stages/CompletedStage';
import TerminalOutput, { type OutputLine } from '@/components/TerminalOutput';
import useLocalStorage from '@/hooks/useLocalStorage';
import { useToast } from "@/hooks/use-toast";
import { callGeneratePrd, callAnalyzePrd, callGenerateCode, callAnalyzeFeedback } from './actions';
import type { GeneratePrdOutput } from '@/ai/flows/generate-prd';
import type { AnalyzePrdOutput } from '@/ai/flows/analyze-prd';
import type { GenerateCodeOutput } from '@/ai/flows/generate-code';
import type { AnalyzeFeedbackOutput } from '@/ai/flows/analyze-feedback';

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai' | 'system';
  content: string;
  timestamp?: string;
}

export interface GeneratedArtifact {
  type: string; // e.g., 'API', 'Frontend Component', 'Database Schema'
  content: string; // The generated code or specification
}

export interface ProjectDetails extends AnalyzePrdOutput {}

export interface FeedbackHistoryItem {
  userFeedback: string;
  aiAnalysis: AnalyzeFeedbackOutput;
}

export interface LocalConfig {
  [key: string]: string;
}

export interface ProjectDocumentation {
  chatMessages: ChatMessage[];
  prd: string | null;
  projectDetails: ProjectDetails | null;
  generatedArtifacts: GeneratedArtifact[];
  feedbackHistory: FeedbackHistoryItem[];
}

type AppStage = 
  | 'welcome' 
  | 'chatting' 
  | 'prd_review' 
  | 'planning' 
  | 'coding' 
  | 'preview' 
  // | 'feedback' // Feedback is handled within preview stage or by returning to planning/coding
  | 'completed';


const initialDocumentation: ProjectDocumentation = {
  chatMessages: [],
  prd: null,
  projectDetails: null,
  generatedArtifacts: [],
  feedbackHistory: [],
};

const initialConfig: LocalConfig = {
  projectName: "MyNewWebApp",
  defaultPort: "3001",
  userIdentifier: `user_${Date.now().toString().slice(-4)}`
};


export default function HomePage() {
  const [currentStage, setCurrentStage] = useState<AppStage>('welcome');
  const [terminalOutput, setTerminalOutput] = useState<OutputLine[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [localConfig, setLocalConfig] = useLocalStorage<LocalConfig>('webcraft_ai_config', initialConfig);
  const [projectDocs, setProjectDocs] = useLocalStorage<ProjectDocumentation>('webcraft_ai_project_docs', initialDocumentation);
  
  // Specific states for data passing between stages
  const [currentPrd, setCurrentPrd] = useState<string | null>(projectDocs.prd);
  const [currentProjectDetails, setCurrentProjectDetails] = useState<ProjectDetails | null>(projectDocs.projectDetails);
  const [currentGeneratedArtifacts, setCurrentGeneratedArtifacts] = useState<GeneratedArtifact[]>(projectDocs.generatedArtifacts);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0); // For coding progress

  const addTerminalLine = useCallback((type: OutputLine['type'], content: string | React.ReactNode) => {
    setTerminalOutput(prev => [...prev, { 
      id: prev.length, 
      type, 
      content, 
      timestamp: new Date().toLocaleTimeString() 
    }]);
  }, []);

  const updateDocs = useCallback((newDocs: Partial<ProjectDocumentation>) => {
    setProjectDocs(prev => ({...prev, ...newDocs}));
  }, [setProjectDocs]);

  // Effect to sync local state with localStorage on initial load or when docs change
  useEffect(() => {
    setCurrentPrd(projectDocs.prd);
    setCurrentProjectDetails(projectDocs.projectDetails);
    setCurrentGeneratedArtifacts(projectDocs.generatedArtifacts);
    // If loading an existing project, set the stage appropriately
    // For simplicity, this example always starts at 'welcome' on page load.
  }, [projectDocs]);


  const handleStartNewProject = () => {
    // Reset project-specific parts of documentation for a new project
    const freshDocs = {
      ...initialDocumentation,
      chatMessages: [{ id: '0', type: 'ai', content: 'Hello! I am your Business AI. Describe the website you want to build.' }]
    };
    setProjectDocs(freshDocs); 
    setCurrentPrd(null);
    setCurrentProjectDetails(null);
    setCurrentGeneratedArtifacts([]);
    setCurrentTaskIndex(0);
    setTerminalOutput([]); // Clear terminal
    addTerminalLine('system', 'Starting a new project. Configuration loaded.');
    setCurrentStage('chatting');
  };

  const handleSendMessageToBusinessAI = async (message: string): Promise<string | null> => {
    const userMessage: ChatMessage = { id: String(projectDocs.chatMessages.length), type: 'user', content: message, timestamp: new Date().toLocaleTimeString() };
    updateDocs({ chatMessages: [...projectDocs.chatMessages, userMessage] });
    addTerminalLine('user', message);
    setIsLoading(true);

    try {
      const aiResponse: GeneratePrdOutput = await callGeneratePrd({ websiteDescription: projectDocs.chatMessages.map(m => `${m.type}: ${m.content}`).join('\n') + `\nuser: ${message}` });
      const aiMessage: ChatMessage = { id: String(projectDocs.chatMessages.length + 1), type: 'ai', content: `Okay, I've updated the project scope based on your input. The PRD is being drafted. Here's a summary or next question... (Full PRD: ${aiResponse.prd.substring(0,50)}...)`, timestamp: new Date().toLocaleTimeString() };
      updateDocs({ chatMessages: [...projectDocs.chatMessages, userMessage, aiMessage], prd: aiResponse.prd });
      setCurrentPrd(aiResponse.prd); // Update currentPRD state
      addTerminalLine('ai', aiMessage.content);
      addTerminalLine('info', 'PRD draft updated. Ready for review when you are.');
      toast({ title: "PRD Updated", description: "The AI has updated the project requirements." });
      return aiResponse.prd;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown AI error";
      addTerminalLine('error', `Business AI Error: ${errorMsg}`);
      toast({ title: "Error", description: `Failed to get response from Business AI: ${errorMsg}`, variant: "destructive" });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleProceedToPrdReview = (prd: string) => {
    setCurrentPrd(prd); // Ensure currentPrd is set
    updateDocs({ prd });
    addTerminalLine('system', 'Proceeding to PRD Review.');
    setCurrentStage('prd_review');
  };
  
  const handleConfirmProject = async () => {
    if (!currentPrd) {
      addTerminalLine('error', 'No PRD available to confirm.');
      toast({ title: "Error", description: "PRD is missing.", variant: "destructive" });
      return;
    }
    addTerminalLine('system', 'PRD confirmed. Analyzing project with PM + Tech Lead AI...');
    setIsLoading(true);
    try {
      const plan: ProjectDetails = await callAnalyzePrd({ prd: currentPrd });
      updateDocs({ projectDetails: plan });
      setCurrentProjectDetails(plan);
      addTerminalLine('info', `Project analysis complete. Tasks: ${plan.tasks.join(', ')}. Stack: ${plan.techStack}. Cost: ${plan.costEstimate}`);
      toast({ title: "Project Planned", description: "PM AI has created a project plan."});
      setCurrentStage('planning');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown AI error";
      addTerminalLine('error', `PM AI Error: ${errorMsg}`);
      toast({ title: "Error", description: `Failed to analyze PRD: ${errorMsg}`, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartCoding = async () => {
    if (!currentProjectDetails || currentProjectDetails.tasks.length === 0) {
      addTerminalLine('error', 'No tasks defined to start coding.');
      toast({ title: "Error", description: "No tasks to generate code for.", variant: "destructive" });
      return;
    }
    addTerminalLine('system', 'Starting AI code generation process...');
    setCurrentStage('coding');
    setIsLoading(true); // isLoading will now mean "isGeneratingCode" for this stage
    setCurrentGeneratedArtifacts([]); // Reset artifacts for new coding session
    setCurrentTaskIndex(0);

    const tasks = currentProjectDetails.tasks;
    let allArtifacts: GeneratedArtifact[] = [];

    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      setCurrentTaskIndex(i);
      addTerminalLine('info', `Developer AI starting task ${i + 1}/${tasks.length}: ${task}`);
      try {
        // Simplistic: use existing code from previous steps if relevant
        const existingCode = allArtifacts.length > 0 ? allArtifacts.map(a => `// ${a.type}\n${a.content}`).join('\n\n') : undefined;
        
        const codeOutput: GenerateCodeOutput = await callGenerateCode({
          taskDescription: task,
          techStack: currentProjectDetails.techStack,
          existingCode: existingCode,
        });
        const newArtifact: GeneratedArtifact = { type: `Task ${i+1} - ${task.substring(0,30)}...`, content: codeOutput.generatedCode };
        allArtifacts = [...allArtifacts, newArtifact];
        setCurrentGeneratedArtifacts(prev => [...prev, newArtifact]); // Update state for UI
        addTerminalLine('success', `Code generated for task: ${task}`);
        updateDocs({ generatedArtifacts: allArtifacts }); // Persist after each task
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Unknown AI error";
        addTerminalLine('error', `Developer AI Error on task "${task}": ${errorMsg}`);
        toast({ title: "Coding Error", description: `Failed on task "${task}": ${errorMsg}`, variant: "destructive" });
        // Optionally stop or allow skipping
      }
    }
    setCurrentTaskIndex(tasks.length); // Mark as all tasks attempted
    setIsLoading(false);
    addTerminalLine('system', 'All coding tasks processed.');
    toast({ title: "Coding Complete", description: "AI has finished generating code for all tasks." });
    // No automatic transition, user clicks button in CodingProgressStage
  };

  const handleCodingComplete = () => {
    addTerminalLine('system', 'Proceeding to Website Preview stage.');
    setCurrentStage('preview');
  };

  const handleProvideFeedback = async (feedback: string) => {
    addTerminalLine('user', `Feedback: ${feedback}`);
    setIsLoading(true);
    try {
      // Using currentTasks from projectDetails if available for context
      const currentTasksString = currentProjectDetails?.tasks.join('\n') || 'No current tasks defined.';
      const feedbackAnalysis: AnalyzeFeedbackOutput = await callAnalyzeFeedback({ feedback, currentTasks: currentTasksString });
      
      const newFeedbackItem: FeedbackHistoryItem = { userFeedback: feedback, aiAnalysis: feedbackAnalysis };
      updateDocs({ feedbackHistory: [...projectDocs.feedbackHistory, newFeedbackItem] });

      addTerminalLine('ai', `Feedback analyzed. New tasks: ${feedbackAnalysis.taskList.join(', ') || 'None'}`);
      toast({ title: "Feedback Processed", description: "AI has analyzed your feedback."});

      if (feedbackAnalysis.taskList.length > 0) {
        // Update project details with new tasks and re-enter planning/coding
        // For simplicity, let's assume new tasks replace old ones or are added.
        // This part needs more sophisticated logic in a real app.
        // Here, we'll update the tasks and go back to planning.
        const updatedTasks = [...(currentProjectDetails?.tasks || []), ...feedbackAnalysis.taskList];
        const updatedProjectDetails = {
          ...(currentProjectDetails || { tasks: [], techStack: 'NextJS, Redis, Prisma, PostgreSQL', costEstimate: 'Recalculating...' }),
          tasks: updatedTasks,
        };
        setCurrentProjectDetails(updatedProjectDetails);
        updateDocs({ projectDetails: updatedProjectDetails });
        addTerminalLine('system', 'Project plan updated with new tasks from feedback. Revisiting planning...');
        setCurrentStage('planning'); 
      } else {
        addTerminalLine('info', "No new actionable tasks from feedback. You can finalize or provide more feedback.");
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown AI error";
      addTerminalLine('error', `Feedback Analysis Error: ${errorMsg}`);
      toast({ title: "Error", description: `Failed to process feedback: ${errorMsg}`, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalizeProject = () => {
    addTerminalLine('system', `Project "${localConfig.projectName}" finalized. Source code (simulated) at: ./projects/${localConfig.projectName}`);
    addTerminalLine('success', 'Local development server (simulated) stopped.');
    toast({ title: "Project Finalized!", description: "Thank you for using Webcraft AI Terminal."});
    setCurrentStage('completed');
  };

  const renderStage = () => {
    switch (currentStage) {
      case 'welcome':
        return <WelcomeStage onStartNewProject={handleStartNewProject} />;
      case 'chatting':
        return <ChatStage 
                  chatMessages={projectDocs.chatMessages} 
                  onSendMessage={handleSendMessageToBusinessAI} 
                  onProceedToReview={handleProceedToPrdReview}
                  isLoading={isLoading} 
                  currentPrd={currentPrd}
                />;
      case 'prd_review':
        return currentPrd ? <PrdReviewStage 
                              prdContent={currentPrd} 
                              onConfirmProject={handleConfirmProject} 
                              onEditRequirements={() => setCurrentStage('chatting')}
                              isLoading={isLoading}
                            /> : <p>Loading PRD...</p>;
      case 'planning':
        return <PlanningStage 
                  projectDetails={currentProjectDetails} 
                  onStartCoding={handleStartCoding} 
                  isLoading={isLoading}
                />;
      case 'coding':
        return <CodingProgressStage 
                  tasks={currentProjectDetails?.tasks || []} 
                  generatedArtifacts={currentGeneratedArtifacts} 
                  onCodingComplete={handleCodingComplete} 
                  isGeneratingCode={isLoading}
                  currentTaskIndex={currentTaskIndex}
                />;
      case 'preview':
        return <PreviewStage 
                  previewUrl={`http://localhost:${localConfig.defaultPort || 3000}/${localConfig.projectName || 'my-app'}`} 
                  onProvideFeedback={handleProvideFeedback} 
                  onFinalizeProject={handleFinalizeProject}
                  isLoading={isLoading}
                />;
      case 'completed':
        return <CompletedStage 
                  sourceCodePath={`./projects/${localConfig.projectName || 'my-app'}`}
                  onStartNew={handleStartNewProject} 
                />;
      default:
        return <p>Unknown stage.</p>;
    }
  };
  
  const handleConfigChange = (newConfig: LocalConfig) => {
    setLocalConfig(newConfig);
    addTerminalLine('system', `Configuration updated. Project Name: ${newConfig.projectName}`);
    toast({ title: "Configuration Saved", description: "Your local settings have been updated." });
  };

  return (
    <AppShell 
        config={localConfig} 
        onConfigChange={handleConfigChange}
        documentation={projectDocs}
    >
      <div className="space-y-4">
        <TerminalOutput lines={terminalOutput} className="h-48" />
        <div className="p-1 rounded-lg shadow-sm bg-card border border-border min-h-[300px] flex items-center justify-center">
          {renderStage()}
        </div>
      </div>
    </AppShell>
  );
}
