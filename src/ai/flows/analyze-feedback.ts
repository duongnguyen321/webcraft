'use server';

/**
 * @fileOverview Analyzes user feedback, breaks it down into tasks, and assigns them to developers.
 *
 * - analyzeFeedback - A function that handles the feedback analysis process.
 * - AnalyzeFeedbackInput - The input type for the analyzeFeedback function.
 * - AnalyzeFeedbackOutput - The return type for the analyzeFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeFeedbackInputSchema = z.object({
  feedback: z
    .string()
    .describe('The feedback provided by the user regarding the website.'),
  currentTasks: z
    .string()
    .optional()
    .describe('The list of current tasks being worked on.')
});
export type AnalyzeFeedbackInput = z.infer<typeof AnalyzeFeedbackInputSchema>;

const AnalyzeFeedbackOutputSchema = z.object({
  taskList: z
    .array(z.string())
    .describe('A list of tasks derived from the user feedback.'),
});
export type AnalyzeFeedbackOutput = z.infer<typeof AnalyzeFeedbackOutputSchema>;

export async function analyzeFeedback(input: AnalyzeFeedbackInput): Promise<AnalyzeFeedbackOutput> {
  return analyzeFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeFeedbackPrompt',
  input: {schema: AnalyzeFeedbackInputSchema},
  output: {schema: AnalyzeFeedbackOutputSchema},
  prompt: `You are a project manager. Analyze the user feedback to create a list of actionable tasks for the development team.

User Feedback: {{{feedback}}}

Existing Tasks: {{{currentTasks}}}

Based on the feedback, generate a list of tasks that need to be completed.  The tasks should be specific and actionable.

Tasks:
`,
});

const analyzeFeedbackFlow = ai.defineFlow(
  {
    name: 'analyzeFeedbackFlow',
    inputSchema: AnalyzeFeedbackInputSchema,
    outputSchema: AnalyzeFeedbackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
