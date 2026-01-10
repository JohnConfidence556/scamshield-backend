import { Button } from "@/components/ui/button";
import { ShieldCheck, ShieldAlert, ShieldX, AlertCircle, CheckCircle, RefreshCw, Download } from "lucide-react";

interface AnalysisResultProps {
  result: {
    riskLevel: "safe" | "suspicious" | "danger";
    score: number;
    highlights: string[];
    explanation: string[];
    actions: string[];
  };
  originalText: string;
  onReset: () => void;
}

const riskConfig = {
  safe: {
    icon: ShieldCheck,
    label: "Safe",
    color: "text-success",
    bg: "bg-success/10",
    border: "border-success/30",
    description: "This message appears to be legitimate",
  },
  suspicious: {
    icon: ShieldAlert,
    label: "Suspicious",
    color: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/30",
    description: "This message contains some red flags",
  },
  danger: {
    icon: ShieldX,
    label: "High Risk",
    color: "text-destructive",
    bg: "bg-destructive/10",
    border: "border-destructive/30",
    description: "This message is likely a scam or phishing attempt",
  },
};

const AnalysisResult = ({ result, originalText, onReset }: AnalysisResultProps) => {
  const config = riskConfig[result.riskLevel];
  const Icon = config.icon;

  const highlightText = (text: string, highlights: string[]) => {
    if (highlights.length === 0) return text;
    
    let highlighted = text;
    highlights.forEach(phrase => {
      const regex = new RegExp(`(${phrase})`, 'gi');
      highlighted = highlighted.replace(
        regex, 
        `<mark class="${config.bg} ${config.color} px-1 rounded">\$1</mark>`
      );
    });
    return highlighted;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Risk Level Card */}
      <div className={`glass-card p-6 rounded-xl border ${config.border}`}>
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-xl ${config.bg} flex items-center justify-center`}>
            <Icon className={`w-8 h-8 ${config.color}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h2 className={`text-2xl font-bold ${config.color}`}>{config.label}</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.color}`}>
                {result.score}% Risk Score
              </span>
            </div>
            <p className="text-muted-foreground">{config.description}</p>
          </div>
        </div>
      </div>

      {/* Original Text with Highlights */}
      {result.highlights.length > 0 && (
        <div className="glass-card p-6 rounded-xl">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-primary" />
            Highlighted Concerns
          </h3>
          <div 
            className="bg-background/50 p-4 rounded-lg text-sm leading-relaxed whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: highlightText(originalText, result.highlights) }}
          />
        </div>
      )}

      {/* Explanation */}
      <div className="glass-card p-6 rounded-xl">
        <h3 className="font-semibold mb-4">Why This Was Flagged</h3>
        <ul className="space-y-3">
          {result.explanation.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                result.riskLevel === "safe" ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
              }`}>
                {result.riskLevel === "safe" ? (
                  <CheckCircle className="w-3 h-3" />
                ) : (
                  <AlertCircle className="w-3 h-3" />
                )}
              </div>
              <span className="text-muted-foreground">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Recommended Actions */}
      <div className="glass-card p-6 rounded-xl">
        <h3 className="font-semibold mb-4">Recommended Actions</h3>
        <div className="flex flex-wrap gap-3">
          {result.actions.map((action, index) => (
            <span 
              key={index}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                result.riskLevel === "safe" 
                  ? "bg-success/10 text-success border border-success/20" 
                  : result.riskLevel === "suspicious"
                    ? "bg-warning/10 text-warning border border-warning/20"
                    : "bg-destructive/10 text-destructive border border-destructive/20"
              }`}
            >
              {action}
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button onClick={onReset} variant="outline" className="flex-1">
          <RefreshCw className="w-4 h-4 mr-2" />
          Scan Another Message
        </Button>
        <Button variant="glass">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>
    </div>
  );
};

export default AnalysisResult;
