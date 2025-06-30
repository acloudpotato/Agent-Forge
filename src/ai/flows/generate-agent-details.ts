'use server';
/**
 * @fileOverview Generates detailed information for a new AI agent.
 *
 * - generateAgentDetails - A function that creates a comprehensive profile for an agent.
 * - GenerateAgentDetailsInput - The input type for the generateAgentDetails function.
 * - GenerateAgentDetailsOutput - The return type for the generateAgentDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAgentDetailsInputSchema = z.object({
  prompt: z.string().describe('The core prompt for the agent.'),
  features: z.array(z.string()).describe('A list of additional features to include.'),
});
export type GenerateAgentDetailsInput = z.infer<typeof GenerateAgentDetailsInputSchema>;

const GenerateAgentDetailsOutputSchema = z.object({
  agentName: z.string().describe("A cool and descriptive name for the AI agent."),
  description: z.string().describe("A one-sentence description of the agent's purpose."),
  features: z.array(z.string()).describe("The final list of the agent's features."),
  gettingStarted: z.string().describe("A getting started guide in Markdown format. Include sections for 'Clone the repository', 'Install dependencies', and 'Run the agent' with example commands."),
  metrics: z.array(z.object({
    name: z.string().describe("The name of the metric (e.g., 'Predicted Accuracy')."),
    value: z.string().describe("The value of the metric (e.g., '94.5%').")
  })).describe("A list of 2-3 key performance metrics for the agent."),
  repositoryUrl: z.string().url().describe("A plausible GitHub repository URL for the agent based on its name. e.g. https://github.com/agent-forge-ai/repo-name"),
});
export type GenerateAgentDetailsOutput = z.infer<typeof GenerateAgentDetailsOutputSchema>;

export async function generateAgentDetails(
  input: GenerateAgentDetailsInput
): Promise<GenerateAgentDetailsOutput> {
  return generateAgentDetailsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAgentDetailsPrompt',
  input: {schema: GenerateAgentDetailsInputSchema},
  output: {schema: GenerateAgentDetailsOutputSchema},
  prompt: `You are an AI assistant that creates a profile for a new AI agent based on a prompt and selected features.

Base Prompt: {{{prompt}}}

{{#if features}}
Additional Features:
{{#each features}}
- {{this}}
{{/each}}
{{/if}}

Based on the above, generate a complete profile for this agent. The name should be creative. The getting started guide should be in valid Markdown. The GitHub URL should be plausible and based on the agent's name.
`,
});

const generateAgentDetailsFlow = ai.defineFlow(
  {
    name: 'generateAgentDetailsFlow',
    inputSchema: GenerateAgentDetailsInputSchema,
    outputSchema: GenerateAgentDetailsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
