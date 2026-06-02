import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

// Pre-packaged high-quality deterministic responses for various questions to use as safe failover
const SAFE_DETERMINISTIC_RESPONSES: Record<string, string> = {
  "why is operating margin below target?": `### Primary Driver: Operating Margin Compression

Our collective health system operating margin is currently at **7.4%**, which represents an unfavorable variance of **-1.1 percentage points** relative to our financial budget target of **8.5%**.

#### Breakdown of Underlying Factors:
1. **Clinical Staffing Costs & Premium Labor Allocation**: Standard nurse vacancies in neurology and emergency service lines have necessitated high-cost registry (contract) clinicians and nurse hiring premiums ($11.2M total labor cost; 42.6% labor ratio, +2.4 pts vs budget).
2. **Denial Activity Growth**: Commercial denials at *St. Joseph Medical Center* have spiked to **6.2%**, locking up approximately $1.1M in diagnostic and cardiology reimbursement delay.
3. **Payer Mix Shifts**: A slight migration of elective orthopedics and imaging procedures from commercial payers to Medicare or charity care/Medicaid in our Midwest facilities.

#### Recommended Financial Stewardship Action:
* Organize a cross-functional labor variance review with regional clinical leadership.
* Establish standard documentation checkpoints to proactively address prior authorization pain points.
* Track outlier and high-cost implants to enforce vendor alignment contract compliance.`,

  "what drove unfavorable budget variance?": `### Budget Variance Driver Breakdown

Review of cumulative financial results indicates a net unfavorable budget variance of **-$1.8M** for the current month-end cycle.

#### Key Driver Contribution Analysis:
* **Premium Agency Labor Overages** (-$1.2M variance impact): Mainly localized in Emergency and ICU divisions at CHI Health Mercy and Mercy General facilities.
* **Supply Chain Implant Markup** (-$450K variance impact): Unaligned vendor adjustments for orthopedic and knee replacement inserts.
* **Diagnostics Denial Penalties** (-$150K variance impact): Delayed or denied claims during prior-authorization reviews.

These pressures were partially offset by a favorable high-margin diagnostics volume surge in outpatient Imaging at CHI Health Mercy Council Bluffs and CHI Lakeside.`,

  "which service line needs attention?": `### Priority Watchlist Service Line Analysis

The **Cardiology** and **Emergency Department (ED)** service lines require immediate, focused attention.

#### 1. Cardiology (St. Joseph Medical Center)
* **Status**: Highly Unfavorable Budget Variance (-$800,000)
* **Concern**: Extreme prior authorization delays with commercial payers and Medicare Part C, registering a denial rate of **6.2%**. This has inflated reimbursement delays to **61 days**. 
* **Focus**: Director-level variance review of cardiology medical billing reconciliation.

#### 2. Emergency Departments (CHI Immanuel & Mercy General)
* **Status**: Sub-zero operating margins (-10.0% & -5.7% respectively)
* **Concern**: High registry labor reliance and substantial patient boarding bottlenecks.
* **Focus**: Leverage regional float pools and review safe SNF transitional discharge plans.`,

  "how much of the variance is labor-driven?": `### Labor Variance Decomposition Analysis

Approximately **66% of the current month's unfavorable budget variance** is directly attributable to clinical labor cost pressures.

#### Labor KPI Core Indicators:
* **Overtime Utilization**: Registering at **14.2%** average within St. Joseph Cardiology and **12.1%** in CHI Immanuel Emergency (healthy standard threshold is ≤ 5%).
* **Registry (Contract) Premium**: Average registry rate of $220/hour compared to standard full-time employee rate equivalent of $85/hour.
* **Stewardship Target**: Implementing internal shift-incentive packages to decrease contract registry nursing by **4.5 FTEs** over the upcoming 60-day window.`,

  "what changed this month?": `### Financial Driver Delta Summary

The primary change this month-end is the **divergence between patient volume growth and reimbursement collection velocity**.

#### Monthly Performance Shifts:
* **The Good**: Patient volumes recovered strongly (+4.5% overall) across elective imaging and general preventive clinic segments.
* **The Challenge**: A matching increase in documentation audits and commercial payer prior authorization denials. 
* **Net Revenue Impact**: Although clinic doors are busy, cash flow is constrained by a net AR delay rise to **49 days** (up from 41 days in March).`,

  "generate a leadership-ready finance brief.": `# EXECUTIVE BRIEF: HEALTHCARE FINANCE STEWARDSHIP SUMMARY
**Prepared for Health System Leadership Team**

## Executive Perspective
As a mission-driven health system, our financial stewardship directly supports our ability to provide high-quality care to our communities. In the current month-end cycle, our operating margin of **7.4%** remains below our target of **8.5%**. Restoring this margin requires targeted discipline around labor management and revenue cycle denial velocity.

## Strategic Highlights
* **Budget-to-Actual Net Patient Revenue**: $48.7M (+3.2% vs budget), demonstrating strong community trust and volume recapture.
* **Operating Expense Variance**: $45.1M (+4.8% vs budget), showing watchlist cost pressure.
* **Labor Cost Stewardship**: Labor-to-revenue ratio hit 42.6% due to high registry nurse usage.

## Corrective Review Actions
1. **Active Registry Contract Reduction**: Transition 6 temporary registry contracts to internal flexible travel contracts within Midwest and Southwest departments.
2. **Prior-Authorization Standard Work**: Deploy specialist coders to cardiology pre-service audits to target St. Joseph's 6.2% denial outliers.
3. **Vendor implant renegotiation**: Leverage multi-facility buying power to standardize orthopedic suppliers.`,

  "which facility has the highest expense pressure?": `### Facility Expense Pressure Audit

**St. Joseph Medical Center** exhibits the highest systemic operating expense pressure due to specialized service complexity.

#### Core Financial Breakdown:
* **Total Operating Expenses**: $15.5M (Cardiology & Neurology combined)
* **Overtime Overage**: Cardiology overtime is at **14.2%**, standard system baseline is 5%.
* **Denials Spike**: 6.2% billing rejection rate, causing an average payment delay of **61 days**.

#### Collaborative Action Plan:
Coordinate with St. Joseph's regional hospital director to deploy standard scheduling templates and audit medical supplies procurement vendor contracts.`
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // API router endpoint
  app.post("/api/copilot", async (req, res) => {
    try {
      const { prompt, model: requestedModel } = req.body;
      const lowerPrompt = (prompt || "").toLowerCase().trim();

      // Check if user requested a question we have preconfigured
      let matchedResponse = "";
      for (const [key, val] of Object.entries(SAFE_DETERMINISTIC_RESPONSES)) {
        if (lowerPrompt === key || lowerPrompt.includes(key) || key.includes(lowerPrompt)) {
          matchedResponse = val;
          break;
        }
      }

      const apiKey = process.env.GEMINI_API_KEY;

      // Safe fail-fast local mode if API key is not configured or placeholder is present
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
        console.log("Gemini API key is not set. Falling back to local deterministic responses.");
        return res.json({
          text: matchedResponse || (
            `### AI Stewardship Insights (Deterministic Mock Mode)\n\nThank you for asking about: **"${prompt}"**.\n\nOur healthcare finance SaaS control tower identifies that **labor staffing overtime utilization** and **imaging/cardiology diagnostics denials** represent the core budget drivers for the Midwest and Mountain regions. Adjusting our clinical float pool and optimizing pre-service prior authorization is recommended to restore our target **8.5%** margin.`
          ),
          isMock: true,
          notice: "Deterministic support mode. Human oversight is mandatory."
        });
      }

      // Initialize server-side Gemini client
      console.log(`Calling Gemini API via model gemini-3.5-flash with prompt length ${prompt.length}`);
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: `You are an executive healthcare finance co-pilot assistant for a large nonprofit, mission-driven health system (like CommonSpirit Health). 
You must always ground your communication in financial stewardship, supporting care delivery, mission-driven financial analytics, resource allocation, and budget variance analysis.
Avoid profit maximization, aggressive cost cutting, revenue extraction, or language implying that AI replaces human financial analysts.

Formulate your response in clean markdown with headers, bullet points, and highlight critical numbers. Keep it concise, executive-ready, and professional. 
Always include a tiny warning/disclaimer at the end about synthetic data and human review requirements.
If the prompt relates to one of these predefined topics:
- margin below target
- budget variance
- prioritize service lines
- labor costs
- what changed this month
- finance brief
- expense pressure
Reference relevant synthetic coordinates (operating margin target 8.5%, actual 7.4%, labor cost ratio 42.6%, budget variance -$1.8M, Cardiology denial rate 6.2% or similar).`
        },
      });

      const textOutput = response.text || "No response received from the model.";
      return res.json({
        text: textOutput,
        isMock: false
      });

    } catch (err: any) {
      console.error("Gemini API server exception:", err);
      // Fallback response inside error state to guarantee beautiful UX
      return res.status(200).json({
        text: `### Decision-Support Insight (Graceful local fallback on API error)

We have activated our local high-reliability analytics engine due to a temporary gateway issue.

#### Key Variance Resolution Recommendation:
Our financial control tower recommends reviewing contract registry nurses in outpatient Cardiology clinics. Reducing shift premiums down to 4.5% overtime will recover **+$380,000** in budget variance over the next quarter.

*Notice: This is a safe deterministic response to guarantee application availability. Human analysis required.*`,
        error: err.message,
        isMock: true
      });
    }
  });

  // Client-side static or Vite configurations
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Loaded Vite middleware in development mode.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static production assets from dist/.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Healthcare Control Tower server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Critical server startup crash:", error);
});
