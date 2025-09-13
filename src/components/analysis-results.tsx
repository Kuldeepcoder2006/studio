"use client"

import type { AnalyzeUploadedResumeOutput } from "@/ai/flows/analyze-uploaded-resume";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThumbsUp, ThumbsDown, BrainCircuit, Briefcase } from "lucide-react";

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

export function AnalysisResults({ analysis }: { analysis: AnalyzeUploadedResumeOutput }) {
  if (!analysis) return null;
  
  const isChatbotResponse = !analysis.strengths && !analysis.weaknesses;

  if (isChatbotResponse) {
    return (
       <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center p-4 sm:p-6 md:p-8 pointer-events-none">
         <ScrollArea className="w-full max-w-4xl h-full pointer-events-auto">
          <div className="flex flex-col justify-center h-full py-8">
            <Card 
              className="bg-card/50 backdrop-blur-md border-white/10 shadow-lg rounded-2xl transform transition-transform duration-300 ease-in-out animate-fade-in-up"
              style={{ animationDelay: '0.5s', animationFillMode: 'backwards' }}
            >
              <CardContent className="pt-6">
                <p className="text-foreground/80">{analysis.careerAdvice}</p>
              </CardContent>
            </Card>
          </div>
         </ScrollArea>
       </div>
    );
  }


  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-between items-center p-4 sm:p-6 md:p-8 pointer-events-none">
      <ScrollArea className="w-[45%] max-w-2xl h-full pointer-events-auto">
        <div className="space-y-8 py-8">
            <AnalysisSection title="Strengths" content={analysis.strengths || ""} icon={<ThumbsUp className="h-6 w-6" />} delay="0.5s" />
            <AnalysisSection title="Career Advice" content={analysis.careerAdvice} icon={<BrainCircuit className="h-6 w-6" />} delay="0.9s" />
        </div>
      </ScrollArea>
      <ScrollArea className="w-[45%] max-w-2xl h-full pointer-events-auto">
        <div className="space-y-8 py-8">
            <AnalysisSection title="Weaknesses" content={analysis.weaknesses || ""} icon={<ThumbsDown className="h-6 w-6" />} delay="0.7s" />
            <AnalysisSection title="Job Recommendations" content={analysis.jobRecommendations || ""} icon={<Briefcase className="h-6 w-6" />} delay="1.1s" />
        </div>
      </ScrollArea>
    </div>
  );
}
