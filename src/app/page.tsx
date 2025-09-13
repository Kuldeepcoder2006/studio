"use client";

import { useFormState } from "react-dom";
import { getResumeAnalysis, FormState } from "@/app/actions";
import Hero3D from "@/components/hero-3d";
import { ResumeForm } from "@/components/resume-form";
import { AnalysisResults } from "@/components/analysis-results";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const initialState: FormState = {
  analysis: undefined,
  error: undefined,
};

export default function Home() {
  const [state, formAction] = useFormState(getResumeAnalysis, initialState);
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
      <main className="relative flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 overflow-hidden">
        <div className="z-10 flex flex-col items-center w-full space-y-12">
          <div className="text-center space-y-4 animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/60">
              Resu<span className="text-primary">AI</span>
            </h1>
            <p className="max-w-2xl text-muted-foreground md:text-xl">
              Upload your resume and let our AI provide you with a professional analysis, career advice, and tailored job recommendations.
            </p>
          </div>
          
          <div className="w-full max-w-2xl p-6 rounded-2xl bg-card/50 backdrop-blur-md border border-white/10 shadow-2xl animate-fade-in-up" style={{animationDelay: '0.3s', animationFillMode: 'backwards'}}>
              <ResumeForm formAction={formAction} />
          </div>

          {state.analysis && (
            <AnalysisResults key={state.timestamp} analysis={state.analysis} />
          )}
        </div>
      </main>
    </>
  );
}
