"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { getResumeAnalysis, FormState } from "@/app/actions";
import Hero3D from "@/components/hero-3d";
import { ResumeForm } from "@/components/resume-form";
import { AnalysisResults } from "@/components/analysis-results";
import { useToast } from "@/hooks/use-toast";
import { UserMessage } from "@/components/user-message";
import { ScrollArea } from "@/components/ui/scroll-area";

const initialState: FormState = {
  analysis: undefined,
  error: undefined,
};

type Message = {
  id: number;
  role: 'user' | 'ai';
  content: React.ReactNode;
}

export default function Home() {
  const [state, formAction, isPending] = useActionState(getResumeAnalysis, initialState);
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.error) {
      toast({
        title: "Error",
        description: state.error,
        variant: "destructive",
      });
    }
    if (state.analysis) {
        setMessages(prev => [...prev, {
            id: state.timestamp || Date.now(),
            role: 'ai',
            content: <AnalysisResults key={state.timestamp} analysis={state.analysis!} />
        }]);
        formRef.current?.reset();
    }
  }, [state, toast]);

  const handleFormSubmit = (formData: FormData) => {
    const text = formData.get('extraInformation') as string;
    const file = formData.get('resume') as File | null;

    if (!text && (!file || file.size === 0)) {
        toast({
            title: "Input required",
            description: "Please enter a message or upload a resume.",
            variant: "destructive",
        });
        return;
    }

    const userMessageContent = (
      <UserMessage text={text} file={file} />
    );

    setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'user',
        content: userMessageContent
    }]);

    formAction(formData);
  }

  return (
    <>
      <Hero3D />
      <main className="relative flex h-screen flex-col items-center justify-end p-4 sm:p-6 md:p-8 overflow-hidden">
        
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 animate-fade-in-up">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/60">
                Resu<span className="text-primary">AI</span>
              </h1>
              <p className="max-w-2xl text-muted-foreground md:text-xl px-4">
                Upload your resume and let our AI provide you with a professional analysis, career advice, and tailored job recommendations.
              </p>
            </div>
          ) : (
            <ScrollArea className="w-full max-w-4xl h-full flex-1 pointer-events-auto">
                <div className="flex flex-col-reverse gap-4 justify-end py-4">
                    {isPending && messages[messages.length-1].role === 'user' && (
                         <AnalysisResults analysis={undefined} />
                    )}
                    {[...messages].reverse().map((msg) => (
                        <div key={msg.id}>{msg.content}</div>
                    ))}
                </div>
            </ScrollArea>
          )}

        <div className="z-10 w-full max-w-4xl mx-auto pt-6">
          <ResumeForm formAction={handleFormSubmit} formRef={formRef} />
        </div>
      </main>
    </>
  );
}
