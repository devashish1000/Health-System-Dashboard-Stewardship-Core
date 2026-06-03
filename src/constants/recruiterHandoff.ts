import { HOUSTON_MARKET } from "../config/demoOrg";
import type { ControlTowerFilters } from "../types";
import type { ReportingContext } from "../lib/reportingPeriod";
import { DATA_HANDOFF_WORKBOOK_PATH, DATA_HANDOFF_WORKBOOK_FILENAME } from "./dataHandoff";

export const JOB_REQ_ID = "2026-469831";

export const JOB_REQ_BANNER =
  "Applicant work sample · Req 2026-469831 · Synthetic data · Not a CommonSpirit system or endorsement";

export const DISCLAIMER_SHORT =
  "Synthetic data · Not a CommonSpirit system or endorsement";

export const DEFAULT_REVIEW_REGION = HOUSTON_MARKET;

export const SUPPLY_CHAIN_SERVICE_LINES = [
  "Surgical Supplies",
  "Pharmacy Distribution",
  "Medical Devices",
] as const;

export const RECRUITER_CLICK_PATH = [
  "Choose Sr Financial Analyst (demo persona)",
  `Filter ${HOUSTON_MARKET} on the Financial Dashboard`,
  "Open a supply line (e.g. Surgical Supplies)",
  "Download the Excel data dictionary from Finance Export Suite",
] as const;

export const RECRUITER_WELCOME_KEY = "recruiter_welcome_seen_v1";

export const HOUSTON_ONLY_KEY = "recruiter_houston_only_v1";

/** Persisted tour path: `recruiter` | `full` */
export const TOUR_VARIANT_KEY = "tour_variant_chosen_v1";

export const PREFER_RECRUITER_TOUR_KEY = "prefer_recruiter_tour_v1";

export { DATA_HANDOFF_WORKBOOK_PATH, DATA_HANDOFF_WORKBOOK_FILENAME };

export function getRecruiterDefaultFilters(
  reporting: ReportingContext
): Partial<ControlTowerFilters> {
  return {
    region: DEFAULT_REVIEW_REGION,
    month: reporting.closeMonth,
  };
}

export function sortServiceLinesForRecruiter(lines: string[]): string[] {
  const priority = new Set<string>(SUPPLY_CHAIN_SERVICE_LINES);
  return [...lines].sort((a, b) => {
    const ap = priority.has(a) ? 0 : 1;
    const bp = priority.has(b) ? 0 : 1;
    if (ap !== bp) return ap - bp;
    return a.localeCompare(b);
  });
}
