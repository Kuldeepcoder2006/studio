"use client"

import type { AnalyzeUploadedResumeOutput } from "@/ai/flows/analyze-uploaded-resume";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown, BrainCircuit, Briefcase } from "lucide-react";

type AnalysisSectionProps = {
  title: string;
  content: string;
  icon: React.ReactNode;
  delay: string;
};

const AnalysisSection = ({ title, content, icon, delay }: AnalysisSectionProps) => (
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
      <div className="text-foreground/80 whitespace-pre-line space-y-2">
        {content.split('\n').map((line, index) => (
          <p key={index}>{line.replace(/^- /, '• ')}</p>
        ))}
      </div>
    </CardContent>
  </Card>
);

export function AnalysisResults({ analysis }: { analysis: AnalyzeUploadedResumeOutput }) {
  if (!analysis) return null;

  return (
    <div className="w-full max-w-6xl mx-auto py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnalysisSection title="Strengths" content={analysis.strengths} icon={<ThumbsUp className="h-6 w-6" />} delay="0.5s" />
            <AnalysisSection title="Weaknesses" content={analysis.weaknesses} icon={<ThumbsDown className="h-6 w-6" />} delay="0.7s" />
        </div>
        <AnalysisSection title="Career Advice" content={analysis.careerAdvice} icon={<BrainCircuit className="h-6 w-6" />} delay="0.9s" />
        <AnalysisSection title="Job Recommendations" content={analysis.jobRecommendations} icon={<Briefcase className="h-6 w-6" />} delay="1.1s" />
    </div>
  );
}
