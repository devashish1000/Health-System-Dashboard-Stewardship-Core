# Reporting period (time-aware demo)

The app derives a single **reporting context** from the current date and the months present in the synthetic ledger.

## Source of truth

- `src/lib/reportingPeriod.ts` — `getReportingContext(records?, asOf?)`
- `src/lib/useReportingPeriod.ts` — React hook for pages/components

## Rules

1. **Close month** = prior calendar month (typical month-end close).
2. If that month is **after** the latest month in `records`, use the **latest available** month (keeps demo data valid).
3. **Fiscal year label** = `FY` + last two digits of close year (calendar-year model).
4. **Period** = `P` + zero-padded month number (`P05` = May) when FY starts in January.
5. **Trend charts** (`trendChartMonths`): actuals Jan → close month, plus in-flight month(s) after close up to `DEMO_AS_OF` (e.g. close May + as-of June 2 → Jan–Jun with June preliminary only). No Jul–Dec on KPI/service-line drills.
6. **`DEMO_AS_OF`**: pinned in `demoOrg.ts` (default `2026-06-02`) — drives ledger, reporting labels, and Excel handoff.

## Wired surfaces

- App header + sidebar workspace chip
- Dashboard default month filter
- `getMonthlyHistory()` month range
- Copilot ledger snapshot + brief timestamp
- Forecast “Last calibrated”
- KPI / service-line trend modals (actual vs projected split)
- AI client fallback answers
- Overview stewardship copy
- Synthetic data badge period label

## Rolling synthetic ledger

- `src/data/generateSyntheticLedger.ts` builds Jan → prior-calendar-month rows from `ledgerComboTemplates.ts`.
- `SYNTHETIC_RECORDS` is regenerated at module load (`syntheticFinanceData.ts`).
- Refresh templates after manual combo edits: `npx tsx scripts/refresh-ledger-templates.mjs`.

## Period-scoped workflow storage

- Checklist: `commonspirit_checklist_FY26_P05` (via `checklistStorageKey()`).
- Sign-offs: certificate includes `reportingPeriod` tag (`FY26-P05-YYYY-MM`).

## Extending

When the calendar advances, the generator adds months automatically. To change baseline combos, edit templates and re-run the refresh script.
