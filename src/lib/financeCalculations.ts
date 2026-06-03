import { FinanceRecord } from "../data/syntheticFinanceData";
import { getReportingContext } from "./reportingPeriod";

export interface AggregateKpis {
  netPatientRevenue: number;
  operatingExpense: number;
  laborCost: number;
  supplyCost: number;
  operatingMargin: number;
  budgetVariance: number;
  denialRate: number;
  reimbursementDelayDays: number;
  overtimeUtilization: number;
  forecastedMargin: number;
  patientVolume: number;
}

/**
 * Summarizes a given set of finance records safely, guarding against empty datasets.
 */
export function calculateKpis(records: FinanceRecord[]): AggregateKpis {
  if (records.length === 0) {
    return {
      netPatientRevenue: 0,
      operatingExpense: 0,
      laborCost: 0,
      supplyCost: 0,
      operatingMargin: 0,
      budgetVariance: 0,
      denialRate: 0,
      reimbursementDelayDays: 0,
      overtimeUtilization: 0,
      forecastedMargin: 0,
      patientVolume: 0
    };
  }

  let totalRevenue = 0;
  let totalExpense = 0;
  let totalLabor = 0;
  let totalSupply = 0;
  let totalVariance = 0;
  let totalVolume = 0;

  // For weighted averages based on volume or counts
  let sumDenialRate = 0;
  let sumDelayDays = 0;
  let sumOvertime = 0;
  let sumForecastMargin = 0;

  records.forEach(rec => {
    totalRevenue += rec.net_patient_revenue;
    totalExpense += rec.operating_expense;
    totalLabor += rec.labor_cost;
    totalSupply += rec.supply_cost;
    totalVariance += rec.budget_variance;
    totalVolume += rec.patient_volume;

    sumDenialRate += rec.denial_rate;
    sumDelayDays += rec.reimbursement_delay_days;
    sumOvertime += rec.overtime_utilization;
    sumForecastMargin += rec.forecasted_margin;
  });

  const count = records.length;
  const operatingMargin = totalRevenue > 0 
    ? ((totalRevenue - totalExpense) / totalRevenue) * 100 
    : 0;

  return {
    netPatientRevenue: totalRevenue,
    operatingExpense: totalExpense,
    laborCost: totalLabor,
    supplyCost: totalSupply,
    operatingMargin: parseFloat(operatingMargin.toFixed(2)),
    budgetVariance: totalVariance,
    denialRate: parseFloat((sumDenialRate / count).toFixed(2)),
    reimbursementDelayDays: Math.round(sumDelayDays / count),
    overtimeUtilization: parseFloat((sumOvertime / count).toFixed(2)),
    forecastedMargin: parseFloat((sumForecastMargin / count).toFixed(2)),
    patientVolume: totalVolume
  };
}

/**
 * Builds illustrative margin-point waterfall steps (percentage points, not dollars).
 * Driver values are attributed deterministically from KPIs; supply closes the loop so
 * budgetMargin + sum(drivers) equals actual operating margin.
 */
export function calculateWaterfallSteps(kpis: AggregateKpis) {
  // Let's model a deterministic walk from a budgeted margin of 8.5% down to the actual operating margin.
  const budgetMargin = 8.5;
  const actualMargin = kpis.operatingMargin;
  
  // We attribute the difference (Actual - Budget) to five main drivers:
  // 1. Patient Volume Impact (+ or - depending on volume vs standard)
  // 2. Payer Mix Impact (Commercial vs Govermental indexes)
  // 3. Labor cost efficiency (overtime and clinical staffing)
  // 4. Supply Cost fluctuations (vendor markup)
  // 5. Denial Rate & Reimbursement latency
  
  const totalGap = actualMargin - budgetMargin;
  
  // Deterministic division of the gap based on KPIs to make it look realistic and dynamic
  const laborFactor = kpis.overtimeUtilization > 5 ? -1.4 : -0.4;
  const denialFactor = kpis.denialRate > 3 ? -0.7 : -0.2;
  const volumeFactor = kpis.patientVolume > 100000 ? 0.8 : (kpis.patientVolume > 50000 ? 0.3 : -0.2);
  const payerFactor = kpis.netPatientRevenue > 15000000 ? 0.4 : -0.3;
  
  // Adjust supply factor to exactly close the mathematical loop: actualMargin = budgetMargin + sum(drivers)
  const otherDriversSum = laborFactor + denialFactor + volumeFactor + payerFactor;
  const supplyFactor = parseFloat((totalGap - otherDriversSum).toFixed(2));
  
  return [
    { label: "Target Operating Margin", value: budgetMargin, isCumulative: true, rawOffset: 0 },
    { label: "Patient Volume Driver", value: volumeFactor, isCumulative: false, rawOffset: budgetMargin },
    { label: "Payer Mix Index Impact", value: payerFactor, isCumulative: false, rawOffset: budgetMargin + volumeFactor },
    { label: "Labor Staffing Overtime", value: laborFactor, isCumulative: false, rawOffset: budgetMargin + volumeFactor + payerFactor },
    { label: "Supply Chain & Implants", value: supplyFactor, isCumulative: false, rawOffset: budgetMargin + volumeFactor + payerFactor + laborFactor },
    { label: "Denial Backlogs Impact", value: denialFactor, isCumulative: false, rawOffset: budgetMargin + volumeFactor + payerFactor + laborFactor + supplyFactor },
    { label: "Actual Operating Margin", value: actualMargin, isCumulative: true, rawOffset: 0 }
  ];
}

/**
 * Filters the general list based on selected filter values.
 */
export function filterRecords(
  records: FinanceRecord[],
  filters: {
    facility: string;
    region: string;
    serviceLine: string;
    month: string;
    varianceStatus: string;
    reviewStatus: string;
    payerType: string;
    owner: string;
  }
): FinanceRecord[] {
  return records.filter(rec => {
    if (filters.facility && rec.facility !== filters.facility) return false;
    if (filters.region && rec.region !== filters.region) return false;
    if (filters.serviceLine && rec.service_line !== filters.serviceLine) return false;
    if (filters.month && rec.month !== filters.month) return false;
    if (filters.varianceStatus && rec.variance_status !== filters.varianceStatus) return false;
    if (filters.reviewStatus && rec.review_status !== filters.reviewStatus) return false;
    if (filters.payerType && rec.payer_type !== filters.payerType) return false;
    if (filters.owner && rec.owner !== filters.owner) return false;
    return true;
  });
}

/**
 * Returns grouped historical monthly operating margins.
 */
export function getMonthlyHistory(records: FinanceRecord[]) {
  const { closeMonth, actualMonthsThroughClose } = getReportingContext(records);
  const months = actualMonthsThroughClose;

  return months.map(m => {
    const monthDocs = records.filter(r => r.month === m);
    const kpis = calculateKpis(monthDocs);
    
    // Create an target baseline
    const targetMargin = 8.5;
    
    const laborCostRatio =
      kpis.netPatientRevenue > 0
        ? (kpis.laborCost / kpis.netPatientRevenue) * 100
        : 0;

    return {
      name: m,
      actualMargin: monthDocs.length > 0 ? kpis.operatingMargin : 0,
      targetMargin: targetMargin,
      forecastMargin: m === closeMonth ? kpis.forecastedMargin : kpis.operatingMargin + ((months.indexOf(m) * 17 % 41) / 100 - 0.2), // deterministic offset in ~[-0.2, 0.2]
      volume: kpis.patientVolume,
      revenue: kpis.netPatientRevenue / 1000000, // In Millions
      laborCostRatio: parseFloat(laborCostRatio.toFixed(2))
    };
  });
}

/**
 * Returns service line aggregations.
 */
export function getServiceLineAggregates(records: FinanceRecord[]) {
  const lines = [
    "Neurology",
    "Cardiology",
    "Orthopedics",
    "Emergency",
    "Primary Care",
    "Imaging",
    "Revenue Cycle"
  ];

  return lines.map(line => {
    const lineRecords = records.filter(r => r.service_line === line);
    const kpis = calculateKpis(lineRecords);
    
    const count = lineRecords.length;
    // Determine a representative status and owner
    const status = kpis.operatingMargin >= 8.0 
      ? "Favorable" 
      : (kpis.operatingMargin >= 2.0 ? "Watchlist" : "Unfavorable");
      
    const owner = lineRecords[0]?.owner || "Carmen Alvarez";
    const reviewStatus = lineRecords[0]?.review_status || "New";

    return {
      serviceLine: line,
      netRevenue: kpis.netPatientRevenue,
      operatingExpense: kpis.operatingExpense,
      operatingMargin: kpis.operatingMargin,
      budgetVariance: kpis.budgetVariance,
      patientVolume: kpis.patientVolume,
      denialRate: kpis.denialRate,
      owner,
      reviewStatus,
      status
    };
  });
}
