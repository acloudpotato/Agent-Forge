"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Wand2, Loader2 } from "lucide-react";
import Logo from "./logo";

const formSchema = z.object({
  prompt: z.string().min(20, {
    message: "Please describe your agent in at least 20 characters.",
  }).max(1000, {
    message: "Prompt must not be longer than 1000 characters.",
  }),
});

type AgentForgeFormProps = {
  onPromptSubmit: (prompt: string) => Promise<boolean>;
  initialPrompt: string;
};

export default function AgentForgeForm({ onPromptSubmit, initialPrompt }: AgentForgeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: initialPrompt || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const success = await onPromptSubmit(values.prompt);
    if (!success) {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="shadow-2xl shadow-primary/20">
      <CardHeader className="text-center">
        <div className="mx-auto bg-secondary p-3 rounded-full mb-4">
            <Logo className="h-8 w-8" />
        </div>
        <CardTitle className="text-3xl font-headline">Let's build your AI Agent</CardTitle>
        <CardDescription className="text-lg">
          Start by describing what you want your agent to do.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Agent Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., An AI agent that analyzes customer feedback from social media and summarizes the daily sentiment."
                      className="min-h-[120px] resize-none text-base p-4"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full text-lg py-6" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-5 w-5" />
              )}
              {isSubmitting ? "Analyzing..." : "Forge Agent"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
