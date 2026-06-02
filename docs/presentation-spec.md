# Data presentation standards (Vercel app)

Acceptance criteria for `feat/data-presentation-standards`. Brand tokens unchanged.

## Formatting

- [ ] All currency in UI uses `src/lib/formatters.ts`
- [ ] Margin deltas use **pts** (`formatPoints`) where comparing percentages
- [ ] Variance dollars use `formatVarianceCurrency`

## Chart integrity

- [ ] Labor mini-chart plots **labor cost ratio %**, not operating margin
- [ ] Forecast driver chart titled **Margin driver bridge** (not "waterfall" unless floating bars)
- [ ] Bar charts use zero baseline
- [ ] No `#A78BFA` / stray purple series — use `chartTheme.forecast`

## Charts UX

- [ ] Y-axis `tickFormatter` on every Recharts chart in pages/
- [ ] Tooltips use `ChartTooltip` or explicit unit formatters
- [ ] Synthetic illustrative charts show `illustrativeNote` where applicable

## Tables & KPIs

- [ ] KPI values use `font-mono` or `tabular-nums`
- [ ] Service line table remains right-aligned numeric

## Release gate

- [ ] `npx tsc --noEmit` passes
- [ ] `npx vite build` passes
- [ ] Production https://hsd-audit.vercel.app matches after merge to `main`
