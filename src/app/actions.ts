'use server';

import { z } from 'zod';
import { generateAgentDetails } from '@/ai/flows/generate-agent-details';
import { createSession, deleteSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

const createAgentSchema = z.object({
  prompt: z.string().min(10, { message: 'Prompt must be at least 10 characters long.' }),
  features: z.array(z.string()).optional(),
});

export async function createAgent(formData: FormData) {
  const promptData = {
    prompt: formData.get('prompt') as string,
    features: JSON.parse(formData.get('features') as string || '[]'),
  };

  const validatedFields = createAgentSchema.safeParse(promptData);

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Invalid prompt. Please provide a more detailed description.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  
  const { prompt, features = [] } = validatedFields.data;

  try {
    const agentDetails = await generateAgentDetails({ prompt, features });
    
    // Simulate other backend processes (code gen, GitHub, etc.)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return { success: true, data: agentDetails };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { 
      success: false,
      message: `Failed to create agent: ${errorMessage}`,
    };
  }
}

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export async function login(prevState: any, formData: FormData) {
  const validatedFields = loginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email } = validatedFields.data;
  
  try {
    await createSession(email);
  } catch (e) {
     return {
      success: false,
      message: "An unexpected error occurred during login."
    };
  }
  
  return { success: true };
}

export async function logout() {
  await deleteSession();
  redirect('/login');
}
