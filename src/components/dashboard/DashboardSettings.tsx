import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Bell, Shield, Globe, Trash2 } from "lucide-react";

const DashboardSettings = () => {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your ScamShield preferences
        </p>
      </div>

      {/* Notifications */}
      <div className="glass-card p-6 rounded-xl">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Notifications</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Alerts</p>
              <p className="text-sm text-muted-foreground">Get notified about high-risk scans</p>
            </div>
            <Switch />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Weekly Summary</p>
              <p className="text-sm text-muted-foreground">Receive weekly scan statistics</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="glass-card p-6 rounded-xl">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Security</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Store Scan History</p>
              <p className="text-sm text-muted-foreground">Keep a record of your scans</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enhanced Detection</p>
              <p className="text-sm text-muted-foreground">Use advanced AI models for analysis</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>

      {/* Language */}
      <div className="glass-card p-6 rounded-xl">
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Language</h2>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Detection Language</p>
            <p className="text-sm text-muted-foreground">Primary language for scam detection</p>
          </div>
          <select className="bg-secondary px-4 py-2 rounded-lg border border-border text-sm">
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
            <option>German</option>
          </select>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="glass-card p-6 rounded-xl border-destructive/30">
        <div className="flex items-center gap-3 mb-6">
          <Trash2 className="w-5 h-5 text-destructive" />
          <h2 className="text-lg font-semibold text-destructive">Danger Zone</h2>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Clear All History</p>
            <p className="text-sm text-muted-foreground">Permanently delete all scan history</p>
          </div>
          <Button variant="destructive" size="sm">
            Clear History
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardSettings;
