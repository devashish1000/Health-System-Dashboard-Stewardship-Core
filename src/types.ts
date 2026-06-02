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

import { FinanceRecord } from "./data/syntheticFinanceData";
export type { FinanceRecord };


