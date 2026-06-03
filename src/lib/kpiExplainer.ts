import type { AggregateKpis } from "./financeCalculations";
import type { ReportingContext } from "./reportingPeriod";
import {
  formatCurrency,
  formatPercent,
  formatPoints,
  formatVarianceCurrency,
} from "./formatters";
import { LABOR_RATIO_TARGET, STEWARDSHIP_TARGET_MARGIN } from "./stewardshipConfig";

export interface KPIExplanation {
  title: string;
  definition: string;
  performanceText: string;
  driverText: string;
  recommendation: string;
}

export function buildKpiExplainerData(
  kpis: AggregateKpis,
  reporting: ReportingContext
): Record<string, KPIExplanation> {
  const period = reporting.closeMonthLabel;
  const laborRatio =
    kpis.netPatientRevenue > 0 ? (kpis.laborCost / kpis.netPatientRevenue) * 100 : 0;
  const laborGap = laborRatio - LABOR_RATIO_TARGET;
  const marginGap = kpis.operatingMargin - STEWARDSHIP_TARGET_MARGIN;
  const marginStatus =
    marginGap >= 0 ? "at or above" : "below";

  return {
    npr: {
      title: "Net Patient Revenue (NPR)",
      definition:
        "Total collection revenue generated for clinical services rendered, net of contractual adjustments, charity care, and write-offs.",
      performanceText: `As of ${period}, portfolio NPR is ${formatCurrency(kpis.netPatientRevenue)} across the filtered stewardship set.`,
      driverText:
        "Driven by outpatient diagnostic volume, elective procedural recovery, and commercial payer mix in Midwest and Pacific regions.",
      recommendation:
        "Clear outpatient billing backlogs before corporate consolidation. Prioritize high-margin referral slots for the close window.",
    },
    opex: {
      title: "Operating Expense (OpEx)",
      definition:
        "Clinical operating spend including nursing, supplies, implants, and regional logistics supporting patient care.",
      performanceText: `As of ${period}, operating expense totals ${formatCurrency(kpis.operatingExpense)} (${kpis.budgetVariance < 0 ? "unfavorable" : "favorable"} net variance ${formatVarianceCurrency(kpis.budgetVariance)}).`,
      driverText:
        "Registry nursing premiums and implant cost pressure in emergency and cardiology service lines are the primary spend drivers.",
      recommendation:
        "Enforce standardized supplier pathways and expand regional float-pool coverage to reduce contract labor reliance.",
    },
    margin: {
      title: "Operating Margin Ratio (%)",
      definition:
        "Nonprofit survivability metric: (Net Patient Revenue − Operating Expense) ÷ Net Patient Revenue.",
      performanceText: `As of ${period}, operating margin is ${formatPercent(kpis.operatingMargin, { decimals: 1 })}, ${marginStatus} the ${formatPercent(STEWARDSHIP_TARGET_MARGIN)} stewardship target (${formatPoints(marginGap, 1)}).`,
      driverText: `Labor ratio is ${formatPercent(laborRatio, { decimals: 1 })} vs ${formatPercent(LABOR_RATIO_TARGET, { decimals: 1 })} budget baseline (${formatPoints(laborGap, 1)}).`,
      recommendation: `Hold daily staffing stewardship boards through ${period} close and revalidate length-of-stay targets by service line.`,
    },
    variance: {
      title: "Budget Variance",
      definition: "Net dollar deviation between budgeted and actual operating outcomes for the filtered portfolio.",
      performanceText: `As of ${period}, net budget variance is ${formatVarianceCurrency(kpis.budgetVariance)}.`,
      driverText:
        "Emergency boarding, high-acuity DRG mix, and elevated commercial denials are concentrating unfavorable variance in Mountain region facilities.",
      recommendation:
        "Deploy coding audit sweeps on unfavorable service lines and escalate prior-authorization remediation before ledger certification.",
    },
    labor: {
      title: "Labor Cost Ratio",
      definition:
        "Share of net patient revenue consumed by salaries, benefits, registry premiums, and overtime.",
      performanceText: `As of ${period}, labor ratio is ${formatPercent(laborRatio, { decimals: 1 })} (${formatPoints(laborGap, 1)} vs target).`,
      driverText:
        "Registry and overtime spikes in emergency and cardiology lines are the dominant labor pressure for this close.",
      recommendation:
        "Shift to localized incentive shifts where cheaper than registry contracts; cap overtime thresholds by unit.",
    },
    forecast: {
      title: "Forecasted Month-End Margin",
      definition: `AI-smoothed projection for ${reporting.fiscalYearLabel} ${reporting.periodLabel} close using denial, AR, and labor signals.`,
      performanceText: `As of ${period}, mean forecasted margin across filtered rows is ${formatPercent(kpis.forecastedMargin, { decimals: 1 })} (target ${formatPercent(STEWARDSHIP_TARGET_MARGIN)}).`,
      driverText:
        "Denial backlog persistence and premium registry contracts in Mountain/Pacific regions keep the projection in watchlist territory.",
      recommendation:
        "Accelerate EDI clearance integration and assign denial taskforces before pre-flight signoff for this period.",
    },
  };
}
