import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Scan, Loader2 } from "lucide-react";
import AnalysisResult from "./AnalysisResult";

const QuickScan = () => {
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<null | {
    riskLevel: "safe" | "suspicious" | "danger";
    score: number;
    highlights: string[];
    explanation: string[];
    actions: string[];
  }>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Demo result based on content
    const isSuspicious = text.toLowerCase().includes("urgent") || 
                         text.toLowerCase().includes("click") ||
                         text.toLowerCase().includes("verify") ||
                         text.toLowerCase().includes("account");
    
    const isDanger = text.toLowerCase().includes("password") ||
                     text.toLowerCase().includes("ssn") ||
                     text.toLowerCase().includes("bank");

    setResult({
      riskLevel: isDanger ? "danger" : isSuspicious ? "suspicious" : "safe",
      score: isDanger ? 92 : isSuspicious ? 65 : 15,
      highlights: isDanger 
        ? ["password", "bank", "verify immediately"]
        : isSuspicious 
          ? ["urgent action required", "click here", "verify your account"]
          : [],
      explanation: isDanger
        ? [
            "Requests sensitive financial information",
            "Creates artificial urgency to bypass rational thinking",
            "Contains suspicious link patterns"
          ]
        : isSuspicious
          ? [
              "Uses urgency tactics common in phishing attempts",
              "Contains call-to-action phrases typical of scams",
              "May be attempting to harvest credentials"
            ]
          : [
              "No suspicious patterns detected",
              "Message appears to be legitimate",
              "No urgent action requests found"
            ],
      actions: isDanger
        ? ["Do not respond", "Block sender", "Report as phishing"]
        : isSuspicious
          ? ["Verify sender identity", "Do not click links", "Contact organization directly"]
          : ["No action needed", "Message appears safe"]
    });
    
    setIsAnalyzing(false);
  };

  const handleReset = () => {
    setText("");
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Quick Scan</h1>
        <p className="text-muted-foreground">
          Paste a suspicious message or email to analyze for potential scams
        </p>
      </div>

      {!result ? (
        <div className="glass-card p-6 rounded-xl">
          <Textarea
            placeholder="Paste the suspicious message here..."
            className="min-h-[200px] bg-background/50 border-border/50 resize-none mb-4"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          
          <Button 
            onClick={handleAnalyze} 
            disabled={!text.trim() || isAnalyzing}
            variant="hero"
            size="lg"
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Scan className="w-5 h-5" />
                Analyze Message
              </>
            )}
          </Button>
        </div>
      ) : (
        <AnalysisResult 
          result={result} 
          originalText={text}
          onReset={handleReset}
        />
      )}
    </div>
  );
};

export default QuickScan;
