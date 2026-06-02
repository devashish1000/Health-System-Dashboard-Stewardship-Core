# Wave 1 handoff (data presentation swarm)

Branch: `feat/data-presentation-standards`

## Imports

```ts
import { formatCurrency, formatPercent, formatPoints, formatVarianceCurrency, formatAxisPercent, formatAxisMillions } from "../lib/formatters";
import { chartTheme, chartMargins } from "../lib/chartTheme";
import { seriesLabels, illustrativeNote } from "../lib/chartSemantics";
import ChartTooltip from "../components/charts/ChartTooltip";
```

## File ownership (do not edit files outside your list)

| Agent | Files |
|-------|--------|
| A6 | `src/lib/financeCalculations.ts` |
| A1 | `src/pages/Dashboard.tsx` |
| A2 | `src/pages/Forecast.tsx` |
| A3 | `src/components/KpiTrendModal.tsx`, `src/components/ServiceLineTrendModal.tsx` |
| A4 | `src/pages/Overview.tsx`, `src/pages/ServiceLines.tsx`, `src/pages/Simulator.tsx` |
| A5 | `src/components/FinalizeReviewModal.tsx`, `src/components/ExportDataModal.tsx`, `src/pages/Copilot.tsx` |
| A7 | `src/pages/VisualRegression.tsx` |
| A8 | `docs/presentation-spec.md`, `docs/screenshots/presentation-audit/` |

## A6 blocker for A1

Add `laborCostRatio` to each row in `getMonthlyHistory()`:
`(laborCost / netPatientRevenue) * 100` when revenue > 0, else 0.
