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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react";

const formSchema = z.object({
  features: z.array(z.string()).optional(),
});

type FeatureSuggestionsProps = {
  prompt: string;
  features: string[];
  onFinalSubmit: (selectedFeatures: string[]) => void;
  onBack: () => void;
};

export default function FeatureSuggestions({ prompt, features, onFinalSubmit, onBack }: FeatureSuggestionsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      features: [],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    onFinalSubmit(values.features || []);
  }

  return (
    <Card className="shadow-2xl shadow-primary/10">
      <CardHeader>
        <div className="flex items-start gap-4">
          <Button variant="outline" size="icon" onClick={!isSubmitting ? onBack : undefined} className="flex-shrink-0 mt-1" disabled={isSubmitting}>
             <ArrowLeft className="h-4 w-4" />
             <span className="sr-only">Back</span>
          </Button>
          <div>
            <CardTitle className="text-3xl font-headline">Enhance Your Agent</CardTitle>
            <CardDescription className="text-lg">
              We've suggested some additional features. Select any you'd like to include.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <div className="mb-6 p-4 bg-muted rounded-lg border">
              <p className="font-semibold text-sm mb-2 text-foreground/80">Your prompt:</p>
              <p className="text-muted-foreground text-sm">{prompt}</p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Suggested Features</h3>
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <FormField
                    key={index}
                    control={form.control}
                    name="features"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 hover:bg-accent/10 transition-colors">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(feature)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...(field.value || []), feature])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== feature
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal cursor-pointer text-sm w-full">
                          {feature}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-6">
            <Button type="submit" className="w-full text-lg py-6" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-5 w-5" />
              )}
              {isSubmitting ? "Creating Agent..." : "Create My Agent"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
