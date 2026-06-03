# Data handoff workbook

**File:** `CommonSpirit-Control-Tower-Data-Handoff.xlsx`

Excel documentation of every column and table the Vercel control tower uses (`https://hsd-audit.vercel.app`). Share this with Finance reviewers so they can see the synthetic ledger structure without opening the repo.

## Sheets

| Sheet | Contents |
|-------|----------|
| **About** | Cover page — disclaimer, live URL, close month |
| **How_to_Read** | Sheet index and audience guide for executives |
| **Data_Dictionary** | Every `finance_ledger_row` column, type, UI usage |
| **Close_Month_Ledger** | Rows the app uses for current KPIs (default close month) |
| **Full_Ledger_All_Months** | Complete generated ledger (rolling months) |
| **Combo_Templates** | Seed rows before scaling/drift (`ledgerComboTemplates.ts`) |
| **Personas** | Login / workspace roles (synthetic names) |
| **Dashboard_Filters** | Filter fields and allowed values |
| **Derived_KPIs** | How Overview/Dashboard totals are calculated |
| **Signoff_Schema** | Pre-flight certification fields (localStorage) |
| **UI_Page_Sources** | Which pages read which tables |

## Regenerate

```bash
npm run handoff:excel   # writes docs/ + public/ (served at /data-handoff/…)
npm run handoff:verify  # structural checks
```

Uses **exceljs** for executive formatting (frozen headers, currency/percent formats, tab colors). Data is built from the same TypeScript generators as the running app.

**Scale (Option C):** 64 facility×service-line templates × 5 YTD months ≈ **320 ledger rows**; close month **64 rows**.

**In-app:** Finance Export Suite → **Data handoff workbook (Excel)**; Executive Tower hero links to the same file.
