'use server';

/**
 * @fileOverview Analyzes a Product Requirements Document (PRD) to break it down into actionable tasks,
 * define the technology stack, and estimate project costs.
 *
 * - analyzePrd - A function that handles the PRD analysis process.
 * - AnalyzePrdInput - The input type for the analyzePrd function.
 * - AnalyzePrdOutput - The return type for the analyzePrd function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzePrdInputSchema = z.object({
  prd: z.string().describe('The Product Requirements Document (PRD) to analyze.'),
});
export type AnalyzePrdInput = z.infer<typeof AnalyzePrdInputSchema>;

const AnalyzePrdOutputSchema = z.object({
  tasks: z.array(z.string()).describe('A list of actionable tasks derived from the PRD.'),
  techStack: z.string().describe('The technology stack to be used for the project (NextJS, Redis, Prisma, PostgreSQL).'),
  costEstimate: z.string().describe('An estimate of the project cost based on the PRD token count.'),
});
export type AnalyzePrdOutput = z.infer<typeof AnalyzePrdOutputSchema>;

export async function analyzePrd(input: AnalyzePrdInput): Promise<AnalyzePrdOutput> {
  return analyzePrdFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzePrdPrompt',
  input: {schema: AnalyzePrdInputSchema},
  output: {schema: AnalyzePrdOutputSchema},
  prompt: `You are a project manager and tech lead. Analyze the following Product Requirements Document (PRD) and provide a breakdown of actionable tasks, the technology stack to be used (NextJS full-stack with Redis, Prisma, PostgreSQL), and an estimated project cost based on the PRD token count (every 10,000 tokens is approximately $10-20).

PRD: {{{prd}}}

Tasks:
{{#each tasks}}- {{this}}\n{{/each}}

Tech Stack: {{{techStack}}}

Cost Estimate: {{{costEstimate}}}`, // Updated prompt
});

const analyzePrdFlow = ai.defineFlow(
  {
    name: 'analyzePrdFlow',
    inputSchema: AnalyzePrdInputSchema,
    outputSchema: AnalyzePrdOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
