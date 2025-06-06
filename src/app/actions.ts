
"use server";

import { generatePrd, type GeneratePrdInput, type GeneratePrdOutput } from '@/ai/flows/generate-prd';
import { analyzePrd, type AnalyzePrdInput, type AnalyzePrdOutput } from '@/ai/flows/analyze-prd';
import { generateCode, type GenerateCodeInput, type GenerateCodeOutput } from '@/ai/flows/generate-code';
import { analyzeFeedback, type AnalyzeFeedbackInput, type AnalyzeFeedbackOutput } from '@/ai/flows/analyze-feedback';

export async function callGeneratePrd(input: GeneratePrdInput): Promise<GeneratePrdOutput> {
  try {
    return await generatePrd(input);
  } catch (error) {
    console.error("Error in callGeneratePrd:", error);
    throw new Error("Failed to generate PRD.");
  }
}

export async function callAnalyzePrd(input: AnalyzePrdInput): Promise<AnalyzePrdOutput> {
  try {
    return await analyzePrd(input);
  } catch (error) {
    console.error("Error in callAnalyzePrd:", error);
    throw new Error("Failed to analyze PRD.");
  }
}

export async function callGenerateCode(input: GenerateCodeInput): Promise<GenerateCodeOutput> {
  try {
    return await generateCode(input);
  } catch (error) {
    console.error("Error in callGenerateCode:", error);
    throw new Error("Failed to generate code.");
  }
}

export async function callAnalyzeFeedback(input: AnalyzeFeedbackInput): Promise<AnalyzeFeedbackOutput> {
  try {
    return await analyzeFeedback(input);
  } catch (error) {
    console.error("Error in callAnalyzeFeedback:", error);
    throw new Error("Failed to analyze feedback.");
  }
}
