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
5. **Charts**: actuals = Jan → close month; projections = months after close through December of the same year.

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

## Extending

To roll the synthetic seed forward, add records for the new close month in `syntheticFinanceData.ts` (or generate via script). The UI will pick up the new latest month automatically when the calendar moves past it.
