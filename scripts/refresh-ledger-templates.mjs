/**
 * Re-exports May-close combo templates from the generated ledger (after manual edits).
 * Usage: npx tsx scripts/refresh-ledger-templates.mjs
 */
import { writeFileSync } from "fs";
import { SYNTHETIC_RECORDS } from "../src/data/syntheticFinanceData.ts";
import { getReportingContext } from "../src/lib/reportingPeriod.ts";

const reporting = getReportingContext(SYNTHETIC_RECORDS);
const closeRows = SYNTHETIC_RECORDS.filter((r) => r.month === reporting.closeMonth);
const templates = closeRows.map(
  ({
    facility,
    region,
    service_line,
    net_patient_revenue,
    operating_expense,
    labor_cost,
    supply_cost,
    operating_margin,
    budget_variance,
    patient_volume,
    payer_mix_index,
    denial_rate,
    reimbursement_delay_days,
    overtime_utilization,
    forecasted_margin,
    variance_status,
    payer_type,
    owner,
  }) => ({
    facility,
    region,
    service_line,
    net_patient_revenue,
    operating_expense,
    labor_cost,
    supply_cost,
    operating_margin,
    budget_variance,
    patient_volume,
    payer_mix_index,
    denial_rate,
    reimbursement_delay_days,
    overtime_utilization,
    forecasted_margin,
    variance_status,
    payer_type,
    owner,
  })
);

writeFileSync(
  "src/data/ledgerComboTemplates.ts",
  `// Combo templates for synthetic ledger generation (close month: ${reporting.closeMonth})\n` +
    `export const LEDGER_COMBO_TEMPLATES = ${JSON.stringify(templates, null, 2)} as const;\n`
);
console.log(`Wrote ${templates.length} templates for ${reporting.closeMonth}`);
