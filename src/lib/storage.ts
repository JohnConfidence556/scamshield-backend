// src/lib/storage.ts

export interface ScanRecord {
  id: string;
  text: string;
  date: string;
  riskLevel: "safe" | "suspicious" | "danger";
  score: number;
  type: "text" | "image";
}

export const saveScan = (scan: Omit<ScanRecord, "id" | "date">) => {
  const existingScans = getScans();
  
  const newScan: ScanRecord = {
    ...scan,
    id: Date.now().toString(), // Unique ID based on time
    date: new Date().toISOString(), // Save exact time
  };

  // Add new scan to the TOP of the list
  const updatedScans = [newScan, ...existingScans];
  
  // Save to browser storage
  localStorage.setItem("scamshield_history", JSON.stringify(updatedScans));
};

export const getScans = (): ScanRecord[] => {
  const data = localStorage.getItem("scamshield_history");
  return data ? JSON.parse(data) : [];
};

export const clearHistory = () => {
  localStorage.removeItem("scamshield_history");
};