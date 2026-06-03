# Typography & contrast audit

## Root cause (fixed)

Dark mode set `color: #e8e8eb` on `body` while many surfaces stayed `bg-white` / `bg-slate-50`, producing near-white text on light cards (unreadable page titles and checklist rows).

## Fixes

- Removed global dark text color from `body`; use semantic classes instead.
- App shell: `dark:bg-ink-950` on logged-in layout.
- `PageHeader` + `.text-page-title` / `.text-page-subtitle` / `.text-on-surface` / `.text-muted-surface`.
- Overview month-end tasks: `dark:bg-ink-800` on unchecked cards.
- Header chrome buttons: dark variants on Export / Take Tour.

### Dark-mode data surfaces (second pass)

- `resolveChartPalette()` — chart grid/axis/tick colors adapt to theme (`src/lib/chartColors.ts`).
- `metricColors.ts` — NPR, margin %, variance, captions readable on `dark:bg-ink-800` cards.
- Dashboard charts + service-line matrix + Service Lines cards updated.
- Forecast charts + KPI / service-line modals use theme-aware axis ticks.

## Manual verify

1. https://hsd-audit.vercel.app — light + dark toggle on Copilot, Forecast, Overview checklist.
2. Titles must read as **slate-900** on light, **slate-50** on dark canvas.
