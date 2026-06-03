export interface FinanceRecord {
  id: string;
  month: string;
  facility: string;
  region: string;
  service_line: string;
  net_patient_revenue: number;
  operating_expense: number;
  labor_cost: number;
  supply_cost: number;
  operating_margin: number;
  budget_variance: number;
  patient_volume: number;
  payer_mix_index: number;
  denial_rate: number;
  reimbursement_delay_days: number;
  overtime_utilization: number;
  forecasted_margin: number;
  variance_status: "Favorable" | "Watchlist" | "Unfavorable";
  payer_type: "Commercial" | "Medicare" | "Medicaid" | "Self-Pay" | "Other";
  owner: string;
  review_status: "New" | "Analyst Review" | "Director Review" | "Executive Ready" | "Closed";
  variance_note: string;
  last_updated: string;
}
