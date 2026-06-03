/**
 * Generates an Excel workbook documenting all synthetic data the Vercel app uses.
 * Run: npx tsx scripts/generate-handoff-workbook.ts
 */
import * as fs from "node:fs";
import * as path from "node:path";
import * as XLSX from "xlsx";
import { buildSyntheticLedger } from "../src/data/generateSyntheticLedger.ts";
import { LEDGER_COMBO_TEMPLATES } from "../src/data/ledgerComboTemplates.ts";
import { PERSONA_PRESETS, REGION_LEDGER_SCALE, HOUSTON_MARKET, HOME_FACILITY } from "../src/config/demoOrg.ts";
import { calculateKpis } from "../src/lib/financeCalculations.ts";
import { getReportingContext } from "../src/lib/reportingPeriod.ts";
import { STEWARDSHIP_TARGET_MARGIN, LABOR_RATIO_TARGET, controlTowerVersion } from "../src/lib/stewardshipConfig.ts";
import type { FinanceRecord } from "../src/types/financeRecord.ts";

const OUT_DIR = path.join(process.cwd(), "docs", "data-handoff");
const OUT_FILE = path.join(OUT_DIR, "CommonSpirit-Control-Tower-Data-Handoff.xlsx");

function sheetFromRows(rows: Record<string, unknown>[]) {
  return XLSX.utils.json_to_sheet(rows);
}

function sheetFromAoA(rows: (string | number)[][]) {
  return XLSX.utils.aoa_to_sheet(rows);
}

function autoWidth(ws: XLSX.WorkSheet, rows: Record<string, unknown>[]) {
  if (!rows.length) return;
  const cols = Object.keys(rows[0]);
  ws["!cols"] = cols.map((key) => {
    const max = Math.max(
      key.length,
      ...rows.map((r) => String(r[key] ?? "").length)
    );
    return { wch: Math.min(48, max + 2) };
  });
}

function main() {
  const asOf = new Date("2026-06-15");
  const records = buildSyntheticLedger(asOf);
  const reporting = getReportingContext(records);
  const closeRecords = records.filter((r) => r.month === reporting.closeMonth);
  const kpis = calculateKpis(closeRecords);

  const facilities = [...new Set(records.map((r) => r.facility))].sort();
  const regions = [...new Set(records.map((r) => r.region))].sort();
  const serviceLines = [...new Set(records.map((r) => r.service_line))].sort();
  const owners = [...new Set(records.map((r) => r.owner))].sort();

  const about: (string | number)[][] = [
    ["CommonSpirit Financial Control Tower — Data Handoff Workbook"],
    [""],
    ["Live app", "https://hsd-audit.vercel.app"],
    ["Generated", new Date().toISOString()],
    ["App version", controlTowerVersion()],
    [""],
    ["IMPORTANT"],
    [
      "All figures in this workbook are SYNTHETIC demo data for portfolio / interview handoff.",
    ],
    ["They are not CommonSpirit operational feeds, Strata exports, or PHI."],
    [""],
    ["Primary audience", "Finance — Baylor St. Luke's / Houston Market (supply chain finance)"],
    ["Close month in app", reporting.closeMonthLabel],
    ["Fiscal period", `${reporting.fiscalYearLabel} ${reporting.periodLabel}`],
    ["Close-month ledger rows", closeRecords.length],
    ["Total generated rows (all months)", records.length],
    ["Combo templates (seeds)", LEDGER_COMBO_TEMPLATES.length],
    [""],
    ["Source code (regenerate this file)"],
    ["Ledger generator", "src/data/generateSyntheticLedger.ts"],
    ["Row seeds", "src/data/ledgerComboTemplates.ts"],
    ["Personas / org", "src/config/demoOrg.ts"],
    ["KPI math", "src/lib/financeCalculations.ts"],
    ["Export command", "npx tsx scripts/generate-handoff-workbook.ts"],
  ];

  const dictionary = [
    {
      table: "finance_ledger_row",
      column: "id",
      data_type: "string",
      example: "rec-001",
      used_in_ui: "Dashboard table, export CSV, drawer",
      notes: "Unique row id per facility × service line × month",
    },
    {
      table: "finance_ledger_row",
      column: "month",
      data_type: "YYYY-MM",
      example: reporting.closeMonth,
      used_in_ui: "Period filters, charts, close-month KPIs",
      notes: "Rolling months through simulated month-end close",
    },
    {
      table: "finance_ledger_row",
      column: "facility",
      data_type: "string",
      example: HOME_FACILITY,
      used_in_ui: "Dashboard filter, Overview, export",
      notes: "Hospital / site name",
    },
    {
      table: "finance_ledger_row",
      column: "region",
      data_type: "string",
      example: HOUSTON_MARKET,
      used_in_ui: "Dashboard filter, drill-down copy",
      notes: "Market or system region",
    },
    {
      table: "finance_ledger_row",
      column: "service_line",
      data_type: "string",
      example: "Surgical Supplies",
      used_in_ui: "Service Lines page, palette drills, charts",
      notes: "Clinical or supply-chain cost center",
    },
    {
      table: "finance_ledger_row",
      column: "net_patient_revenue",
      data_type: "currency (USD)",
      example: closeRecords[0]?.net_patient_revenue ?? 0,
      used_in_ui: "KPI cards, charts, AI answers, Overview NPR hero",
      notes: "Summed for close-month NPR total",
    },
    {
      table: "finance_ledger_row",
      column: "operating_expense",
      data_type: "currency (USD)",
      example: closeRecords[0]?.operating_expense ?? 0,
      used_in_ui: "KPI cards, budget vs actual charts",
      notes: "Total operating expense for row",
    },
    {
      table: "finance_ledger_row",
      column: "labor_cost",
      data_type: "currency (USD)",
      example: closeRecords[0]?.labor_cost ?? 0,
      used_in_ui: "Labor ratio chart, KPI explainers",
      notes: "Subset of operating expense",
    },
    {
      table: "finance_ledger_row",
      column: "supply_cost",
      data_type: "currency (USD)",
      example: closeRecords[0]?.supply_cost ?? 0,
      used_in_ui: "Export suite summary, supply chain story",
      notes: "Supply chain / implant / pharmacy spend",
    },
    {
      table: "finance_ledger_row",
      column: "operating_margin",
      data_type: "percent",
      example: closeRecords[0]?.operating_margin ?? 0,
      used_in_ui: "Margin %, variance badges, forecast",
      notes: "(NPR - OpEx) / NPR × 100 at row level",
    },
    {
      table: "finance_ledger_row",
      column: "budget_variance",
      data_type: "currency (USD)",
      example: closeRecords[0]?.budget_variance ?? 0,
      used_in_ui: "Variance columns, forecast bridge",
      notes: "Positive favorable / negative unfavorable",
    },
    {
      table: "finance_ledger_row",
      column: "patient_volume",
      data_type: "integer",
      example: closeRecords[0]?.patient_volume ?? 0,
      used_in_ui: "Service line cards, trend modal",
      notes: "Cases / visits; 0 for non-volume lines",
    },
    {
      table: "finance_ledger_row",
      column: "payer_mix_index",
      data_type: "decimal index",
      example: closeRecords[0]?.payer_mix_index ?? 1,
      used_in_ui: "Forecast driver bridge (internal)",
      notes: "Relative payer mix weight",
    },
    {
      table: "finance_ledger_row",
      column: "denial_rate",
      data_type: "percent",
      example: closeRecords[0]?.denial_rate ?? 0,
      used_in_ui: "KPI denial, AI copilot narratives",
      notes: "Claim denial rate",
    },
    {
      table: "finance_ledger_row",
      column: "reimbursement_delay_days",
      data_type: "integer days",
      example: closeRecords[0]?.reimbursement_delay_days ?? 0,
      used_in_ui: "AR timing narratives",
      notes: "Average reimbursement delay",
    },
    {
      table: "finance_ledger_row",
      column: "overtime_utilization",
      data_type: "percent",
      example: closeRecords[0]?.overtime_utilization ?? 0,
      used_in_ui: "Labor pressure KPIs",
      notes: "Overtime as % of labor",
    },
    {
      table: "finance_ledger_row",
      column: "forecasted_margin",
      data_type: "percent",
      example: closeRecords[0]?.forecasted_margin ?? 0,
      used_in_ui: "Forecast page projection",
      notes: "Forward margin estimate",
    },
    {
      table: "finance_ledger_row",
      column: "variance_status",
      data_type: "enum",
      example: "Watchlist",
      used_in_ui: "Filters, badges (Favorable / Watchlist / Unfavorable)",
      notes: "Stewardship status bucket",
    },
    {
      table: "finance_ledger_row",
      column: "payer_type",
      data_type: "enum",
      example: "Commercial",
      used_in_ui: "Dashboard filter, payer pie chart",
      notes: "Commercial | Medicare | Medicaid | Self-Pay | Other",
    },
    {
      table: "finance_ledger_row",
      column: "owner",
      data_type: "string",
      example: "Devashish Neupane",
      used_in_ui: "Dashboard owner filter, Service Lines assignee",
      notes: "Synthetic finance / ops owner name",
    },
    {
      table: "finance_ledger_row",
      column: "review_status",
      data_type: "enum",
      example: "Analyst Review",
      used_in_ui: "Dashboard filter, workflow column",
      notes: "Close workflow state",
    },
    {
      table: "finance_ledger_row",
      column: "variance_note",
      data_type: "text",
      example: "Supply chain initiative over budget…",
      used_in_ui: "Row detail, export CSV",
      notes: "Auto-generated narrative per row",
    },
    {
      table: "finance_ledger_row",
      column: "last_updated",
      data_type: "date",
      example: closeRecords[0]?.last_updated ?? "",
      used_in_ui: "Audit metadata in exports",
      notes: "Synthetic last-updated stamp",
    },
  ];

  const ledgerRows = closeRecords.map((r) => ({ ...r }));
  const templateRows = LEDGER_COMBO_TEMPLATES.map((t) => ({
    ...t,
    region_scale_at_generation: REGION_LEDGER_SCALE[t.region] ?? 1,
  }));

  const personaRows = PERSONA_PRESETS.map((p) => ({
    persona_key: p.persona,
    display_name: p.name,
    email: p.email,
    full_role: p.role,
    header_title: p.headerTitle,
    description: p.desc,
    can_sign_close: p.persona === "cfo" ? "Yes" : "No",
  }));

  const filterRows = [
    { filter_field: "facility", source: "distinct finance_ledger_row.facility", example_values: facilities.join("; ") },
    { filter_field: "region", source: "distinct finance_ledger_row.region", example_values: regions.join("; ") },
    { filter_field: "serviceLine", source: "distinct finance_ledger_row.service_line", example_values: serviceLines.join("; ") },
    { filter_field: "month", source: "distinct finance_ledger_row.month", example_values: [...new Set(records.map((r) => r.month))].sort().join("; ") },
    { filter_field: "varianceStatus", source: "enum", example_values: "Favorable; Watchlist; Unfavorable" },
    { filter_field: "reviewStatus", source: "enum", example_values: "New; Analyst Review; Director Review; Executive Ready; Closed" },
    { filter_field: "payerType", source: "enum", example_values: "Commercial; Medicare; Medicaid; Self-Pay; Other" },
    { filter_field: "owner", source: "distinct finance_ledger_row.owner", example_values: owners.join("; ") },
  ];

  const kpiRows = [
    { metric: "netPatientRevenue", close_month_value: kpis.netPatientRevenue, formula: "SUM(net_patient_revenue) for close-month rows" },
    { metric: "operatingExpense", close_month_value: kpis.operatingExpense, formula: "SUM(operating_expense)" },
    { metric: "laborCost", close_month_value: kpis.laborCost, formula: "SUM(labor_cost)" },
    { metric: "supplyCost", close_month_value: kpis.supplyCost, formula: "SUM(supply_cost)" },
    { metric: "operatingMargin", close_month_value: kpis.operatingMargin, formula: "(SUM(NPR) - SUM(OpEx)) / SUM(NPR) × 100" },
    { metric: "budgetVariance", close_month_value: kpis.budgetVariance, formula: "SUM(budget_variance)" },
    { metric: "denialRate", close_month_value: kpis.denialRate, formula: "AVG(denial_rate)" },
    { metric: "reimbursementDelayDays", close_month_value: kpis.reimbursementDelayDays, formula: "AVG(reimbursement_delay_days)" },
    { metric: "overtimeUtilization", close_month_value: kpis.overtimeUtilization, formula: "AVG(overtime_utilization)" },
    { metric: "forecastedMargin", close_month_value: kpis.forecastedMargin, formula: "AVG(forecasted_margin)" },
    { metric: "patientVolume", close_month_value: kpis.patientVolume, formula: "SUM(patient_volume)" },
    { metric: "stewardshipTargetMargin", close_month_value: STEWARDSHIP_TARGET_MARGIN, formula: "Constant in stewardshipConfig.ts" },
    { metric: "laborRatioTarget", close_month_value: LABOR_RATIO_TARGET, formula: "Constant in stewardshipConfig.ts" },
  ];

  const signoffSchema = [
    { field: "id", type: "string", notes: "Sign-off certificate id (browser localStorage)" },
    { field: "reportingPeriod", type: "string", notes: "e.g. FY26-P05-2026-05" },
    { field: "timestamp", type: "ISO datetime", notes: "When signed" },
    { field: "signatoryName", type: "string", notes: "From active persona" },
    { field: "signatoryTitle", type: "string", notes: "From active persona" },
    { field: "modelCode", type: "string", notes: "COMMONSPIRIT-STU-{FY}-V1" },
    { field: "hash", type: "string", notes: "Demo integrity hash" },
    { field: "activeMargin", type: "number", notes: "Margin at sign-off" },
    { field: "unresolvedCount", type: "number", notes: "Open watchlist rows" },
    { field: "comments", type: "text", notes: "CFO comments" },
    { field: "approvedScopes", type: "string[]", notes: "Scopes approved in modal" },
  ];

  const uiPages = [
    { page: "Executive Tower (overview)", primary_tables: "Aggregated close-month KPIs from finance_ledger_row", key_columns: "NPR, margin, checklist state" },
    { page: "Financial Dashboard", primary_tables: "finance_ledger_row (filtered)", key_columns: "All ledger columns; charts aggregate KPIs" },
    { page: "Service Lines Review", primary_tables: "Aggregated by service_line", key_columns: "service_line, margin, owner, variance" },
    { page: "Forecast & Walk", primary_tables: "KPIs + static driver bridge labels", key_columns: "forecasted_margin, driver narrative" },
    { page: "AI Finance Copilot", primary_tables: "KPIs + server/client mock narratives", key_columns: "Derived from close-month ledger" },
    { page: "Scenario Simulator", primary_tables: "KPIs adjusted in-session", key_columns: "Margin sensitivity (client-side)" },
    { page: "Pre-flight Sign-off", primary_tables: "CertifiedSignoff + ledger", key_columns: "signatory fields, unresolved watchlist" },
    { page: "Export (CSV)", primary_tables: "Filtered finance_ledger_row", key_columns: "Same as Data_Dictionary export columns" },
  ];

  const wb = XLSX.utils.book_new();

  const wsAbout = sheetFromAoA(about);
  wsAbout["!cols"] = [{ wch: 28 }, { wch: 72 }];
  XLSX.utils.book_append_sheet(wb, wsAbout, "About");

  const wsDict = sheetFromRows(dictionary);
  autoWidth(wsDict, dictionary);
  XLSX.utils.book_append_sheet(wb, wsDict, "Data_Dictionary");

  const wsClose = sheetFromRows(ledgerRows);
  autoWidth(wsClose, ledgerRows);
  XLSX.utils.book_append_sheet(wb, wsClose, "Close_Month_Ledger");

  const wsAll = sheetFromRows(records.map((r) => ({ ...r })));
  XLSX.utils.book_append_sheet(wb, wsAll, "Full_Ledger_All_Months");

  const wsTpl = sheetFromRows(templateRows);
  autoWidth(wsTpl, templateRows);
  XLSX.utils.book_append_sheet(wb, wsTpl, "Combo_Templates");

  const wsPersonas = sheetFromRows(personaRows);
  autoWidth(wsPersonas, personaRows);
  XLSX.utils.book_append_sheet(wb, wsPersonas, "Personas");

  const wsFilters = sheetFromRows(filterRows);
  autoWidth(wsFilters, filterRows);
  XLSX.utils.book_append_sheet(wb, wsFilters, "Dashboard_Filters");

  const wsKpi = sheetFromRows(kpiRows);
  autoWidth(wsKpi, kpiRows);
  XLSX.utils.book_append_sheet(wb, wsKpi, "Derived_KPIs");

  const wsSign = sheetFromRows(signoffSchema);
  autoWidth(wsSign, signoffSchema);
  XLSX.utils.book_append_sheet(wb, wsSign, "Signoff_Schema");

  const wsUi = sheetFromRows(uiPages);
  autoWidth(wsUi, uiPages);
  XLSX.utils.book_append_sheet(wb, wsUi, "UI_Page_Sources");

  fs.mkdirSync(OUT_DIR, { recursive: true });
  XLSX.writeFile(wb, OUT_FILE);

  console.log(`Wrote ${OUT_FILE}`);
  console.log(`  Close-month rows: ${closeRecords.length}`);
  console.log(`  Full ledger rows: ${records.length}`);
}

main();
