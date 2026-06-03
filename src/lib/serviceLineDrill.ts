import type { FinanceRecord } from "../types/financeRecord";
import { HOME_FACILITY, HOUSTON_MARKET } from "../config/demoOrg";

/** Prefer Houston / flagship facility when opening a service-line drill from the palette. */
export function pickDrillRecord(
  records: FinanceRecord[],
  serviceLine: string
): FinanceRecord | undefined {
  return (
    records.find(
      (r) =>
        r.service_line === serviceLine &&
        r.region === HOUSTON_MARKET &&
        r.facility === HOME_FACILITY
    ) ??
    records.find((r) => r.service_line === serviceLine && r.region === HOUSTON_MARKET) ??
    records.find((r) => r.service_line === serviceLine)
  );
}

export const SERVICE_LINE_DRILL_COPY: Record<string, string> = {
  "Surgical Supplies":
    "12-month margin and supply spend vs budget — Houston Market / GPO initiatives",
  "Pharmacy Distribution":
    "Pharmacy distribution expense predictability and variance vs close-month budget",
  "Medical Devices":
    "Device utilization, maintenance contracts, and supply cost drivers by facility",
  Cardiology:
    "Operating margin, NPR, and denial trends — priority clinical line for Houston flagship",
  Neurology: "Regional margin and volume trend with close-month stewardship context",
  Orthopedics: "Elective procedural mix, implant supply costs, and margin walk",
  Emergency: "Labor and supply pressure with boarding-related overtime indicators",
  "Primary Care": "Outpatient volume and expense ratio trend across Houston campuses",
  Imaging: "Diagnostic volume surge and supply-intensive margin performance",
  "Revenue Cycle": "Denial rate, AR days, and cash timing — finance reconciliation view",
};
