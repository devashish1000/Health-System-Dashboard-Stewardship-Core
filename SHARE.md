# Sharing the Control Tower (demo guide)

**Live app:** [https://hsd-audit.vercel.app](https://hsd-audit.vercel.app)

**What this is:** A concept prototype of a healthcare **financial performance control tower** — month-end variance, service-line drill-down, forecasting, AI decision support, and digital sign-off. Built to show how analytics/BI work translates into health-system finance (stewardship, not investor dashboards).

**What this is not:** A production CommonSpirit product, real financial system, or source of truth. All data is **synthetic**. No PHI.

---

## Disclaimer (say this in the first 30 seconds)

> “This is a portfolio concept I built to show how a regional health system could run month-end stewardship in one place. It uses **synthetic data** and CommonSpirit **only as a realistic scenario** — it is **not affiliated with or endorsed by CommonSpirit Health**. Numbers update with the simulated close month, but they are illustrative.”

---

## Who this demo is for

| Audience | What to emphasize |
|----------|-------------------|
| **CommonSpirit Finance (Houston / supply chain)** | Sr Financial Analyst login → filter **Houston Market** / Baylor St. Luke's → supply variance → sign-off |
| **Regional CFO / finance leaders** | Problem → dashboard variance → one service line → forecast → sign-off |
| **Hiring / portfolio reviewers** | Story + your build choices + **Responsible AI & Dev** (guardrails + profile) |
| **Technical reviewers** | ⌘K command palette, formatters, rolling ledger, optional live Gemini Copilot |

---

## 3-minute click path (Finance / supply chain — interview handoff)

1. **Login** — Default **Sr Financial Analyst (Devashish Neupane)** — or switch to **Market Finance** for sign-off demo.
2. **Skip tour** if prompted (or run it once offline).
3. **Executive Tower (Overview)** — 30-second problem, illustrative ROI, “how it fits your org.”
4. **Financial Dashboard** — KPIs, filters, labor ratio chart, margin trend.
5. **Service Lines Review** — Open one row (e.g. Cardiology), add a note, close drawer.
6. **Forecast & Walk** — Margin driver bridge and projection context.
7. **AI Finance Copilot** — Click a suggested question chip (uses close-month ledger).
8. **Pre-flight Signoff** (header) — Finalize review modal as CFO (certification story).
9. **Optional:** **Responsible AI & Dev** for ethics + builder context (best for hiring).

**Do not lead with:** Pixel Auditor QA (removed from nav; engineering-only page).

---

## Power features to mention

- **⌘K / Search** — Navigation, export, clear filters, persona switch, service-line drills, quick AI (`/ai` prefix).
- **FY / period chip** — Labels follow simulated month-end close (e.g. FY26 P05).
- **Personas** — Analyst vs CFO (sign-off authority differs).
- **Export** — CSV/JSON audit trail from the overflow menu or palette.

---

## Before you share (checklist)

- [ ] Production URL loads: [https://hsd-audit.vercel.app](https://hsd-audit.vercel.app)
- [ ] **Vercel env:** `GEMINI_API_KEY` set if you want **live** Copilot (otherwise curated fallbacks still work).
- [ ] Run through the 3-minute path once on desktop (~1280px wide).
- [ ] Optional: `node scripts/qa-command-palette.mjs` with dev server for ⌘K regression.

---

## Local run

```bash
npm install
cp .env.example .env.local   # add GEMINI_API_KEY for live Copilot
npm run dev                  # http://127.0.0.1:3000
```

---

## Origin (ChatGPT → AI Studio → this repo)

The original idea was: *don’t just show charts — explain what problem this solves for a health system, who uses it, and why a CFO would trust it.* That became the Overview value layer, page purpose banners, guided tour, and stewardship/sign-off flows in this codebase.
