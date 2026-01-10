import { ShieldCheck, ShieldAlert, ShieldX, Clock, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const historyItems = [
  {
    id: 1,
    preview: "URGENT: Your package is waiting...",
    riskLevel: "suspicious" as const,
    score: 72,
    date: "2 hours ago",
  },
  {
    id: 2,
    preview: "Your Amazon order has shipped...",
    riskLevel: "safe" as const,
    score: 8,
    date: "5 hours ago",
  },
  {
    id: 3,
    preview: "Your bank account has been compromised...",
    riskLevel: "danger" as const,
    score: 94,
    date: "1 day ago",
  },
  {
    id: 4,
    preview: "Meeting reminder for tomorrow at 3pm...",
    riskLevel: "safe" as const,
    score: 3,
    date: "2 days ago",
  },
  {
    id: 5,
    preview: "You've won a $1000 gift card! Click here...",
    riskLevel: "danger" as const,
    score: 98,
    date: "3 days ago",
  },
];

const riskConfig = {
  safe: {
    icon: ShieldCheck,
    color: "text-success",
    bg: "bg-success/10",
  },
  suspicious: {
    icon: ShieldAlert,
    color: "text-warning",
    bg: "bg-warning/10",
  },
  danger: {
    icon: ShieldX,
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
};

const ScanHistory = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Scan History</h1>
        <p className="text-muted-foreground">
          View your previous scans and analysis results
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input 
          placeholder="Search history..." 
          className="pl-10 bg-card border-border/50"
        />
      </div>

      {/* History List */}
      <div className="space-y-3">
        {historyItems.map((item) => {
          const config = riskConfig[item.riskLevel];
          const Icon = config.icon;
          
          return (
            <div 
              key={item.id}
              className="glass-card p-4 rounded-xl flex items-center gap-4 hover:border-primary/30 transition-colors cursor-pointer group"
            >
              <div className={`w-12 h-12 rounded-lg ${config.bg} flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${config.color}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate group-hover:text-primary transition-colors">
                  {item.preview}
                </p>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                  <span className={`font-medium ${config.color}`}>
                    {item.score}% risk
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.date}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ScanHistory;
