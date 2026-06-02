# Presentation audit — manual Vercel QA

Checklist for **agent A8** / release reviewers validating `feat/data-presentation-standards` on the live app.

| Field | Value |
|-------|--------|
| **URL** | https://hsd-audit.vercel.app |
| **When** | After deploy to `main`, or PR preview URL if validating before merge |
| **Spec** | [`docs/presentation-spec.md`](../../presentation-spec.md) |
| **Scope** | Data presentation only — brand tokens and layout shell unchanged |

## Before you start

- [ ] Confirm the deployment matches the target branch (Vercel dashboard or PR comment link).
- [ ] Use a desktop viewport (~1280×800 or wider); note mobile only if regressions are suspected.
- [ ] Clear prior captures in this folder or use a new date suffix so before/after pairs stay obvious.

## Screenshot naming

Save PNGs in **this directory** (`docs/screenshots/presentation-audit/`):

| Pattern | Example |
|---------|---------|
| `{area}-{light\|dark}-{YYYYMMDD}.png` | `dashboard-tooltips-light-20260602.png` |
| `login-{step}-{YYYYMMDD}.png` | `login-success-20260602.png` |
| `forecast-bridge-{light\|dark}-{YYYYMMDD}.png` | `forecast-bridge-dark-20260602.png` |

---

## 1. Login

**Route:** `/` (unauthenticated)

- [ ] Page loads without console errors (spot-check DevTools if anything looks broken).
- [ ] Brand shell: white/airy login, CommonSpirit mark, humankindness copy — not legacy navy “AI Studio” shell.
- [ ] Four persona cards visible (Analyst, CFO, Clinical Director, Compliance Auditor).
- [ ] Selecting a persona fills email and enables **Sign in securely**.
- [ ] Submit shows loading state, then success transition into the app (Overview or last route).
- [ ] Footer notes mock sandbox / synthetic data (no PHI).

**Capture:** `login-main-{YYYYMMDD}.png`, `login-success-{YYYYMMDD}.png`

---

## 2. Dashboard — chart tooltips

**Nav:** Sidebar → **Dashboard** (Stewardship Control Tower).

Hover each chart long enough for the Recharts tooltip to appear. Record failures in the sign-off table at the bottom.

### Labor cost ratio mini-chart

- [ ] Chart plots **labor cost ratio %** (not operating margin or unrelated KPI).
- [ ] Y-axis ticks show **%** (via `formatAxisPercent` or equivalent).
- [ ] Tooltip values use **%** with sensible precision (not raw unformatted floats).

### Operating margin trend (actual vs forecast)

- [ ] Series legend distinguishes actual vs forecast; forecast line uses theme forecast color (**not** stray `#A78BFA` purple).
- [ ] Tooltip shows **%** for margin series.

### Other Dashboard charts (revenue, expense, pie)

- [ ] Every chart has readable Y-axis `tickFormatter` (currency, %, or $M as appropriate).
- [ ] Tooltips use `ChartTooltip` or explicit formatters — currency shows `$`, K/M suffixes consistent with `formatters.ts`.
- [ ] No tooltip shows bare unformatted numbers where a formatter exists.

### KPI strip

- [ ] KPI values use `font-mono` or `tabular-nums` for alignment.
- [ ] Margin deltas that compare percentages show **pts** where spec requires (`formatPoints`).

**Capture:** `dashboard-tooltips-light-{YYYYMMDD}.png` (tooltip visible on labor or margin chart).

---

## 3. Forecast — margin driver bridge

**Nav:** Sidebar → **Forecast & Walk**.

### Monthly margin forecast (line chart)

- [ ] Title/copy references margin **forecast** / target alignment (not misleading “waterfall” label on this chart).
- [ ] Forecast series stroke matches `chartTheme.forecast` (no `#A78BFA`).
- [ ] Y-axis and tooltip format **%** for margin fields.

### Margin driver bridge (bar chart)

- [ ] Section title reads **Margin driver bridge** (or equivalent per `presentation-spec.md` — not generic “waterfall” unless chart uses floating bars).
- [ ] Bars use zero baseline; favorable/unfavorable colors distinct; cumulative anchors readable.
- [ ] Tooltip shows driver impact in **pts** or **%** consistently (e.g. `+0.8 pts`, not ambiguous unitless values).
- [ ] Driver contribution list below charts uses **pts** for margin impacts where applicable.

**Capture:** `forecast-bridge-light-{YYYYMMDD}.png`, optional hover tooltip capture.

---

## 4. Dark mode

**Control:** Header **theme toggle** (sun/moon) — test on Dashboard and Forecast at minimum.

- [ ] Toggle switches `html`/`body` dark class; no flash of broken layout.
- [ ] Cards: `dark:bg-ink-800`, borders `dark:border-white/10` — readable, not flat gray-on-gray.
- [ ] Primary text: `dark:text-slate-100` / body copy `dark:text-slate-200` — WCAG-ish contrast on ink backgrounds.
- [ ] Chart grids and axes remain visible (grid stroke not invisible on dark bg).
- [ ] Tooltips/tooltip panels readable in dark mode (background + text contrast).
- [ ] Brand accent (magenta/teal) unchanged; only presentation surfaces adapt.

Repeat **§2** and **§3** spot-checks in dark mode (one tooltip hover each).

**Capture:** `dashboard-tooltips-dark-{YYYYMMDD}.png`, `forecast-bridge-dark-{YYYYMMDD}.png`

---

## Sign-off

| Reviewer | Date | Environment (prod / preview) | Pass? |
|----------|------|------------------------------|-------|
| | | | ☐ |

**Blockers** (link spec section + screenshot):

1.
2.

**Notes:**

---

## Quick reference — spec violations to reject

- Currency not routed through `src/lib/formatters.ts`
- Purple `#A78BFA` forecast line
- Labor mini-chart showing operating margin instead of labor cost ratio %
- Forecast bridge titled “waterfall” without floating-bar semantics
- Missing Y-axis formatters on Recharts charts in `pages/`
- Dark mode illegible tooltips or chart axes
