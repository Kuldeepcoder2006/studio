"use client"

import type { AnalyzeUploadedResumeOutput } from "@/ai/flows/analyze-uploaded-resume";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThumbsUp, ThumbsDown, BrainCircuit, Briefcase, LoaderCircle } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

type AnalysisSectionProps = {
  title: string;
  content: string;
  icon: React.ReactNode;
  delay: string;
};

const AnalysisSection = ({ title, content, icon, delay }: AnalysisSectionProps) => {
  // Don't render the section if content is missing or just whitespace
  if (!content || content.trim() === '') return null;

  return (
    <Card 
      className="bg-card/50 backdrop-blur-md border-white/10 shadow-lg rounded-2xl transform hover:scale-[1.02] transition-transform duration-300 ease-in-out animate-fade-in-up"
      style={{ animationDelay: delay, animationFillMode: 'backwards' }}
    >
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="p-3 bg-primary/20 rounded-lg text-primary">
          {icon}
        </div>
        <CardTitle className="text-xl font-bold text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
          <div className="text-foreground/80 space-y-2 prose-p:my-0 prose-ul:my-0 prose-li:my-0">
              {content.split(/\n- /).filter(item => item.trim() !== '').map((item, index) => (
                  <p key={index} className="flex items-start">
                      <span className="text-primary mr-3 mt-1 text-lg">•</span>
                      <span>{item.replace(/^- /, '').trim()}</span>
                  </p>
              ))}
          </div>
      </CardContent>
    </Card>
  );
}

const LoadingState = () => (
    <Card 
        className="bg-card/50 backdrop-blur-md border-white/10 shadow-lg rounded-2xl animate-fade-in-up"
    >
        <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
                <LoaderCircle className="h-5 w-5 animate-spin text-primary" />
                <p className="text-foreground/60">Analyzing...</p>
            </div>
            <div className="space-y-3 mt-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[80%]" />
                <Skeleton className="h-4 w-[90%]" />
            </div>
        </CardContent>
    </Card>
)

export function AnalysisResults({ analysis }: { analysis?: AnalyzeUploadedResumeOutput }) {
  if (!analysis) return <LoadingState />;
  
  const isChatbotResponse = !analysis.strengths && !analysis.weaknesses;

  if (isChatbotResponse) {
    return (
        <Card 
            className="bg-card/50 backdrop-blur-md border-white/10 shadow-lg rounded-2xl animate-fade-in-up"
            style={{ animationDelay: '0.1s', animationFillMode: 'backwards' }}
        >
            <CardContent className="pt-6">
            <p className="text-foreground/80 whitespace-pre-wrap">{analysis.careerAdvice}</p>
            </CardContent>
        </Card>
    );
  }


  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
        <AnalysisSection title="Strengths" content={analysis.strengths || ""} icon={<ThumbsUp className="h-6 w-6" />} delay="0.5s" />
        <AnalysisSection title="Weaknesses" content={analysis.weaknesses || ""} icon={<ThumbsDown className="h-6 w-6" />} delay="0.7s" />
        <AnalysisSection title="Career Advice" content={analysis.careerAdvice} icon={<BrainCircuit className="h-6 w-6" />} delay="0.9s" />
        <AnalysisSection title="Job Recommendations" content={analysis.jobRecommendations || ""} icon={<Briefcase className="h-6 w-6" />} delay="1.1s" />
    </div>
  );
}
