'use server';

/**
 * @fileOverview A flow that suggests additional features for an agent based on the user-provided prompt.
 *
 * - suggestAdditionalFeatures - A function that suggests additional features for the agent.
 * - SuggestAdditionalFeaturesInput - The input type for the suggestAdditionalFeatures function.
 * - SuggestAdditionalFeaturesOutput - The return type for the suggestAdditionalFeatures function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestAdditionalFeaturesInputSchema = z.object({
  agentPrompt: z.string().describe('The user-provided prompt describing the desired AI agent.'),
});

export type SuggestAdditionalFeaturesInput = z.infer<typeof SuggestAdditionalFeaturesInputSchema>;

const SuggestAdditionalFeaturesOutputSchema = z.object({
  suggestedFeatures: z
    .array(z.string())
    .describe('A list of suggested additional features for the agent.'),
});

export type SuggestAdditionalFeaturesOutput = z.infer<typeof SuggestAdditionalFeaturesOutputSchema>;

export async function suggestAdditionalFeatures(
  input: SuggestAdditionalFeaturesInput
): Promise<SuggestAdditionalFeaturesOutput> {
  return suggestAdditionalFeaturesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestAdditionalFeaturesPrompt',
  input: {schema: SuggestAdditionalFeaturesInputSchema},
  output: {schema: SuggestAdditionalFeaturesOutputSchema},
  prompt: `You are an AI assistant that suggests additional features for an AI agent based on the user-provided prompt. The output should be a JSON array of strings, each string should be a suggested feature. Focus on features that enhances agents functionality.

  User Prompt: {{{agentPrompt}}}`,
});

const suggestAdditionalFeaturesFlow = ai.defineFlow(
  {
    name: 'suggestAdditionalFeaturesFlow',
    inputSchema: SuggestAdditionalFeaturesInputSchema,
    outputSchema: SuggestAdditionalFeaturesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
