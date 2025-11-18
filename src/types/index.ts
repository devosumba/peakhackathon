// Core type definitions for the CSV Data Cleaner

export type Telco = "Safaricom" | "Airtel" | "Telkom" | "Unknown";

export type Row = {
  id: string; // stable id per row
  original: Record<string, any>; // original raw row
  phoneRaw: string;
  phoneClean: string | null;
  bundleSize: number | null;
  cost?: number | null;
  telco?: Telco;
  errors: string[]; // ["Invalid phone format", "Missing bundle size", ...]
  isDuplicate: boolean;
};

export type ColumnMapping = {
  phone: string | null; // header name in CSV
  bundle: string | null; // header name in CSV
  cost?: string | null; // header name in CSV (optional)
};

export type BalanceMode = "UNITS" | "BUDGET";

export type AppState = {
  rows: Row[];
  columnMapping: ColumnMapping;
  availableUnits: number | null;
  availableBudget: number | null;
  balanceMode: BalanceMode;
};

export type FilterMode = "all" | "invalid" | "duplicates" | "valid";

export type SortDirection = "asc" | "desc";

export type AutoFixSuggestion = {
  id: string;
  type: "add-prefix" | "normalize-spacing" | "fix-length";
  description: string;
  affectedCount: number;
  action: () => void;
};

export type ValidationError = {
  rowId: string;
  field: "phone" | "bundle" | "cost";
  message: string;
};

export type TelcoStats = {
  safaricom: number;
  airtel: number;
  telkom: number;
  unknown: number;
};

export type Summary = {
  totalRows: number;
  validRows: number;
  invalidRows: number;
  duplicates: number;
  totalBundleUnits: number;
  totalCost: number;
  telcoStats: TelcoStats;
};
