'use server';

/**
 * @fileOverview This file defines a Genkit flow for recommending relevant jobs based on a resume analysis.
 *
 * - recommendRelevantJobs - A function that takes resume analysis as input and returns job recommendations.
 * - RecommendRelevantJobsInput - The input type for the recommendRelevantJobs function.
 * - RecommendRelevantJobsOutput - The return type for the recommendRelevantJobs function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendRelevantJobsInputSchema = z.object({
  resumeAnalysis: z
    .string()
    .describe('The AI analysis of the resume, including strengths, weaknesses, and career advice.'),
});
export type RecommendRelevantJobsInput = z.infer<typeof RecommendRelevantJobsInputSchema>;

const RecommendRelevantJobsOutputSchema = z.object({
  jobRecommendations: z
    .string()
    .describe('A list of relevant job recommendations based on the resume analysis.'),
});
export type RecommendRelevantJobsOutput = z.infer<typeof RecommendRelevantJobsOutputSchema>;

export async function recommendRelevantJobs(input: RecommendRelevantJobsInput): Promise<RecommendRelevantJobsOutput> {
  return recommendRelevantJobsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendRelevantJobsPrompt',
  input: {schema: RecommendRelevantJobsInputSchema},
  output: {schema: RecommendRelevantJobsOutputSchema},
  prompt: `Based on the following resume analysis: {{{resumeAnalysis}}}, provide a list of relevant job recommendations. Consider the strengths and weaknesses identified in the analysis to suggest suitable roles and industries.  Format the job recommendations as a list.
`,
});

const recommendRelevantJobsFlow = ai.defineFlow(
  {
    name: 'recommendRelevantJobsFlow',
    inputSchema: RecommendRelevantJobsInputSchema,
    outputSchema: RecommendRelevantJobsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
