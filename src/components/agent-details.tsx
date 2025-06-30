"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rocket, Github, RefreshCw, BarChart, CheckCircle, BookOpenText } from "lucide-react";
import type { AgentDetailsData } from "@/lib/types";

type AgentDetailsProps = {
  details: AgentDetailsData;
  onReset: () => void;
};

// A simple component to render markdown-like text
const SimpleMarkdown = ({ content }: { content: string }) => {
  const lines = content.split('\n');
  const elements = [];
  let isCodeBlock = false;
  let codeContent = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('```')) {
      if (isCodeBlock) {
        elements.push(<pre key={`code-${i}`}><code>{codeContent.trim()}</code></pre>);
        codeContent = '';
      }
      isCodeBlock = !isCodeBlock;
      continue;
    }

    if (isCodeBlock) {
      codeContent += line + '\n';
      continue;
    }

    if (line.startsWith('### ')) {
      elements.push(<h3 key={i}>{line.substring(4)}</h3>);
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={i}>{line.substring(3)}</h2>);
    } else if (line.startsWith('# ')) {
      elements.push(<h1 key={i}>{line.substring(2)}</h1>);
    } else if (line.startsWith('- ')) {
      // This handles simple lists. More complex logic would be needed for nested lists.
      const listItems = [line.substring(2)];
      while(i + 1 < lines.length && lines[i+1].startsWith('- ')){
        i++;
        listItems.push(lines[i].substring(2));
      }
      elements.push(
        <ul key={i}>
          {listItems.map((item, itemIndex) => <li key={itemIndex}>{item}</li>)}
        </ul>
      );
    } else if (line.trim() !== '') {
      elements.push(<p key={i}>{line}</p>);
    }
  }

  if (isCodeBlock && codeContent) {
    elements.push(<pre key="code-final"><code>{codeContent.trim()}</code></pre>);
  }

  return <div className="prose prose-sm dark:prose-invert">{elements}</div>;
};

export default function AgentDetails({ details, onReset }: AgentDetailsProps) {
  const { agentName, description, gettingStarted, features, metrics, repositoryUrl } = details;
  
  return (
    <Card className="w-full max-w-4xl shadow-2xl shadow-primary/10 animate-in fade-in-50 duration-500">
      <CardHeader className="text-center">
        <div className="mx-auto bg-primary/10 p-3 rounded-full mb-4">
            <Rocket className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-3xl font-headline">{agentName}</CardTitle>
        <CardDescription className="text-lg">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 p-6 rounded-lg border bg-secondary/50">
            <h3 className="font-semibold text-xl mb-4 flex items-center"><BookOpenText className="mr-3 h-6 w-6 text-accent" /> Getting Started</h3>
            <SimpleMarkdown content={gettingStarted} />
          </div>

          <div className="space-y-6">
              <div className="space-y-4 p-4 rounded-lg border bg-secondary/50">
                <h3 className="font-semibold text-lg flex items-center"><BarChart className="mr-2 h-5 w-5 text-accent" /> Key Metrics</h3>
                <div className="grid grid-cols-1 gap-4 text-center">
                  {metrics.map((metric, index) => (
                    <div key={index} className="bg-background p-3 rounded-md">
                      <p className="text-sm text-muted-foreground">{metric.name}</p>
                      <p className="text-xl font-bold text-primary">{metric.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 p-4 rounded-lg border bg-secondary/50">
                 <h3 className="font-semibold text-lg flex items-center"><CheckCircle className="mr-2 h-5 w-5 text-accent" /> Features</h3>
                 <ul className="list-inside list-disc space-y-1 pl-2">
                  {features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                  ))}
                 </ul>
              </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col sm:flex-row gap-2 pt-6">
        <Button asChild className="w-full sm:w-auto">
          <a href={repositoryUrl} target="_blank" rel="noopener noreferrer">
            <Github className="mr-2 h-4 w-4" />
            View on GitHub
          </a>
        </Button>
        <Button variant="outline" onClick={onReset} className="w-full sm:w-auto">
          <RefreshCw className="mr-2 h-4 w-4" />
          Create Another Agent
        </Button>
      </CardFooter>
    </Card>
  );
}
