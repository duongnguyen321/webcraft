
"use client";

import { useState, useEffect, type FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { LocalConfig } from '@/app/page';

interface ConfigEditorProps {
  currentConfig: LocalConfig;
  onConfigSave: (newConfig: LocalConfig) => void;
}

const defaultConfigFields = {
  projectName: "My AI Project",
  defaultPort: "3000",
  userIdentifier: "anon_user"
};

export default function ConfigEditor({ currentConfig, onConfigSave }: ConfigEditorProps) {
  const [config, setConfig] = useState<LocalConfig>(currentConfig);

  useEffect(() => {
    setConfig(currentConfig);
  }, [currentConfig]);

  const handleChange = (key: string, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onConfigSave(config);
    // Optionally add a toast notification for save success
  };
  
  const allConfigKeys = Array.from(new Set([...Object.keys(defaultConfigFields), ...Object.keys(config)]));


  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-1">
      <ScrollArea className="h-[400px] pr-3">
        <div className="space-y-4">
          {allConfigKeys.map(key => (
            <div key={key} className="space-y-1">
              <Label htmlFor={key} className="capitalize font-medium text-foreground">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </Label>
              <Input
                id={key}
                value={config[key] || defaultConfigFields[key as keyof typeof defaultConfigFields] || ''}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                className="bg-input text-foreground"
              />
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="flex justify-end pt-4">
        <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
          Save Configuration
        </Button>
      </div>
    </form>
  );
}
