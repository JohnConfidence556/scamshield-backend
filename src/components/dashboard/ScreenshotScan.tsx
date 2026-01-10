import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Image, Scan, Loader2, X } from "lucide-react";
import AnalysisResult from "./AnalysisResult";

const ScreenshotScan = () => {
  const [image, setImage] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [result, setResult] = useState<null | {
    riskLevel: "safe" | "suspicious" | "danger";
    score: number;
    highlights: string[];
    explanation: string[];
    actions: string[];
  }>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFile = (file: File) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        simulateOCR();
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateOCR = async () => {
    setIsExtracting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setExtractedText(
      "URGENT: Your bank account has been compromised!\n\nDear Customer,\n\nWe have detected suspicious activity on your account. To prevent unauthorized access, please verify your identity immediately by clicking the link below:\n\nhttp://secure-bank-verify.suspicious-site.com/verify\n\nFailure to verify within 24 hours will result in account suspension.\n\nBank Security Team"
    );
    setIsExtracting(false);
  };

  const handleAnalyze = async () => {
    if (!extractedText.trim()) return;
    
    setIsAnalyzing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setResult({
      riskLevel: "danger",
      score: 94,
      highlights: [
        "URGENT",
        "bank account has been compromised",
        "verify your identity immediately",
        "suspicious-site.com"
      ],
      explanation: [
        "Creates false sense of urgency to prevent rational decision making",
        "Uses fear tactics about account compromise",
        "Contains suspicious URL that doesn't match legitimate bank domains",
        "Threatens account suspension to pressure immediate action",
        "Generic greeting 'Dear Customer' instead of your actual name"
      ],
      actions: [
        "Do not click any links in this message",
        "Do not provide any personal information",
        "Contact your bank directly using official channels",
        "Report this message as phishing",
        "Block the sender"
      ]
    });
    
    setIsAnalyzing(false);
  };

  const handleReset = () => {
    setImage(null);
    setExtractedText("");
    setResult(null);
  };

  if (result) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Screenshot Analysis</h1>
          <p className="text-muted-foreground">Analysis complete</p>
        </div>
        <AnalysisResult 
          result={result} 
          originalText={extractedText}
          onReset={handleReset}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Screenshot Scan</h1>
        <p className="text-muted-foreground">
          Upload a screenshot of a suspicious message to extract and analyze the text
        </p>
      </div>

      {!image ? (
        <div
          className={`glass-card p-12 rounded-xl border-2 border-dashed transition-all ${
            dragActive 
              ? "border-primary bg-primary/5" 
              : "border-border/50 hover:border-primary/50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Drop your screenshot here</h3>
            <p className="text-muted-foreground mb-4">or click to browse files</p>
            
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
              <Button variant="outline">
                <Image className="w-4 h-4 mr-2" />
                Select Image
              </Button>
            </label>
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Image Preview */}
          <div className="glass-card p-4 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Uploaded Image</h3>
              <Button variant="ghost" size="icon" onClick={handleReset}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="rounded-lg overflow-hidden bg-background/50">
              <img 
                src={image} 
                alt="Uploaded screenshot" 
                className="w-full h-auto max-h-[400px] object-contain"
              />
            </div>
          </div>

          {/* Extracted Text */}
          <div className="glass-card p-4 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Extracted Text</h3>
              {isExtracting && (
                <div className="flex items-center gap-2 text-primary text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Extracting...
                </div>
              )}
            </div>
            
            <Textarea
              value={extractedText}
              onChange={(e) => setExtractedText(e.target.value)}
              placeholder="Text will be extracted automatically..."
              className="min-h-[300px] bg-background/50 border-border/50 resize-none mb-4"
              disabled={isExtracting}
            />
            
            <Button 
              onClick={handleAnalyze} 
              disabled={!extractedText.trim() || isAnalyzing || isExtracting}
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
                  Analyze Extracted Text
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Pipeline Visualization */}
      <div className="glass-card p-6 rounded-xl">
        <h3 className="font-semibold mb-4">Analysis Pipeline</h3>
        <div className="flex items-center justify-between gap-2">
          {[
            { label: "OCR", active: isExtracting, done: !!extractedText },
            { label: "Text Cleanup", active: false, done: !!extractedText },
            { label: "Scam Detection", active: isAnalyzing, done: !!result },
            { label: "Explanation", active: false, done: !!result },
          ].map((step, i) => (
            <div key={step.label} className="flex items-center flex-1">
              <div className={`flex-1 h-2 rounded-full ${
                step.done ? "bg-primary" : step.active ? "bg-primary/50 animate-pulse" : "bg-muted"
              }`} />
              <div className={`text-xs font-medium ml-2 ${
                step.done ? "text-primary" : step.active ? "text-primary" : "text-muted-foreground"
              }`}>
                {step.label}
              </div>
              {i < 3 && <div className="w-4" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScreenshotScan;
