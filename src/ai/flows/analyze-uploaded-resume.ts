'use server';

/**
 * @fileOverview AI-powered resume analysis flow.
 *
 * - analyzeUploadedResume - Analyzes an uploaded resume and provides feedback.
 * - AnalyzeUploadedResumeInput - The input type for the analyzeUploadedResume function.
 * - AnalyzeUploadedResumeOutput - The return type for the analyzeUploadedResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeUploadedResumeInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "The resume file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  extraInformation: z.string().optional().describe('Any extra information to consider.'),
});
export type AnalyzeUploadedResumeInput = z.infer<typeof AnalyzeUploadedResumeInputSchema>;

const AnalyzeUploadedResumeOutputSchema = z.object({
  strengths: z.string().describe('Strengths of the resume.'),
  weaknesses: z.string().describe('Weaknesses of the resume.'),
  careerAdvice: z.string().describe('Career advice based on the resume.'),
  jobRecommendations: z.string().describe('Recommended jobs based on the resume.'),
});
export type AnalyzeUploadedResumeOutput = z.infer<typeof AnalyzeUploadedResumeOutputSchema>;

export async function analyzeUploadedResume(input: AnalyzeUploadedResumeInput): Promise<AnalyzeUploadedResumeOutput> {
  return analyzeUploadedResumeFlow(input);
}

const analyzeResumePrompt = ai.definePrompt({
  name: 'analyzeResumePrompt',
  input: {schema: AnalyzeUploadedResumeInputSchema},
  output: {schema: AnalyzeUploadedResumeOutputSchema},
  prompt: `You are a career coach that analyzes resumes and provides helpful feedback.

  Analyze the resume and provide the following:
  - Strengths of the resume
  - Weaknesses of the resume
  - Career advice based on the resume
  - Job recommendations based on the resume

  Consider this extra information when analyzing the resume: {{{extraInformation}}}

  Resume: {{media url=resumeDataUri}}`,
});

const analyzeUploadedResumeFlow = ai.defineFlow(
  {
    name: 'analyzeUploadedResumeFlow',
    inputSchema: AnalyzeUploadedResumeInputSchema,
    outputSchema: AnalyzeUploadedResumeOutputSchema,
  },
  async input => {
    const {output} = await analyzeResumePrompt(input);
    return output!;
  }
);
