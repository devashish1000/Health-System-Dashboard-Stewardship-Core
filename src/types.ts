export type ProjectPage =
  | "overview"
  | "dashboard"
  | "serviceLines"
  | "forecast"
  | "copilot"
  | "simulator"
  | "responsibleAi"
  | "visualRegression";

export type UserPersona = "analyst" | "cfo" | "director" | "auditor";

export interface ControlTowerFilters {
  facility: string;
  region: string;
  serviceLine: string;
  month: string;
  varianceStatus: string;
  reviewStatus: string;
  payerType: string;
  owner: string;
}

export interface ToastMessage {
  id: string;
  text: string;
  type: "success" | "info" | "warning";
}

export interface CertifiedSignoff {
  id: string;
  /** FY26-P05-2026-05 style period tag */
  reportingPeriod?: string;
  timestamp: string;
  signatoryName: string;
  signatoryTitle: string;
  modelCode: string;
  hash: string;
  activeMargin: number;
  unresolvedCount: number;
  comments: string;
  approvedScopes: string[];
}

export type { FinanceRecord } from "./types/financeRecord";


