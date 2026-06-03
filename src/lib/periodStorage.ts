import type { ReportingContext } from "./reportingPeriod";

export function checklistStorageKey(reporting: ReportingContext): string {
  return `commonspirit_checklist_${reporting.fiscalYearLabel}_${reporting.periodLabel}`;
}

export function signoffPeriodTag(reporting: ReportingContext): string {
  return `${reporting.fiscalYearLabel}-${reporting.periodLabel}-${reporting.closeMonth}`;
}
