import { useEffect, useState } from "react";
import { Search, Trash2, AlertTriangle, CheckCircle, ShieldAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getScans, clearHistory, ScanRecord } from "@/lib/storage";

const ScanHistory = () => {
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Load real data when page opens
  useEffect(() => {
    setScans(getScans());
  }, []);

  const handleClear = () => {
    if (confirm("Are you sure you want to clear all history?")) {
      clearHistory();
      setScans([]);
    }
  };

  // Filter functionality
  const filteredScans = scans.filter(scan => 
    scan.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper to format date "2 minutes ago"
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Scan History</h1>
          <p className="text-muted-foreground">
            View your previous analysis results
          </p>
        </div>
        {scans.length > 0 && (
          <Button variant="destructive" size="sm" onClick={handleClear}>
            <Trash2 className="w-4 h-4 mr-2" />
            Clear History
          </Button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search history..."
          className="pl-10 bg-background/50"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredScans.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            {scans.length === 0 ? "No scans yet. Go try a Quick Scan!" : "No matches found."}
          </div>
        ) : (
          filteredScans.map((scan) => (
            <div
              key={scan.id}
              className="glass-card p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors flex items-start gap-4"
            >
              <div className={`mt-1 p-2 rounded-full ${
                scan.riskLevel === "danger" ? "bg-red-500/20 text-red-500" :
                scan.riskLevel === "suspicious" ? "bg-yellow-500/20 text-yellow-500" :
                "bg-green-500/20 text-green-500"
              }`}>
                {scan.riskLevel === "danger" ? <ShieldAlert className="w-5 h-5" /> :
                 scan.riskLevel === "suspicious" ? <AlertTriangle className="w-5 h-5" /> :
                 <CheckCircle className="w-5 h-5" />}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-1">
                  <h3 className="font-semibold truncate pr-4">
                    {scan.text.slice(0, 60)}{scan.text.length > 60 ? "..." : ""}
                  </h3>
                  <span className={`text-xs font-mono whitespace-nowrap px-2 py-1 rounded-full ${
                    scan.riskLevel === "danger" ? "bg-red-500/10 text-red-400" :
                    scan.riskLevel === "suspicious" ? "bg-yellow-500/10 text-yellow-400" :
                    "bg-green-500/10 text-green-400"
                  }`}>
                    {scan.score}% risk
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{formatDate(scan.date)}</span>
                  <span className="capitalize">• {scan.type} Scan</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ScanHistory;