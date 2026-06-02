/**
 * client-side helper to make co-pilot requests to our server API.
 */

// Offline safe questions in case of API failure or missing keys
const SAFE_CLIENT_ANSWERS: Record<string, string> = {
  "why is operating margin below target?": `### Primary Driver: Operating Margin Compression

Our health system operating margin is currently **7.4%**, representing a **-1.1 percentage point** variance from our **8.5%** target.

#### Critical Diagnostics:
1. **Contract/Registry Nurses**: Increased emergency volume required premium clinical labor overrides ($11.2M actual, +2.4 pts vs budget).
2. **Cardiology Claim Denials**: 6.2% denial rate at St. Joseph Medical Center, locking up critical reimbursement.
3. **Government Payer Shift**: Procedural volume migrated minor percentages toward Medicaid.`,

  "what drove unfavorable budget variance?": `### Budget Variance Driver Breakdown

System-wide performance highlights a net unfavorable budget variance of **-$1.8M** for May 2026.

#### Principal Drivers:
* **Agency Registry Premium** (-$1.2M): Driven by critical staffing shortages in Mountain and Midwest emergency lines.
* **Surgical supplies vendor adjustments** (-$450K): Higher prosthetic materials and custom implants pricing.
* **Outpatient imaging overperformance** (+$280K favorable offset): Diagnostics offset some of the labor cost impact.`,

  "which service line needs attention?": `### Priority Service Lines Watchlist

The financial metrics highlight **Cardiology** and **Emergency Departments** as key areas requiring stewardship.

* **Cardiology (St. Joseph)**: Has -$800,000 budget variance, with an elevated commercial denial rate of **6.2%** leading to AR delayed collections of **61 days**.
* **Emergency Divisions**: Running sub-zero margins (-10.0% CHI Immanuel) due to continuous premium nursing requirements to address high patient boarding.`,

  "how much of the variance is labor-driven?": `### Labor Variance Contribution Analysis

Approximately **66% of major unfavorable variance** relates to clinical scheduling labor pressure:

* **Overtime Overage**: At **14.2%** in St. Joseph Cardiology and **12.1%** in CHI Immanuel Emergency (safety threshold is ≤ 5%).
* **Contract Premiums**: High-cost traveling registry contracts averaging $220/hour.
* **Correction Strategy**: Regional float pool realignment and nurse retention scheduling standard work.`,

  "what changed this month?": `### Performance Vectors Delta

* **Patient Volume Expansion**: High-margin MRI, CT, and elective Orthopedics rose **+4.5%** overall, which is favorable.
* **Documentation Complexity**: Increased commercial insurance denials pushing AR collections from 41 days in March to **49 days** in May.
* **Cost Acceleration**: Nurse recruitment premiums showing high temporary escalation.`,

  "generate a leadership-ready finance brief.": `# STEWARDSHIP BRIEFING: HEALTH SYSTEM LEADERSHIP REVIEW
**Prepared by Healthcare Financial Performance Control Tower**

## System Perspective
Our operating margin of **7.4%** demonstrates financial stability but falls short of our **8.5%** budget target. Our core mission requires resolving specialized labor spikes and denial backlogs.

## Financial Blueprint
* **Collection performance**: NPR is $48.7M (+3.2% vs budget).
* **Expenditure oversight**: Expense is $45.1M (+4.8% vs budget).
* **Labor ratio**: Operating at 42.6% (+2.4 pts elevated variance).

## Recommended Stewardship Actions
1. **Payer authorization review**: Launch clinical taskforce with St. Joseph Cardiology to combat prior authorization bottlenecks.
2. **Registry reduction program**: Displace contract nurse registry shifts with unified flexible system float staff.
3. **Implant procurement standard work**: Partner with surgical leadership to limit implants supplier varieties.`,

  "which facility has the highest expense pressure?": `### Expense Outliers Report

**St. Joseph Medical Center** shows the largest ongoing expense variance.

* **Total Overages**: $15.5M total operational expense.
* **Underlying Factor**: Cardiology overtime registered at **14.2%** alongside a **6.2%** commercial denial index, pushing reimbursement timing to **61 days**.
* **Recommendation**: Implement daily scheduling safety audits and streamline medical supplies inventory control.`
};

export interface CopilotResponse {
  text: string;
  isMock: boolean;
  error?: string;
}

export async function askGeminiFinance(prompt: string): Promise<CopilotResponse> {
  const normalizedPrompt = prompt.toLowerCase().trim();

  try {
    const response = await fetch("/api/copilot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });

    if (!response.ok) {
      throw new Error(`HTTP network status error ${response.status}`);
    }

    const data = await response.json();
    return {
      text: data.text,
      isMock: data.isMock ?? false
    };

  } catch (error: any) {
    console.warn("API proxy call failed, activating client fallback:", error);
    
    // Look up client side responses
    let answer = "";
    for (const [key, val] of Object.entries(SAFE_CLIENT_ANSWERS)) {
      if (normalizedPrompt === key || normalizedPrompt.includes(key) || key.includes(normalizedPrompt)) {
        answer = val;
        break;
      }
    }

    if (!answer) {
      answer = `### AI Decision-Support Brief (Client-Side Safe Mode)

We have activated the local health system intelligence module. Fulfilling query: **"${prompt}"**

#### Primary Stewardship Diagnosis:
We observe an operating margin of **7.4%** across regions. Premium registry clinical labor and a **6.2%** cardiology denial rate are the system-wide margin-limiting variables.

*Advice: This dataset is synthetic for demonstrating prototype design goals. Human oversight mandatory.*`;
    }

    return {
      text: answer,
      isMock: true,
      error: error.message
    };
  }
}
