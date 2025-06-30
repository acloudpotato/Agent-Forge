"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type Step, type StepStatus } from "@/lib/types";
import { Loader2, CheckCircle2, Circle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const statusIcons: Record<StepStatus, React.ReactNode> = {
  pending: <Circle className="h-6 w-6 text-muted-foreground" />,
  "in-progress": <Loader2 className="h-6 w-6 animate-spin text-primary" />,
  completed: <CheckCircle2 className="h-6 w-6 text-green-500" />,
  failed: <XCircle className="h-6 w-6 text-destructive" />,
};

type AgentStatusProps = {
  steps: Step[];
};

export default function AgentStatus({ steps }: AgentStatusProps) {
  return (
    <Card className="shadow-2xl shadow-primary/10">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-headline">
          Building Your Agent
        </CardTitle>
        <CardDescription className="text-lg">
          Please wait a moment while we set everything up for you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className={cn(
                "flex items-start space-x-4 p-4 rounded-lg transition-all duration-300",
                step.status === "in-progress" && "bg-primary/5",
                step.status === "completed" && "bg-green-500/5"
              )}
            >
              <div className="flex-shrink-0 mt-1">{statusIcons[step.status]}</div>
              <div className="flex-grow">
                <p
                  className={cn(
                    "font-medium",
                    step.status === "pending" && "text-muted-foreground"
                  )}
                >
                  {step.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
