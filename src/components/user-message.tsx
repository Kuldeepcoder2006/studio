import { Card, CardContent } from "@/components/ui/card";
import { FileText, User } from "lucide-react";

export function UserMessage({ text, file }: { text?: string, file?: File | null }) {
  return (
    <div className="flex items-start gap-4 animate-fade-in-up">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
            <User className="w-5 h-5" />
        </div>
        <Card className="flex-1 bg-card/30 backdrop-blur-sm border-white/5 shadow-md">
            <CardContent className="pt-6">
                {text && <p className="text-foreground/90 whitespace-pre-wrap">{text}</p>}
                {file && file.size > 0 && (
                     <div className="mt-2 flex items-center justify-between p-2 rounded-lg bg-background/50 border border-border text-sm">
                        <div className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            <span className="font-medium text-foreground">{file.name}</span>
                            <span className="text-muted-foreground">({(file.size / 1024).toFixed(2)} KB)</span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
