export type StepStatus = "pending" | "in-progress" | "completed" | "failed";

export type Step = {
  name: string;
  status: StepStatus;
  description: string;
};

export type AgentDetailsData = {
  agentName: string;
  description: string;
  gettingStarted: string;
  features: string[];
  metrics: {
    name: string;
    value: string;
  }[];
  repositoryUrl: string;
};
