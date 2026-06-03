import { writeFileSync } from "node:fs";
import { LEDGER_COMBO_TEMPLATES } from "../src/data/ledgerComboTemplates.ts";

const remove = new Set([
  "Baylor St. Luke's Medical Center|Revenue Cycle",
  "Baylor St. Luke's Medical Center|Primary Care",
  "Mercy Gilbert|Surgical Supplies",
  "Mercy Lakewood|Surgical Supplies",
  "CHI Immanuel|Medical Devices",
  "St. Anthony North|Neurology",
]);

const trimmed = LEDGER_COMBO_TEMPLATES.filter(
  (t) => !remove.has(`${t.facility}|${t.service_line}`)
);

if (trimmed.length !== 64) {
  throw new Error(`Expected 64 templates after trim, got ${trimmed.length}`);
}

writeFileSync(
  "src/data/ledgerComboTemplates.ts",
  `// Combo templates for synthetic ledger generation (64 facility×service-line seeds)\n` +
    `export const LEDGER_COMBO_TEMPLATES = ${JSON.stringify(trimmed, null, 2)} as const;\n`
);
console.log("Trimmed to 64 templates");
