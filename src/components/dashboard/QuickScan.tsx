import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Scan, Loader2 } from "lucide-react";
import AnalysisResult from "./AnalysisResult";
// 1. IMPORT THE SAVE FUNCTION
import { saveScan } from "@/lib/storage";

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
    
    try {
      const response = await fetch('https://scamshield-api-mf08.onrender.com/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text }),
      });

      if (!response.ok) {
        throw new Error("Failed to connect to AI");
      }

      const data = await response.json();

      let uiRiskLevel: "safe" | "suspicious" | "danger" = "safe";
      if (data.status === "High Risk") uiRiskLevel = "danger";
      else if (data.status === "Low Risk") uiRiskLevel = "suspicious";

      const aiExplanations = [data.advice];
      if (data.keywords && data.keywords.length > 0) {
        aiExplanations.push(`Triggers found: "${data.keywords.join(", ")}"`);
      }

      setResult({
        riskLevel: uiRiskLevel,
        score: data.score,
        highlights: data.keywords || [],
        explanation: aiExplanations,
        actions: uiRiskLevel === "danger" 
          ? ["Block the sender", "Do not click links", "Report as spam"] 
          : uiRiskLevel === "suspicious"
          ? ["Verify with sender", "Don't share codes", "Proceed carefully"]
          : ["No action needed", "Message is safe"]
      });

      // 2. ADD THIS BLOCK: Save to History
      saveScan({
        text: text,
        riskLevel: uiRiskLevel,
        score: data.score,
        type: "text" // This tells History it was a text scan
      });

    } catch (error) {
      console.error("Error:", error);
      alert("⚠️ Error: Check if your Python backend (main.py) is running!");
    } finally {
      setIsAnalyzing(false);
    }
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
          Paste a suspicious message or email to analyze for potential scams.
        </p>
      </div>

      {!result ? (
        <div className="glass-card p-6 rounded-xl border border-white/10">
          <Textarea
            placeholder="Paste text here (e.g. 'Your BVN is blocked...')"
            className="min-h-[200px] bg-background/50 resize-none mb-4"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          
          <Button 
            onClick={handleAnalyze} 
            disabled={!text.trim() || isAnalyzing}
            variant="default" 
            size="lg"
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Analyzing...
              </>
            ) : (
              <>
                <Scan className="w-5 h-5 mr-2" />
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