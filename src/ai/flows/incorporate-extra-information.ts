'use server';

/**
 * @fileOverview This file defines a Genkit flow to incorporate extra information into a resume summary.
 *
 * - incorporateExtraInformation - A function that suggests incorporating extra information into a resume summary.
 * - IncorporateExtraInformationInput - The input type for the incorporateExtraInformation function.
 * - IncorporateExtraInformationOutput - The return type for the incorporateExtraInformation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IncorporateExtraInformationInputSchema = z.object({
  resumeSummary: z
    .string()
    .describe('The current summary of the resume.'),
  jobDescription: z.string().describe('The description of the job being applied for.'),
  skills: z.array(z.string()).describe('A list of skills.'),
  experience: z.string().describe('A description of the work experience.'),
});

export type IncorporateExtraInformationInput = z.infer<
  typeof IncorporateExtraInformationInputSchema
>;

const IncorporateExtraInformationOutputSchema = z.object({
  suggestions: z
    .string()
    .describe(
      'Suggestions on what extra information to incorporate into the resume summary.'
    ),
});

export type IncorporateExtraInformationOutput = z.infer<
  typeof IncorporateExtraInformationOutputSchema
>;

export async function incorporateExtraInformation(
  input: IncorporateExtraInformationInput
): Promise<IncorporateExtraInformationOutput> {
  return incorporateExtraInformationFlow(input);
}

const incorporateExtraInformationPrompt = ai.definePrompt({
  name: 'incorporateExtraInformationPrompt',
  input: {schema: IncorporateExtraInformationInputSchema},
  output: {schema: IncorporateExtraInformationOutputSchema},
  prompt: `You are an expert resume writer. Review the resume summary, job description, skills, and experience and determine if extra information should be added to the resume summary to make it more impactful.

Resume Summary: {{{resumeSummary}}}

Job Description: {{{jobDescription}}}

Skills: {{#each skills}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Experience: {{{experience}}}

Suggest extra information to incorporate into the resume summary:`,
});

const incorporateExtraInformationFlow = ai.defineFlow(
  {
    name: 'incorporateExtraInformationFlow',
    inputSchema: IncorporateExtraInformationInputSchema,
    outputSchema: IncorporateExtraInformationOutputSchema,
  },
  async input => {
    const {output} = await incorporateExtraInformationPrompt(input);
    return output!;
  }
);
