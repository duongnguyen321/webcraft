'use server';

/**
 * @fileOverview Generates a Product Requirements Document (PRD) based on user input.
 *
 * - generatePrd - A function that generates a PRD.
 * - GeneratePrdInput - The input type for the generatePrd function.
 * - GeneratePrdOutput - The return type for the generatePrd function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePrdInputSchema = z.object({
  websiteDescription: z
    .string()
    .describe('A detailed description of the website to be built.'),
});

export type GeneratePrdInput = z.infer<typeof GeneratePrdInputSchema>;

const GeneratePrdOutputSchema = z.object({
  prd: z
    .string()
    .describe(
      'A Product Requirements Document in Markdown format describing the website.'
    ),
});

export type GeneratePrdOutput = z.infer<typeof GeneratePrdOutputSchema>;

export async function generatePrd(input: GeneratePrdInput): Promise<GeneratePrdOutput> {
  return generatePrdFlow(input);
}

const generatePrdPrompt = ai.definePrompt({
  name: 'generatePrdPrompt',
  input: {schema: GeneratePrdInputSchema},
  output: {schema: GeneratePrdOutputSchema},
  prompt: `You are an AI assistant that helps generate Product Requirements Documents (PRDs) for websites.

  Based on the user's description, create a comprehensive PRD that outlines the website's purpose, features, functionality, and target audience.
  The PRD should be detailed and written in AI-friendly language to ensure clarity for subsequent processes.
  The PRD should be in markdown format.

  Website Description: {{{websiteDescription}}}
  `,
});

const generatePrdFlow = ai.defineFlow(
  {
    name: 'generatePrdFlow',
    inputSchema: GeneratePrdInputSchema,
    outputSchema: GeneratePrdOutputSchema,
  },
  async input => {
    const {output} = await generatePrdPrompt(input);
    return output!;
  }
);
