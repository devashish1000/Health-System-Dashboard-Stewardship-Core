# Data presentation standards (Vercel app)

Acceptance criteria for `feat/data-presentation-standards`. Brand tokens unchanged.

## Formatting

- [x] All currency in UI uses `src/lib/formatters.ts`
- [x] Margin deltas use **pts** (`formatPoints`) where comparing percentages
- [x] Variance dollars use `formatVarianceCurrency`

## Chart integrity

- [x] Labor mini-chart plots **labor cost ratio %**, not operating margin
- [x] Forecast driver chart titled **Margin driver bridge** (not "waterfall" unless floating bars)
- [x] Bar charts use zero baseline
- [x] No `#A78BFA` / stray purple series — use `chartTheme.forecast`

## Charts UX

- [x] Y-axis `tickFormatter` on every Recharts chart in pages/
- [x] Tooltips use `ChartTooltip` or explicit unit formatters
- [x] Synthetic illustrative charts show `illustrativeNote` where applicable

## Tables & KPIs

- [x] KPI values use `font-mono` or `tabular-nums`
- [x] Service line table remains right-aligned numeric

## Manual Vercel QA (A8)

Run the step-by-step checklist in [`docs/screenshots/presentation-audit/README.md`](screenshots/presentation-audit/README.md) against production **after** merge to `main` (or the PR preview if validating pre-merge).

| Area | What to verify |
|------|----------------|
| Login | Sandbox personas, form flow, post-login landing |
| Dashboard | Chart tooltips (units, formatting, labor ratio chart) |
| Forecast bridge | Driver chart title, series colors, tooltip **pts** / % |
| Dark mode | Header theme toggle; cards, charts, and text contrast |

Save captures under `docs/screenshots/presentation-audit/` using the naming convention in that README.

## Release gate

- [x] `npx tsc --noEmit` passes
- [x] `npx vite build` passes
- [ ] Manual Vercel QA checklist completed (see above)
- [ ] Production https://hsd-audit.vercel.app matches after merge to `main`
