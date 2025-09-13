'use server';

/**
 * @fileOverview AI-powered resume analysis and career advice flow.
 *
 * - analyzeUploadedResume - Analyzes a resume or text query and provides feedback.
 * - AnalyzeUploadedResumeInput - The input type for the analyzeUploadedResume function.
 * - AnalyzeUploadedResumeOutput - The return type for the analyzeUploadedResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeUploadedResumeInputSchema = z.object({
  resumeDataUri: z
    .string()
    .optional()
    .describe(
      "The resume file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  extraInformation: z.string().optional().describe('Any extra information, questions, or goals from the user.'),
});
export type AnalyzeUploadedResumeInput = z.infer<typeof AnalyzeUploadedResumeInputSchema>;

const AnalyzeUploadedResumeOutputSchema = z.object({
  strengths: z.string().optional().describe('Strengths of the resume. Should be an empty string or null if no resume is provided.'),
  weaknesses: z.string().optional().describe('Weaknesses of the resume. Should be an empty string or null if no resume is provided.'),
  careerAdvice: z.string().describe('Career advice based on the resume or a direct answer to a user\'s text query.'),
  jobRecommendations: z.string().optional().describe('Recommended jobs. Should be an empty string or null if no resume is provided.'),
});
export type AnalyzeUploadedResumeOutput = z.infer<typeof AnalyzeUploadedResumeOutputSchema>;

export async function analyzeUploadedResume(input: AnalyzeUploadedResumeInput): Promise<AnalyzeUploadedResumeOutput> {
  return analyzeUploadedResumeFlow(input);
}

const analyzeResumePrompt = ai.definePrompt({
  name: 'analyzeResumePrompt',
  input: {schema: AnalyzeUploadedResumeInputSchema},
  output: {schema: AnalyzeUploadedResumeOutputSchema},
  prompt: `You are a helpful and friendly career coach chatbot. Your goal is to provide insightful career advice.

You will receive either a text-based query, a resume, or both.

- If a resume is provided, you MUST analyze it and provide:
  - Strengths of the resume
  - Weaknesses of the resume
  - Career advice based on the resume
  - Job recommendations based on the resume
  All output fields should be populated.

- If ONLY a text query is provided (no resume), you MUST act as a conversational chatbot like ChatGPT. Provide a direct, helpful answer to the user's query in the 'careerAdvice' field. In this scenario, the 'strengths', 'weaknesses', and 'jobRecommendations' fields MUST be null or empty strings.

- If both a resume and a text query are provided, use the text query to focus your analysis of the resume, and populate all fields in the output.

User's question or extra information: {{{extraInformation}}}

{{#if resumeDataUri}}
Resume: {{media url=resumeDataUri}}
{{/if}}
`,
});

const analyzeUploadedResumeFlow = ai.defineFlow(
  {
    name: 'analyzeUploadedResumeFlow',
    inputSchema: AnalyzeUploadedResumeInputSchema,
    outputSchema: AnalyzeUploadedResumeOutputSchema,
  },
  async input => {
    if (!input.resumeDataUri && !input.extraInformation) {
      throw new Error("Either a resume or a text query is required.");
    }
    const {output} = await analyzeResumePrompt(input);
    return output!;
  }
);
