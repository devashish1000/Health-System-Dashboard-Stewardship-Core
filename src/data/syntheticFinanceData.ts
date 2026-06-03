export type { FinanceRecord } from "../types/financeRecord";
import { DEMO_AS_OF } from "../config/demoOrg";
import { buildSyntheticLedger } from "./generateSyntheticLedger";

/** Synthetic ledger Jan → prior calendar month of DEMO_AS_OF (May 2026 when as-of is 2026-06-02). */
export const SYNTHETIC_RECORDS = buildSyntheticLedger(DEMO_AS_OF);
