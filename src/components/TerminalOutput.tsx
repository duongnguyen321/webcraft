
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export interface OutputLine {
  id: string | number;
  type: 'user' | 'ai' | 'system' | 'error' | 'info' | 'success' | 'code';
  content: ReactNode; // Allow ReactNode for rich content
  timestamp?: string;
}

interface TerminalOutputProps {
  lines: OutputLine[];
  className?: string;
}

export default function TerminalOutput({ lines, className }: TerminalOutputProps) {
  return (
    <ScrollArea className={cn("h-64 md:h-96 w-full rounded-md border p-4 bg-slate-900 text-slate-50 font-code text-sm shadow-inner", className)}>
      {lines.map((line) => (
        <div key={line.id} className="mb-1 whitespace-pre-wrap">
          {line.timestamp && (
            <span className="text-slate-400 mr-2">[{line.timestamp}]</span>
          )}
          {line.type === 'user' && <span className="text-green-400">$ &nbsp;</span>}
          {line.type === 'ai' && <span className="text-blue-400">AI: &nbsp;</span>}
          {line.type === 'system' && <span className="text-yellow-400">System: &nbsp;</span>}
          {line.type === 'error' && <span className="text-red-400">Error: &nbsp;</span>}
          {line.type === 'info' && <span className="text-cyan-400">Info: &nbsp;</span>}
          {line.type === 'success' && <span className="text-lime-400">Success: &nbsp;</span>}
          {typeof line.content === 'string' ? (
            <span className={cn(
              line.type === 'user' && 'text-green-300',
              line.type === 'ai' && 'text-slate-50',
              line.type === 'system' && 'text-yellow-300',
              line.type === 'error' && 'text-red-300',
              line.type === 'info' && 'text-cyan-300',
              line.type === 'success' && 'text-lime-300',
              line.type === 'code' && 'block bg-slate-800 p-2 rounded my-1'
            )}>
              {line.content}
            </span>
          ) : (
            line.content // Render ReactNode directly
          )}
        </div>
      ))}
    </ScrollArea>
  );
}
