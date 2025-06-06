import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-feedback.ts';
import '@/ai/flows/generate-prd.ts';
import '@/ai/flows/generate-code.ts';
import '@/ai/flows/analyze-prd.ts';