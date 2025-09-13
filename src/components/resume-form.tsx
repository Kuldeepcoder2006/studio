"use client";

import { useState, useRef, ChangeEvent } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, FileText, X, LoaderCircle, ArrowUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="icon" className="rounded-full w-8 h-8" disabled={pending || disabled}>
      {pending ? (
        <LoaderCircle className="h-4 w-4 animate-spin" />
      ) : <ArrowUp className="h-4 w-4" />}
       <span className="sr-only">Analyze Resume</span>
    </Button>
  );
}

export function ResumeForm({ formAction, formRef }: { formAction: (payload: FormData) => void, formRef: React.RefObject<HTMLFormElement> }) {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
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

  const removeFile = () => {
    setFile(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formAction(formData);
    setText("");
    removeFile();
  }
  
  const { pending } = useFormStatus();
  const isSubmitDisabled = (!file && !text.trim()) || pending;

  return (
    <form 
      ref={formRef} 
      onSubmit={handleFormSubmit}
      className="w-full space-y-2 animate-fade-in-up"
      style={{animationDelay: '0.3s', animationFillMode: 'backwards'}}
    >
      {file && (
        <div className="flex items-center justify-between p-2 rounded-lg bg-background/80 border border-border text-sm">
            <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <span className="font-medium text-foreground">{file.name}</span>
                <span className="text-muted-foreground">({(file.size / 1024).toFixed(2)} KB)</span>
            </div>
            <button type="button" onClick={removeFile} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
            </button>
        </div>
      )}

      <div className="relative flex items-center w-full p-2 rounded-2xl bg-card/50 backdrop-blur-md border border-white/10 shadow-2xl">
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          className="flex-shrink-0"
          onClick={() => fileInputRef.current?.click()}
          disabled={pending}
        >
          <Paperclip className="h-5 w-5"/>
          <span className="sr-only">Attach resume</span>
        </Button>
        <input type="file" name="resume" ref={fileInputRef} className="hidden" onChange={onFileSelect} accept=".pdf,.doc,.docx,.txt" />

        <Textarea
            id="extraInformation"
            name="extraInformation"
            placeholder="Ask a question or attach your resume to get started..."
            className="bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 resize-none flex-1 py-2 px-3 h-auto min-h-[2.5rem]"
            rows={1}
            disabled={pending}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (formRef.current && !isSubmitDisabled) {
                  formRef.current.requestSubmit();
                }
              }
            }}
        />

        <SubmitButton disabled={isSubmitDisabled} />
      </div>
    </form>
  );
}
