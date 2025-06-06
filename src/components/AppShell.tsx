
import type { ReactNode } from 'react';
import { Terminal, Settings, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ConfigEditor from '@/components/ConfigEditor';
import DocumentationViewer from '@/components/DocumentationViewer';
import type { ProjectDocumentation, LocalConfig } from '@/app/page';


interface AppShellProps {
  children: ReactNode;
  config: LocalConfig;
  onConfigChange: (newConfig: LocalConfig) => void;
  documentation: ProjectDocumentation;
}

export default function AppShell({ children, config, onConfigChange, documentation }: AppShellProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="p-4 border-b border-border shadow-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Terminal className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-headline font-bold text-primary">Webcraft AI Terminal</h1>
          </div>
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="mr-2 h-4 w-4" /> Config
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle className="font-headline">Local Configuration</DialogTitle>
                </DialogHeader>
                <ConfigEditor currentConfig={config} onConfigSave={onConfigChange} />
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <FileText className="mr-2 h-4 w-4" /> Docs
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] max-h-[80vh]">
                <DialogHeader>
                  <DialogTitle className="font-headline">Project Documentation</DialogTitle>
                </DialogHeader>
                <DocumentationViewer documentation={documentation} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4 md:p-8">
        {children}
      </main>
      <footer className="p-4 border-t border-border text-center">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Webcraft AI Terminal. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
