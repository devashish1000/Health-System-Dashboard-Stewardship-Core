export type { FinanceRecord } from "../types/financeRecord";
import { buildSyntheticLedger } from "./generateSyntheticLedger";

/** Rolling synthetic ledger through prior calendar month (regenerated at module load). */
export const SYNTHETIC_RECORDS = buildSyntheticLedger();
