import { useState, useCallback, useRef } from "react";
import Tesseract from 'tesseract.js';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Image, Scan, Loader2, X } from "lucide-react";
import AnalysisResult from "./AnalysisResult";
// Import the storage function
import { saveScan } from "@/lib/storage";

const ScreenshotScan = () => {
  const [image, setImage] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  // Ref for the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        performOCR(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const performOCR = async (file: File) => {
    setIsExtracting(true);
    setExtractedText(""); 
    
    try {
      const worker = await Tesseract.createWorker('eng');
      const ret = await worker.recognize(file);
      setExtractedText(ret.data.text);
      await worker.terminate();
    } catch (error) {
      console.error("OCR Failed:", error);
      setExtractedText("Error reading image. Please type text manually.");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleAnalyze = async () => {
    if (!extractedText.trim()) return;
    
    setIsAnalyzing(true);
    
    try {
      const response = await fetch('http://127.0.0.1:8080/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: extractedText }),
      });

      if (!response.ok) throw new Error("AI Connection Failed");

      const data = await response.json();

      let uiRiskLevel: "safe" | "suspicious" | "danger" = "safe";
      if (data.status === "High Risk") uiRiskLevel = "danger";
      else if (data.status === "Low Risk") uiRiskLevel = "suspicious";

      const aiExplanations = [data.advice];
      if (data.keywords && data.keywords.length > 0) {
        aiExplanations.push(`Detected Triggers: "${data.keywords.join(", ")}"`);
      }

      setResult({
        riskLevel: uiRiskLevel,
        score: data.score,
        highlights: data.keywords || [],
        explanation: aiExplanations,
        actions: uiRiskLevel === "danger" 
          ? ["Block sender", "Do not click links", "Report Image"] 
          : uiRiskLevel === "suspicious"
          ? ["Verify source", "Check for typos", "Don't scan QR codes"]
          : ["No action needed", "Image text appears safe"]
      });

      // --- NEW: Save to History ---
      saveScan({
        text: extractedText,
        riskLevel: uiRiskLevel,
        score: data.score,
        type: "image"
      });

    } catch (error) {
      console.error("Analysis Error:", error);
      alert("⚠️ Backend Error: Ensure main.py is running!");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setExtractedText("");
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
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
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            
            <Button 
              variant="default" 
              onClick={handleButtonClick}
              className="cursor-pointer"
            >
              <Image className="w-4 h-4 mr-2" />
              Select Image
            </Button>
            
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
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

          <div className="glass-card p-4 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Extracted Text</h3>
              {isExtracting && (
                <div className="flex items-center gap-2 text-primary text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Reading Text...
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
                  Analyze Extracted Text
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      <div className="glass-card p-6 rounded-xl">
        <h3 className="font-semibold mb-4">Analysis Pipeline</h3>
        <div className="flex items-center justify-between gap-2">
          {[
            { label: "OCR Scan", active: isExtracting, done: !!extractedText },
            { label: "Text Cleanup", active: false, done: !!extractedText },
            { label: "AI Model", active: isAnalyzing, done: !!result },
            { label: "Risk Assessment", active: false, done: !!result },
          ].map((step, i) => (
            <div key={step.label} className="flex items-center flex-1">
              <div className={`flex-1 h-2 rounded-full transition-all duration-500 ${
                step.done ? "bg-cyan-500" : step.active ? "bg-cyan-500/50 animate-pulse" : "bg-muted"
              }`} />
              <div className={`text-xs font-medium ml-2 ${
                step.done ? "text-cyan-500" : step.active ? "text-cyan-500" : "text-muted-foreground"
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