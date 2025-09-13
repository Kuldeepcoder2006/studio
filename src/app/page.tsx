"use client";

import { useActionState } from "react";
import { getResumeAnalysis, FormState } from "@/app/actions";
import Hero3D from "@/components/hero-3d";
import { ResumeForm } from "@/components/resume-form";
import { AnalysisResults } from "@/components/analysis-results";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

const initialState: FormState = {
  analysis: undefined,
  error: undefined,
};

export default function Home() {
  const [state, formAction] = useActionState(getResumeAnalysis, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.error) {
      toast({
        title: "Error",
        description: state.error,
        variant: "destructive",
      });
    }
  }, [state, toast]);

  return (
    <>
      <Hero3D />
      <main className="relative flex h-screen flex-col items-center justify-between p-4 sm:p-6 md:p-8 overflow-hidden">
        
          {state.analysis ? (
            <ScrollArea className="w-full h-full">
              <AnalysisResults key={state.timestamp} analysis={state.analysis} />
            </ScrollArea>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 animate-fade-in-up">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/60">
                Resu<span className="text-primary">AI</span>
              </h1>
              <p className="max-w-2xl text-muted-foreground md:text-xl px-4">
                Upload your resume and let our AI provide you with a professional analysis, career advice, and tailored job recommendations.
              </p>
            </div>
          )}

        <div className="z-10 w-full max-w-4xl mx-auto pt-6">
          <ResumeForm formAction={formAction} />
        </div>
      </main>
    </>
  );
}
