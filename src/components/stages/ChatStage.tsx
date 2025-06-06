
"use client";

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Paperclip, Send, Bot, User, Loader2, CheckCircle2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { ChatMessage } from '@/app/page'; // Assuming ChatMessage type is exported from page.tsx

interface ChatStageProps {
  chatMessages: ChatMessage[];
  onSendMessage: (message: string) => Promise<string | null>; // Returns PRD if generated
  onProceedToReview: (prd: string) => void;
  isLoading: boolean;
  currentPrd: string | null;
}

export default function ChatStage({ chatMessages, onSendMessage, onProceedToReview, isLoading, currentPrd }: ChatStageProps) {
  const [userInput, setUserInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [chatMessages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;
    const messageToSend = userInput;
    setUserInput('');
    await onSendMessage(messageToSend);
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-250px)] bg-card shadow-lg rounded-lg overflow-hidden">
      <header className="p-4 border-b bg-muted">
        <h2 className="text-xl font-headline text-foreground">Project Requirements Gathering</h2>
        <p className="text-sm text-muted-foreground">Chat with our Business AI to define your website.</p>
      </header>

      <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {chatMessages.map((msg, index) => (
            <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] p-3 rounded-lg shadow ${
                msg.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
              }`}>
                <div className="flex items-center mb-1">
                  {msg.type === 'ai' && <Bot className="w-5 h-5 mr-2" />}
                  {msg.type === 'user' && <User className="w-5 h-5 mr-2" />}
                  <span className="font-semibold text-sm">{msg.type === 'user' ? 'You' : 'Business AI'}</span>
                </div>
                <ReactMarkdown 
                  className="prose prose-sm dark:prose-invert max-w-none"
                  components={{ p: ({node, ...props}) => <p className="m-0" {...props} /> }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          {isLoading && chatMessages.length > 0 && chatMessages[chatMessages.length-1].type === 'user' && (
            <div className="flex justify-start">
              <div className="max-w-[75%] p-3 rounded-lg shadow bg-secondary text-secondary-foreground">
                <div className="flex items-center">
                  <Bot className="w-5 h-5 mr-2" />
                  <span className="font-semibold text-sm">Business AI is typing...</span>
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {currentPrd && (
        <div className="p-4 border-t bg-muted/50">
          <p className="text-sm text-green-600 font-semibold mb-2 flex items-center">
            <CheckCircle2 className="w-5 h-5 mr-2 text-green-500" />
            A Product Requirements Document (PRD) has been drafted.
          </p>
          <Button onClick={() => onProceedToReview(currentPrd)} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            Review PRD & Create Project
          </Button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4 border-t bg-background flex items-center gap-2">
        <Textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Describe your website idea or add features..."
          className="flex-grow resize-none bg-input text-foreground"
          rows={2}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          disabled={isLoading}
        />
        <Button type="submit" size="icon" disabled={isLoading || !userInput.trim()} className="bg-primary hover:bg-primary/90">
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </div>
  );
}
