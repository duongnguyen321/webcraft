// src/ai/flows/generate-code.ts
'use server';
/**
 * @fileOverview A code generation AI agent.
 *
 * - generateCode - A function that handles the code generation process.
 * - GenerateCodeInput - The input type for the generateCode function.
 * - GenerateCodeOutput - The return type for the generateCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCodeInputSchema = z.object({
  taskDescription: z.string().describe('The description of the coding task to be performed.'),
  apiSpecifications: z.string().optional().describe('API specifications, including endpoints, expected inputs/outputs, if applicable.'),
  existingCode: z.string().optional().describe('Existing code to be modified or built upon.'),
  techStack: z.string().default('NextJS, Redis, Prisma, PostgreSQL').describe('The technology stack to be used.'),
});
export type GenerateCodeInput = z.infer<typeof GenerateCodeInputSchema>;

const GenerateCodeOutputSchema = z.object({
  generatedCode: z.string().describe('The generated code based on the task description and specifications.'),
});
export type GenerateCodeOutput = z.infer<typeof GenerateCodeOutputSchema>;

export async function generateCode(input: GenerateCodeInput): Promise<GenerateCodeOutput> {
  return generateCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCodePrompt',
  input: {schema: GenerateCodeInputSchema},
  output: {schema: GenerateCodeOutputSchema},
  prompt: `You are an expert software developer specializing in full-stack web applications using {{{techStack}}}.

You will generate code based on the task description and API specifications provided.
If existing code is provided, you will modify it according to the task description.

Task Description: {{{taskDescription}}}

{{#if apiSpecifications}}
API Specifications:
{{{apiSpecifications}}}
{{/if}}

{{#if existingCode}}
Existing Code:
{{{existingCode}}}
{{/if}}


Here's the generated code:
`,
});

const generateCodeFlow = ai.defineFlow(
  {
    name: 'generateCodeFlow',
    inputSchema: GenerateCodeInputSchema,
    outputSchema: GenerateCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
