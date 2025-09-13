"use client";

import { useState, useRef, ChangeEvent, DragEvent, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { UploadCloud, File, X, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full font-bold" disabled={pending || disabled}>
      {pending ? (
        <>
          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : "Analyze Your Resume"}
    </Button>
  );
}

export function ResumeForm({ formAction }: { formAction: (payload: FormData) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { pending } = useFormStatus();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (pending) {
      setUploadProgress(0);
      interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return prev;
          }
          return prev + 5;
        });
      }, 200);
    } else {
        if (uploadProgress > 0) {
            setUploadProgress(100);
            setTimeout(() => setUploadProgress(0), 1000);
        }
    }
    return () => clearInterval(interval);
  }, [pending, uploadProgress]);
  
  const handleFileChange = (selectedFile: File | null) => {
    if (selectedFile) {
        if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
            toast({
                title: "File too large",
                description: "Please upload a file smaller than 5MB.",
                variant: "destructive",
            });
            return;
        }
        if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'].includes(selectedFile.type)) {
            toast({
                title: "Invalid file type",
                description: "Please upload a PDF, DOC, DOCX, or TXT file.",
                variant: "destructive",
            });
            return;
        }
        setFile(selectedFile);
    }
  };

  const onFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e.target.files?.[0] ?? null);
  };
  
  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files?.[0] ?? null);
  };

  const removeFile = () => {
    setFile(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  return (
    <form action={formAction} className="w-full space-y-6">
        <div 
          className={cn(
            "relative flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-xl transition-colors duration-300",
            isDragging ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
          )}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input type="file" name="resume" ref={fileInputRef} className="hidden" onChange={onFileSelect} accept=".pdf,.doc,.docx,.txt" required/>
          {file ? (
            <div className="text-center">
                <File className="mx-auto h-12 w-12 text-primary" />
                <p className="mt-2 font-medium text-foreground">{file.name}</p>
                <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                <button type="button" onClick={(e) => { e.stopPropagation(); removeFile(); }} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
                    <X className="h-5 w-5" />
                </button>
            </div>
          ) : (
            <div className="text-center cursor-pointer">
              <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 font-semibold text-foreground">Drag & drop your resume here</p>

              <p className="text-sm text-muted-foreground">or click to browse</p>
              <p className="mt-4 text-xs text-muted-foreground">PDF, DOC, DOCX, TXT (max 5MB)</p>
            </div>
          )}
        </div>

        {(pending || (uploadProgress > 0 && uploadProgress < 100)) && file && (
            <div className="space-y-2">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-center text-muted-foreground">
                    {pending ? `Analyzing ${file.name}...` : `Analyzed ${file.name}!`}
                </p>
            </div>
        )}

        <div>
            <label htmlFor="extraInformation" className="block text-sm font-medium text-foreground mb-2">Any specific goals or roles you're targeting?</label>
            <Textarea
                id="extraInformation"
                name="extraInformation"
                placeholder="e.g., 'I want to transition into a product manager role in the tech industry.'"
                className="bg-background/80"
                rows={3}
            />
        </div>
        
        <SubmitButton disabled={!file}/>
    </form>
  );
}
