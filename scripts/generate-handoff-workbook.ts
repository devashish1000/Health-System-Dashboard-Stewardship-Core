/**
 * Executive-ready Excel workbook — all synthetic data the Vercel app displays.
 * Outputs to docs/data-handoff/ and public/data-handoff/ for in-app download.
 *
 * Run: npm run handoff:excel
 */
import * as fs from "node:fs";
import * as path from "node:path";
import ExcelJS from "exceljs";
import { buildSyntheticLedger } from "../src/data/generateSyntheticLedger.ts";
import { LEDGER_COMBO_TEMPLATES } from "../src/data/ledgerComboTemplates.ts";
import {
  PERSONA_PRESETS,
  REGION_LEDGER_SCALE,
  HOUSTON_MARKET,
  HOME_FACILITY,
  DEMO_DISCLAIMER,
} from "../src/config/demoOrg.ts";
import { calculateKpis } from "../src/lib/financeCalculations.ts";
import { getReportingContext } from "../src/lib/reportingPeriod.ts";
import {
  STEWARDSHIP_TARGET_MARGIN,
  LABOR_RATIO_TARGET,
  controlTowerVersion,
} from "../src/lib/stewardshipConfig.ts";
import { DATA_HANDOFF_WORKBOOK_FILENAME } from "../src/constants/dataHandoff.ts";
import { DEMO_AS_OF } from "../src/config/demoOrg.ts";

const BRAND_DARK = "FF1E293B";
const BRAND_HEADER = "FF0F766E";
const BRAND_LIGHT = "FFF0FDFA";
const ALT_ROW = "FFF8FAFC";
const WARN_FILL = "FFFFF7ED";
const WHITE = "FFFFFFFF";

const OUT_DIRS = [
  path.join(process.cwd(), "docs", "data-handoff"),
  path.join(process.cwd(), "public", "data-handoff"),
];

type Row = Record<string, unknown>;

function styleHeaderRow(sheet: ExcelJS.Worksheet, colCount: number) {
  const row = sheet.getRow(1);
  row.height = 22;
  for (let c = 1; c <= colCount; c++) {
    const cell = row.getCell(c);
    cell.font = { bold: true, color: { argb: WHITE }, size: 11, name: "Calibri" };
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: BRAND_DARK } };
    cell.alignment = { vertical: "middle", wrapText: true };
    cell.border = {
      bottom: { style: "thin", color: { argb: BRAND_HEADER } },
    };
  }
  sheet.views = [{ state: "frozen", ySplit: 1, activeCell: "A2" }];
}

function addTableSheet(
  wb: ExcelJS.Workbook,
  name: string,
  rows: Row[],
  opts?: {
    tabColor?: string;
    currencyCols?: string[];
    percentCols?: string[];
    integerCols?: string[];
    wrapCols?: string[];
  }
) {
  const sheet = wb.addWorksheet(name, {
    properties: { tabColor: { argb: opts?.tabColor ?? "FF64748B" } },
  });
  if (!rows.length) return sheet;

  const keys = Object.keys(rows[0]);
  sheet.addRow(keys);
  styleHeaderRow(sheet, keys.length);

  rows.forEach((r, idx) => {
    const row = sheet.addRow(keys.map((k) => r[k]));
    if (idx % 2 === 1) {
      row.eachCell((cell) => {
        cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: ALT_ROW } };
      });
    }
  });

  keys.forEach((key, i) => {
    const col = sheet.getColumn(i + 1);
    const maxLen = Math.max(
      key.length,
      ...rows.slice(0, 50).map((r) => String(r[key] ?? "").length)
    );
    col.width = Math.min(52, Math.max(12, maxLen + 2));
    if (opts?.currencyCols?.includes(key)) {
      col.numFmt = '"$"#,##0;[Red]("$"#,##0)';
    }
    if (opts?.percentCols?.includes(key)) {
      col.numFmt = '0.0"%"';
    }
    if (opts?.integerCols?.includes(key)) {
      col.numFmt = "#,##0";
    }
    if (opts?.wrapCols?.includes(key)) {
      col.alignment = { wrapText: true, vertical: "top" };
    }
  });

  sheet.autoFilter = { from: "A1", to: { row: 1, column: keys.length } };
  return sheet;
}

async function buildAboutSheet(
  wb: ExcelJS.Workbook,
  meta: {
    closeLabel: string;
    fiscal: string;
    closeRows: number;
    totalRows: number;
    templates: number;
  }
) {
  const sheet = wb.addWorksheet("About", {
    properties: { tabColor: { argb: "FF7C3AED" } },
  });
  sheet.mergeCells("A1:D1");
  const title = sheet.getCell("A1");
  title.value = "CommonSpirit Financial Control Tower";
  title.font = { size: 18, bold: true, color: { argb: BRAND_DARK }, name: "Calibri" };
  title.alignment = { vertical: "middle" };

  sheet.mergeCells("A2:D2");
  sheet.getCell("A2").value = "Data Handoff Workbook (Synthetic Demo)";
  sheet.getCell("A2").font = { size: 12, italic: true, color: { argb: "FF475569" } };

  const rows: [string, string][] = [
    ["", ""],
    ["Live application", "https://hsd-audit.vercel.app"],
    ["Generated (UTC)", new Date().toISOString()],
    ["Application version", controlTowerVersion()],
    ["", ""],
    ["DISCLAIMER", DEMO_DISCLAIMER],
    ["", ""],
    ["Primary audience", "CommonSpirit Finance — Houston Market / Supply Chain"],
    ["Flagship facility", HOME_FACILITY],
    ["Close month", meta.closeLabel],
    ["Fiscal period", meta.fiscal],
    ["Close-month data rows", String(meta.closeRows)],
    ["All months (full ledger)", String(meta.totalRows)],
    ["Seed templates", String(meta.templates)],
    ["", ""],
    ["This file is NOT", "Production Strata, Epic, or CommonSpirit operational data."],
    ["Purpose", "Transparency for reviewers — column definitions, KPI math, and sample ledger."],
  ];

  let r = 4;
  for (const [label, value] of rows) {
    const labelCell = sheet.getCell(`A${r}`);
    const valueCell = sheet.getCell(`B${r}`);
    labelCell.value = label;
    valueCell.value = value;
    labelCell.font = { bold: label === "DISCLAIMER" || label === "This file is NOT", size: 11 };
    if (label === "DISCLAIMER") {
      sheet.mergeCells(`B${r}:D${r}`);
      valueCell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: WARN_FILL } };
      valueCell.alignment = { wrapText: true };
    }
    if (label.startsWith("http")) {
      valueCell.font = { color: { argb: "FF0D9488" }, underline: true };
    }
    r++;
  }

  sheet.getColumn(1).width = 28;
  sheet.getColumn(2).width = 72;
  sheet.getColumn(3).width = 16;
  sheet.getColumn(4).width = 16;
}

function buildHowToReadSheet(wb: ExcelJS.Workbook) {
  const sheet = wb.addWorksheet("How_to_Read", {
    properties: { tabColor: { argb: "FF2563EB" } },
  });
  const guide: [string, string][] = [
    ["Sheet", "Who should read it"],
    ["About", "Everyone — start here for disclaimer and period context"],
    ["How_to_Read", "This guide — sheet index and recommended order"],
    ["Data_Dictionary", "Analysts, IT — every column name and where it appears in the app"],
    ["Close_Month_Ledger", "Finance leaders — the rows powering current KPIs on the dashboard"],
    ["Full_Ledger_All_Months", "Power users — rolling history used for trend charts"],
    ["Combo_Templates", "Technical reviewers — seed values before scaling and month drift"],
    ["Derived_KPIs", "Executives — how NPR, margin, and supply totals are calculated"],
    ["Dashboard_Filters", "Analysts — filter dropdown values in the Financial Dashboard"],
    ["Personas", "HR / demo hosts — synthetic login roles (not real employees)"],
    ["UI_Page_Sources", "Product owners — which app page reads which table"],
    ["Signoff_Schema", "Compliance — fields stored when Market Finance signs off"],
  ];

  sheet.addRow(["Sheet", "Who should read it"]);
  styleHeaderRow(sheet, 2);
  guide.slice(1).forEach(([a, b], i) => {
    const row = sheet.addRow([a, b]);
    if (i % 2 === 1) {
      row.eachCell((c) => {
        c.fill = { type: "pattern", pattern: "solid", fgColor: { argb: ALT_ROW } };
      });
    }
  });
  sheet.getColumn(1).width = 28;
  sheet.getColumn(2).width = 78;
}

async function main() {
  const asOf = DEMO_AS_OF;
  const records = buildSyntheticLedger(asOf);
  const reporting = getReportingContext(records);
  const closeRecords = records.filter((r) => r.month === reporting.closeMonth);
  const kpis = calculateKpis(closeRecords);

  const facilities = [...new Set(records.map((r) => r.facility))].sort();
  const regions = [...new Set(records.map((r) => r.region))].sort();
  const serviceLines = [...new Set(records.map((r) => r.service_line))].sort();
  const owners = [...new Set(records.map((r) => r.owner))].sort();

  const wb = new ExcelJS.Workbook();
  wb.creator = "Health System Dashboard Stewardship Core";
  wb.company = "Concept prototype — CommonSpirit scenario";
  wb.created = new Date();
  wb.modified = new Date();

  await buildAboutSheet(wb, {
    closeLabel: reporting.closeMonthLabel,
    fiscal: `${reporting.fiscalYearLabel} ${reporting.periodLabel}`,
    closeRows: closeRecords.length,
    totalRows: records.length,
    templates: LEDGER_COMBO_TEMPLATES.length,
  });
  buildHowToReadSheet(wb);

  const dictionary = [
    { table: "finance_ledger_row", column: "id", data_type: "string", example: "rec-001", used_in_ui: "Dashboard, export CSV", notes: "Unique per facility × service line × month" },
    { table: "finance_ledger_row", column: "month", data_type: "YYYY-MM", example: reporting.closeMonth, used_in_ui: "Period filters, charts", notes: "Rolling through simulated close" },
    { table: "finance_ledger_row", column: "facility", data_type: "string", example: HOME_FACILITY, used_in_ui: "Dashboard filter", notes: "Hospital / site" },
    { table: "finance_ledger_row", column: "region", data_type: "string", example: HOUSTON_MARKET, used_in_ui: "Dashboard filter", notes: "Market region" },
    { table: "finance_ledger_row", column: "service_line", data_type: "string", example: "Surgical Supplies", used_in_ui: "Service Lines, drills", notes: "Clinical or supply chain line" },
    { table: "finance_ledger_row", column: "net_patient_revenue", data_type: "USD", example: closeRecords[0]?.net_patient_revenue, used_in_ui: "KPI hero, charts", notes: "Summed for close-month NPR" },
    { table: "finance_ledger_row", column: "operating_expense", data_type: "USD", example: closeRecords[0]?.operating_expense, used_in_ui: "KPI, budget vs actual", notes: "Total operating expense" },
    { table: "finance_ledger_row", column: "labor_cost", data_type: "USD", example: closeRecords[0]?.labor_cost, used_in_ui: "Labor ratio chart", notes: "Labor subset of OpEx" },
    { table: "finance_ledger_row", column: "supply_cost", data_type: "USD", example: closeRecords[0]?.supply_cost, used_in_ui: "Export summary", notes: "Supply chain spend" },
    { table: "finance_ledger_row", column: "operating_margin", data_type: "percent", example: closeRecords[0]?.operating_margin, used_in_ui: "Margin %, badges", notes: "(NPR-OpEx)/NPR × 100" },
    { table: "finance_ledger_row", column: "budget_variance", data_type: "USD", example: closeRecords[0]?.budget_variance, used_in_ui: "Variance columns", notes: "Favorable if positive" },
    { table: "finance_ledger_row", column: "patient_volume", data_type: "integer", example: closeRecords[0]?.patient_volume, used_in_ui: "Service line cards", notes: "Cases; 0 for non-volume lines" },
    { table: "finance_ledger_row", column: "payer_mix_index", data_type: "decimal", example: closeRecords[0]?.payer_mix_index, used_in_ui: "Forecast drivers", notes: "Relative payer weight" },
    { table: "finance_ledger_row", column: "denial_rate", data_type: "percent", example: closeRecords[0]?.denial_rate, used_in_ui: "Denial KPI", notes: "Claim denial rate" },
    { table: "finance_ledger_row", column: "reimbursement_delay_days", data_type: "days", example: closeRecords[0]?.reimbursement_delay_days, used_in_ui: "AR narratives", notes: "Avg reimbursement delay" },
    { table: "finance_ledger_row", column: "overtime_utilization", data_type: "percent", example: closeRecords[0]?.overtime_utilization, used_in_ui: "Labor KPI", notes: "Overtime % of labor" },
    { table: "finance_ledger_row", column: "forecasted_margin", data_type: "percent", example: closeRecords[0]?.forecasted_margin, used_in_ui: "Forecast page", notes: "Forward margin" },
    { table: "finance_ledger_row", column: "variance_status", data_type: "enum", example: "Watchlist", used_in_ui: "Status badges", notes: "Favorable | Watchlist | Unfavorable" },
    { table: "finance_ledger_row", column: "payer_type", data_type: "enum", example: "Commercial", used_in_ui: "Filter, pie chart", notes: "Payer category" },
    { table: "finance_ledger_row", column: "owner", data_type: "string", example: "Carmen Alvarez", used_in_ui: "Owner filter", notes: "Synthetic finance owner" },
    { table: "finance_ledger_row", column: "review_status", data_type: "enum", example: "Analyst Review", used_in_ui: "Workflow column", notes: "Close workflow state" },
    { table: "finance_ledger_row", column: "variance_note", data_type: "text", example: "Supply chain…", used_in_ui: "Row notes", notes: "Auto-generated narrative" },
    { table: "finance_ledger_row", column: "last_updated", data_type: "date", example: closeRecords[0]?.last_updated, used_in_ui: "Export metadata", notes: "Synthetic timestamp" },
  ];
  addTableSheet(wb, "Data_Dictionary", dictionary, {
    tabColor: "FF0D9488",
    wrapCols: ["notes", "used_in_ui"],
  });

  const ledgerCols = {
    currencyCols: [
      "net_patient_revenue",
      "operating_expense",
      "labor_cost",
      "supply_cost",
      "budget_variance",
    ],
    percentCols: ["operating_margin", "denial_rate", "overtime_utilization", "forecasted_margin"],
    integerCols: ["patient_volume", "reimbursement_delay_days"],
    wrapCols: ["variance_note", "facility"],
  };

  addTableSheet(
    wb,
    "Close_Month_Ledger",
    closeRecords.map((r) => ({ ...r })),
    { tabColor: "FF059669", ...ledgerCols }
  );

  addTableSheet(
    wb,
    "Full_Ledger_All_Months",
    records.map((r) => ({ ...r })),
    { tabColor: "FF64748B", ...ledgerCols }
  );

  addTableSheet(
    wb,
    "Combo_Templates",
    LEDGER_COMBO_TEMPLATES.map((t) => ({
      ...t,
      region_scale: REGION_LEDGER_SCALE[t.region] ?? 1,
    })),
    { tabColor: "FFF59E0B", ...ledgerCols }
  );

  const kpiRows = [
    { metric: "Net Patient Revenue (close month)", value: kpis.netPatientRevenue, formula: "SUM(net_patient_revenue)", fmt: "currency" as const },
    { metric: "Operating Expense", value: kpis.operatingExpense, formula: "SUM(operating_expense)", fmt: "currency" as const },
    { metric: "Labor Cost", value: kpis.laborCost, formula: "SUM(labor_cost)", fmt: "currency" as const },
    { metric: "Supply Chain Cost", value: kpis.supplyCost, formula: "SUM(supply_cost)", fmt: "currency" as const },
    { metric: "Operating Margin %", value: kpis.operatingMargin, formula: "(SUM(NPR)-SUM(OpEx))/SUM(NPR)×100", fmt: "percent" as const },
    { metric: "Budget Variance (net)", value: kpis.budgetVariance, formula: "SUM(budget_variance)", fmt: "currency" as const },
    { metric: "Avg Denial Rate %", value: kpis.denialRate, formula: "AVG(denial_rate)", fmt: "percent" as const },
    { metric: "Stewardship Target Margin %", value: STEWARDSHIP_TARGET_MARGIN, formula: "Constant (stewardshipConfig)", fmt: "percent" as const },
    { metric: "Labor Ratio Target %", value: LABOR_RATIO_TARGET, formula: "Constant (stewardshipConfig)", fmt: "percent" as const },
  ];
  addTableSheet(wb, "Derived_KPIs", kpiRows, { tabColor: "FFDC2626" });

  const kpiSheet = wb.getWorksheet("Derived_KPIs");
  if (kpiSheet) {
    kpiRows.forEach((row, i) => {
      const cell = kpiSheet.getRow(i + 2).getCell(2);
      cell.numFmt =
        row.fmt === "currency" ? '"$"#,##0;[Red]("$"#,##0)' : '0.00"%"';
    });
  }

  addTableSheet(
    wb,
    "Dashboard_Filters",
    [
      { filter: "facility", values: facilities.join("; ") },
      { filter: "region", values: regions.join("; ") },
      { filter: "serviceLine", values: serviceLines.join("; ") },
      { filter: "owner", values: owners.join("; ") },
    ],
    { tabColor: "FF8B5CF6" }
  );

  addTableSheet(
    wb,
    "Personas",
    PERSONA_PRESETS.map((p) => ({
      key: p.persona,
      name: p.name,
      email: p.email,
      role: p.role,
      header: p.headerTitle,
      can_sign_close: p.persona === "cfo" ? "Yes" : "No",
    })),
    { tabColor: "FFEC4899" }
  );

  addTableSheet(
    wb,
    "UI_Page_Sources",
    [
      { page: "Executive Tower", data_source: "Aggregated close-month ledger", key_fields: "NPR, margin, checklist" },
      { page: "Financial Dashboard", data_source: "finance_ledger_row (filtered)", key_fields: "All columns; charts use KPI aggregates" },
      { page: "Service Lines", data_source: "Aggregated by service_line", key_fields: "margin, owner, variance" },
      { page: "Forecast & Walk", data_source: "KPIs + driver labels", key_fields: "forecasted_margin" },
      { page: "AI Copilot", data_source: "KPIs + mock narratives", key_fields: "Derived from close month" },
      { page: "Finance Export Suite", data_source: "Filtered ledger + this workbook", key_fields: "CSV + static XLSX" },
    ],
    { tabColor: "FF38BDF8", wrapCols: ["key_fields"] }
  );

  addTableSheet(
    wb,
    "Signoff_Schema",
    [
      { field: "signatoryName", type: "string", notes: "Active persona at sign-off" },
      { field: "signatoryTitle", type: "string", notes: "Role title" },
      { field: "activeMargin", type: "percent", notes: "Margin at certification" },
      { field: "reportingPeriod", type: "string", notes: "FY period tag" },
    ],
    { tabColor: "FFA855F7", wrapCols: ["notes"] }
  );

  const buffer = await wb.xlsx.writeBuffer();
  for (const dir of OUT_DIRS) {
    fs.mkdirSync(dir, { recursive: true });
    const outPath = path.join(dir, DATA_HANDOFF_WORKBOOK_FILENAME);
    fs.writeFileSync(outPath, Buffer.from(buffer));
    console.log(`Wrote ${outPath}`);
  }
  console.log(`Close-month rows: ${closeRecords.length} · Full ledger: ${records.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
