import { useMemo } from "react";
import type { FinanceRecord } from "../data/syntheticFinanceData";
import { getReportingContext, type ReportingContext } from "./reportingPeriod";

export function useReportingPeriod(records: FinanceRecord[]): ReportingContext {
  return useMemo(() => getReportingContext(records), [records]);
}
