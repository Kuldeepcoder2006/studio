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
  strengths: z.string().describe('Strengths of the resume or based on the user query.'),
  weaknesses: z.string().describe('Weaknesses of the resume or areas for improvement based on the query.'),
  careerAdvice: z.string().describe('Career advice based on the resume or query.'),
  jobRecommendations: z.string().describe('Recommended jobs based on the resume or query.'),
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

You will receive either a text-based query, a resume, or both. Use the provided information to answer the user's question or analyze their resume.

If a resume is provided, analyze it and provide:
- Strengths of the resume
- Weaknesses of the resume
- Career advice based on the resume
- Job recommendations based on the resume

If only a text query is provided, act as a career chatbot and answer the user's question directly. In this case, you can leave the 'strengths' and 'weaknesses' fields empty and provide the answer in the 'careerAdvice' field. You can still provide job recommendations if it's relevant to the question.

If both are provided, use the text query to focus your analysis of the resume.

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
