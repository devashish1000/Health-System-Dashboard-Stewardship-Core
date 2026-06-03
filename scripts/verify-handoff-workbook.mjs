#!/usr/bin/env node
/**
 * Validates the data handoff workbook structure for executive review.
 * Run after: npm run handoff:excel
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import XLSX from "xlsx";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const file = path.join(
  root,
  "public",
  "data-handoff",
  "CommonSpirit-Control-Tower-Data-Handoff.xlsx"
);

const EXPECTED_SHEETS = [
  "About",
  "How_to_Read",
  "Data_Dictionary",
  "Close_Month_Ledger",
  "Full_Ledger_All_Months",
  "Combo_Templates",
  "Derived_KPIs",
  "Dashboard_Filters",
  "Personas",
  "UI_Page_Sources",
  "Signoff_Schema",
];

let failed = 0;
function fail(msg) {
  console.error(`FAIL: ${msg}`);
  failed++;
}
function pass(msg) {
  console.log(`PASS: ${msg}`);
}

if (!fs.existsSync(file)) {
  fail(`Missing ${file}`);
  process.exit(1);
}

const stat = fs.statSync(file);
if (stat.size < 50_000) {
  fail(`File too small (${stat.size} bytes)`);
} else {
  pass(`File size ${(stat.size / 1024).toFixed(1)} KB`);
}

const wb = XLSX.readFile(file);
const names = wb.SheetNames;

if (names.join("|") !== EXPECTED_SHEETS.join("|")) {
  fail(`Sheet order mismatch.\n  got: ${names.join(", ")}\n  exp: ${EXPECTED_SHEETS.join(", ")}`);
} else {
  pass(`Sheet order (${names.length} tabs)`);
}

const close = XLSX.utils.sheet_to_json(wb.Sheets["Close_Month_Ledger"]);
if (close.length < 60) {
  fail(`Close_Month_Ledger has only ${close.length} rows (target 64)`);
} else {
  pass(`Close_Month_Ledger ${close.length} rows`);
}

const requiredCols = [
  "id",
  "month",
  "facility",
  "region",
  "service_line",
  "net_patient_revenue",
  "operating_margin",
];
const sample = close[0] || {};
for (const col of requiredCols) {
  if (!(col in sample)) fail(`Close_Month_Ledger missing column: ${col}`);
}
if (failed === 0) pass("Close-month columns present");

const about = XLSX.utils.sheet_to_json(wb.Sheets["About"], { header: 1 });
const flat = about.flat().join(" ");
if (!flat.includes("Synthetic") && !flat.includes("synthetic")) {
  fail("About sheet missing synthetic disclaimer");
} else {
  pass("About sheet disclaimer present");
}

const dict = XLSX.utils.sheet_to_json(wb.Sheets["Data_Dictionary"]);
if (dict.length < 15) {
  fail(`Data_Dictionary only ${dict.length} rows`);
} else {
  pass(`Data_Dictionary ${dict.length} rows`);
}

console.log(failed ? `\n${failed} check(s) failed.` : "\nAll handoff workbook checks passed.");
process.exit(failed ? 1 : 0);
