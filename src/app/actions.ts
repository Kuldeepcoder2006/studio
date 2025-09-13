"use server";

import { analyzeUploadedResume, AnalyzeUploadedResumeOutput } from "@/ai/flows/analyze-uploaded-resume";

export interface FormState {
  analysis?: AnalyzeUploadedResumeOutput;
  error?: string;
  timestamp?: number;
}

const fileToDataUri = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return `data:${file.type};base64,${buffer.toString("base64")}`;
};

export async function getResumeAnalysis(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const resumeFile = formData.get("resume") as File | null;
  const extraInformation = formData.get("extraInformation") as string;

  if ((!resumeFile || resumeFile.size === 0) && !extraInformation) {
    return { error: "Please upload a resume or ask a question." };
  }

  let resumeDataUri: string | undefined = undefined;

  if (resumeFile && resumeFile.size > 0) {
    // File type and size validation
    if (resumeFile.size > 5 * 1024 * 1024) { // 5MB limit
        return { error: "File is too large. Please upload a file smaller than 5MB." };
    }
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!allowedTypes.includes(resumeFile.type)) {
        return { error: "Invalid file type. Please upload a PDF, DOC, DOCX, or TXT file." };
    }
    resumeDataUri = await fileToDataUri(resumeFile);
  }


  try {
    const analysis = await analyzeUploadedResume({
      resumeDataUri,
      extraInformation,
    });
    
    return { analysis, timestamp: Date.now() };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
    return { error: `Analysis failed: ${errorMessage}` };
  }
}
