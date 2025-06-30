"use client";

import { useState, useEffect } from "react";
import AgentForgeForm from "@/components/agent-forge-form";
import AgentStatus from "@/components/agent-status";
import AgentDetails from "@/components/agent-details";
import FeatureSuggestions from "@/components/feature-suggestions";
import { suggestAdditionalFeatures } from "@/ai/flows/suggest-additional-features";
import { createAgent } from "@/app/actions";
import type { Step, AgentDetailsData } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const initialSteps: Step[] = [
  {
    name: "Analyzing prompt",
    status: "pending",
    description: "The AI is understanding your requirements.",
  },
  {
    name: "Generating agent profile",
    status: "pending",
    description: "Creating a detailed profile for your new agent.",
  },
  {
    name: "Generating ADK code",
    status: "pending",
    description: "Creating the foundational code for your agent.",
  },
  {
    name: "Creating GitHub repository",
    status: "pending",
    description: "Setting up a new repository for your agent's code.",
  },
  {
    name: "Deploying agent",
    status: "pending",
    description: "Your agent is being deployed and will be available shortly.",
  },
];

export default function Home() {
  const [appState, setAppState] = useState<"form" | "suggesting" | "processing" | "complete">("form");
  const [steps, setSteps] = useState<Step[]>(initialSteps);
  const [prompt, setPrompt] = useState("");
  const [suggestedFeatures, setSuggestedFeatures] = useState<string[]>([]);
  const [agentDetails, setAgentDetails] = useState<AgentDetailsData | null>(null);
  const { toast } = useToast();

  const processAgentCreation = async (finalPrompt: string, finalFeatures: string[]) => {
    setAppState("processing");
    setSteps(initialSteps.map((step, index) => ({
      ...step,
      status: index === 0 ? "in-progress" : "pending",
    })));

    const formData = new FormData();
    formData.append("prompt", finalPrompt);
    formData.append("features", JSON.stringify(finalFeatures));

    // Simulate progress
    const progressInterval = setInterval(() => {
      setSteps(prevSteps => {
        const currentStepIndex = prevSteps.findIndex(s => s.status === "in-progress");
        if (currentStepIndex === -1 || currentStepIndex === prevSteps.length - 1) {
          clearInterval(progressInterval);
          return prevSteps;
        }
        const newSteps = [...prevSteps];
        newSteps[currentStepIndex] = { ...newSteps[currentStepIndex], status: "completed" };
        newSteps[currentStepIndex + 1] = { ...newSteps[currentStepIndex + 1], status: "in-progress" };
        return newSteps;
      });
    }, 1500);

    const result = await createAgent(formData);
    
    clearInterval(progressInterval);

    if (result.success) {
      setAgentDetails(result.data);
      setSteps(prevSteps => prevSteps.map(step => ({ ...step, status: "completed" })));
      setTimeout(() => setAppState("complete"), 1000);
    } else {
      toast({
        variant: "destructive",
        title: "Agent Creation Failed",
        description: result.message,
      });
      setSteps(prevSteps => {
        const currentStepIndex = prevSteps.findIndex(s => s.status === 'in-progress');
        if (currentStepIndex !== -1) {
          const newSteps = [...prevSteps];
          newSteps[currentStepIndex] = {...newSteps[currentStepIndex], status: 'failed'};
          return newSteps;
        }
        return prevSteps;
      });
      setTimeout(handleReset, 2000);
    }
  };

  const handlePromptSubmit = async (submittedPrompt: string) => {
    setPrompt(submittedPrompt);
    try {
      const result = await suggestAdditionalFeatures({ agentPrompt: submittedPrompt });
      if (result && result.suggestedFeatures && result.suggestedFeatures.length > 0) {
        setSuggestedFeatures(result.suggestedFeatures);
        setAppState("suggesting");
        return true;
      }
      // If no suggestions, go straight to creation
      await processAgentCreation(submittedPrompt, []);
      return false; // Prevent form from resetting state
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error getting suggestions",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
      });
      return false;
    }
  };

  const handleAgentCreationStart = (selectedFeatures: string[]) => {
    processAgentCreation(prompt, selectedFeatures);
  };
  
  const handleBackToForm = () => {
    setAppState("form");
    setSuggestedFeatures([]);
  };

  const handleReset = () => {
    setAppState("form");
    setSteps(initialSteps);
    setPrompt("");
    setSuggestedFeatures([]);
    setAgentDetails(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {appState === "form" && (
        <AgentForgeForm onPromptSubmit={handlePromptSubmit} initialPrompt={prompt} />
      )}
      {appState === "suggesting" && (
        <FeatureSuggestions
          prompt={prompt}
          features={suggestedFeatures}
          onFinalSubmit={handleAgentCreationStart}
          onBack={handleBackToForm}
        />
      )}
      {appState === "processing" && <AgentStatus steps={steps} />}
      {appState === "complete" && agentDetails && (
        <AgentDetails details={agentDetails} onReset={handleReset} />
      )}
    </div>
  );
}
