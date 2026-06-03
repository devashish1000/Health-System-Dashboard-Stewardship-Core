/**
 * Exhaustive Intel-Palette (⌘K / Search) QA
 * Run: node scripts/qa-command-palette.mjs
 */
import { chromium } from "playwright";

const BASE = process.env.QA_BASE_URL || "http://127.0.0.1:3000";

const ALL_NAV = [
  "Go to Executive Tower",
  "Go to Financial Dashboard",
  "Go to Service Lines Review",
  "Go to Forecast & Walk",
  "Go to AI Finance Copilot",
  "Go to Scenario Simulator",
  "Go to Responsible AI & Dev",
];

const ALL_CORE = [
  "Export Sandbox Data",
  "Pre-flight Workspace Sign-off",
  "Clear Dashboard Filters",
  "Restore System Defaults",
];

const ALL_PERSONAS = [
  { title: "Shift Role: Sr Financial Analyst", value: "analyst" },
  { title: "Shift Role: Market Finance Director", value: "cfo" },
  { title: "Shift Role: Supply Chain Operations", value: "director" },
  { title: "Shift Role: Finance Compliance", value: "auditor" },
];

const ALL_SERVICE_LINES = [
  "Neurology",
  "Cardiology",
  "Emergency",
  "Orthopedics",
  "Primary Care",
  "Imaging",
  "Revenue Cycle",
];

const results = [];
function pass(name, detail = "") {
  results.push({ status: "PASS", name, detail });
}
function fail(name, detail = "") {
  results.push({ status: "FAIL", name, detail });
}

async function isPaletteOpen(page) {
  return page.getByText("COMMONSPIRIT INTEL-PALETTE").isVisible().catch(() => false);
}

async function openPalette(page) {
  if (!(await isPaletteOpen(page))) {
    await page.keyboard.press(process.platform === "darwin" ? "Meta+k" : "Control+k");
  }
  await page.waitForSelector(
    'input[placeholder*="Search navigation"], input[placeholder*="Ask copilot"]',
    { timeout: 5000 }
  );
}

async function closePalette(page) {
  if (await isPaletteOpen(page)) {
    await page.keyboard.press("Escape");
    await page.waitForTimeout(200);
  }
}

async function dismissBlockingOverlays(page) {
  for (let i = 0; i < 5; i++) {
    if (await isPaletteOpen(page)) {
      await page.keyboard.press("Escape");
      await page.waitForTimeout(120);
    }
    const cancel = page.getByRole("button", { name: "Cancel" }).first();
    if (await cancel.isVisible({ timeout: 300 }).catch(() => false)) {
      await cancel.click({ force: true });
      await page.waitForTimeout(200);
      continue;
    }
    const exportSuite = page.getByText("Operations Export Suite");
    if (await exportSuite.isVisible({ timeout: 300 }).catch(() => false)) {
      await page.keyboard.press("Escape");
      await page.waitForTimeout(200);
      continue;
    }
    const skip = page.getByRole("button", { name: /Skip tour/i }).first();
    if (await skip.isVisible({ timeout: 300 }).catch(() => false)) {
      await skip.click();
      await page.waitForTimeout(200);
      continue;
    }
    const backdrop = page.locator(".absolute.inset-0.bg-slate-900\\/40").first();
    if (await backdrop.isVisible({ timeout: 300 }).catch(() => false)) {
      await backdrop.click({ position: { x: 5, y: 5 }, force: true }).catch(() => {});
      await page.waitForTimeout(200);
      continue;
    }
    break;
  }
}

async function clickPaletteCommand(page, title) {
  await openPalette(page);
  const row = page.locator("span.text-\\[12px\\]").filter({ hasText: title });
  if (!(await row.isVisible().catch(() => false))) {
    return false;
  }
  await row.click({ force: true });
  await page.waitForTimeout(450);
  return true;
}

async function login(page) {
  await page.evaluate(() => {
    localStorage.setItem("commonspirit_tour_seen", "true");
  });
  const enter = page.getByRole("button", { name: /Enter Control Tower/i });
  if (await enter.isVisible({ timeout: 3000 }).catch(() => false)) {
    await enter.click();
    await page.waitForTimeout(800);
  }
  await dismissBlockingOverlays(page);
}

async function setPersona(page, value) {
  await page.locator("select").first().selectOption(value);
  await page.waitForTimeout(300);
}

const NAV_SIDEBAR = {
  "Go to Executive Tower": "Executive Tower",
  "Go to Financial Dashboard": "Financial Dashboard",
  "Go to Service Lines Review": "Service Lines Review",
  "Go to Forecast & Walk": "Forecast & Walk",
  "Go to AI Finance Copilot": "AI Finance Copilot",
  "Go to Scenario Simulator": "Scenario Simulator",
  "Go to Responsible AI & Dev": "Responsible AI & Dev",
};

async function sidebarActive(page, label) {
  return page.getByRole("button", { name: label }).evaluate((el) =>
    el.className.includes("bg-brand-600/10")
  );
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  try {
    await page.goto(BASE, { waitUntil: "domcontentloaded" });
    await login(page);

    // —— Entry points ——
    await openPalette(page);
    (await isPaletteOpen(page)) ? pass("Opens via ⌘K") : fail("Opens via ⌘K");
    await closePalette(page);

    await dismissBlockingOverlays(page);
    const searchBtn = page.getByRole("button", { name: "Search systems" }).first();
    await searchBtn.click({ force: true });
    await page.waitForTimeout(300);
    (await isPaletteOpen(page))
      ? pass("Opens via header Search button")
      : fail("Opens via header Search button");
    await closePalette(page);

    // —— Tab UI ——
    await openPalette(page);
    await page.getByRole("button", { name: /AI Analytical Prompt/i }).click();
    await page.waitForTimeout(200);
    const aiTab = await page.locator('input[placeholder*="Ask copilot"]').isVisible();
    aiTab ? pass("AI tab button switches mode") : fail("AI tab button switches mode");
    await page.getByRole("button", { name: /Terminal Commands/i }).click();
    await page.waitForTimeout(200);
    const cmdTab = await page.locator('input[placeholder*="Search navigation"]').isVisible();
    cmdTab ? pass("Terminal tab button switches mode") : fail("Terminal tab button switches mode");
    await closePalette(page);

    // —— Search: every category filter sample ——
    const searchCases = [
      { q: "dashboard", expect: "Go to Financial Dashboard", hide: "Go to Executive Tower" },
      { q: "strategic role", expect: "Shift Role:", hide: "Go to Financial Dashboard" },
      { q: "neurology", expect: "Drill Trend: Neurology", hide: "Drill Trend: Cardiology" },
      { q: "export", expect: "Export Sandbox Data", hide: null },
      { q: "zzzznomatch", expect: null, hide: "Go to Executive Tower", empty: true },
    ];
    for (const sc of searchCases) {
      await openPalette(page);
      const inp = page.locator('input[placeholder*="Search navigation"]').first();
      await inp.fill(sc.q);
      await page.waitForTimeout(150);
      if (sc.empty) {
        const empty = await page.getByText(/No workspace command matched/i).isVisible();
        empty ? pass(`Search empty state: "${sc.q}"`) : fail(`Search empty state: "${sc.q}"`);
      } else {
        const vis = await page.getByText(sc.expect, { exact: false }).first().isVisible();
        const hid =
          sc.hide &&
          !(await page.getByText(sc.hide, { exact: true }).isVisible().catch(() => false));
        vis && (sc.hide ? hid : true)
          ? pass(`Search filter: "${sc.q}"`)
          : fail(`Search filter: "${sc.q}"`, `vis=${vis}`);
      }
      await closePalette(page);
    }

    // —— Navigation: all 8 ——
    for (const title of ALL_NAV) {
      await dismissBlockingOverlays(page);
      const clicked = await clickPaletteCommand(page, title);
      if (!clicked) {
        fail(`Nav click: ${title}`, "not visible");
        continue;
      }
      const navLabel = NAV_SIDEBAR[title];
      const active = navLabel ? await sidebarActive(page, navLabel) : false;
      active ? pass(`Nav click: ${title}`) : fail(`Nav click: ${title}`, "sidebar not active");
      await dismissBlockingOverlays(page);
    }

    // —— Core actions: all 4 via click ——
    await setPersona(page, "analyst");
    await dismissBlockingOverlays(page);

    if (await clickPaletteCommand(page, "Export Sandbox Data")) {
      const exportOpen = await page.getByRole("heading", { name: /Export/i }).isVisible().catch(() => false)
        || (await page.getByText(/CSV|JSON|Export Sandbox/i).first().isVisible().catch(() => false));
      exportOpen ? pass("Core click: Export Sandbox Data") : fail("Core click: Export Sandbox Data");
      await dismissBlockingOverlays(page);
    } else fail("Core click: Export Sandbox Data", "not found");

    if (await clickPaletteCommand(page, "Clear Dashboard Filters")) {
      const cleared = await page.getByText(/filters cleared/i).isVisible().catch(() => false);
      cleared ? pass("Core click: Clear Dashboard Filters") : fail("Core click: Clear Dashboard Filters");
    } else fail("Core click: Clear Dashboard Filters", "not found");

    if (await clickPaletteCommand(page, "Pre-flight Workspace Sign-off")) {
      const denied = await page.getByText(/Access Denied|CFO credentials/i).isVisible().catch(() => false);
      denied ? pass("Core click: Sign-off (analyst blocked)") : fail("Core click: Sign-off (analyst blocked)");
      await dismissBlockingOverlays(page);
    } else fail("Core click: Pre-flight Workspace Sign-off", "not found");

    await setPersona(page, "cfo");
    if (await clickPaletteCommand(page, "Pre-flight Workspace Sign-off")) {
      const modal = await page.getByText(/Finalize|Certif|Sign-off|closed cycle/i).first().isVisible().catch(() => false);
      modal ? pass("Core click: Sign-off (CFO opens modal)") : fail("Core click: Sign-off (CFO opens modal)");
      await dismissBlockingOverlays(page);
    } else fail("Core click: Sign-off (CFO opens modal)", "not found");

    // Shortcuts E/S/C (empty search, CFO persona)
    await dismissBlockingOverlays(page);
    await openPalette(page);
    await page.locator('input[placeholder*="Search navigation"]').first().fill("");
    await page.keyboard.press("e");
    await page.waitForTimeout(500);
    const eExport = await page.getByText(/Export|CSV/i).first().isVisible().catch(() => false);
    eExport ? pass("Shortcut E: Export") : fail("Shortcut E: Export");
    await dismissBlockingOverlays(page);

    await openPalette(page);
    await page.locator('input[placeholder*="Search navigation"]').first().fill("");
    await page.keyboard.press("c");
    const cToast = await page
      .getByText(/filters cleared/i)
      .waitFor({ state: "visible", timeout: 3000 })
      .then(() => true)
      .catch(() => false);
    cToast ? pass("Shortcut C: Clear filters") : fail("Shortcut C: Clear filters");
    await dismissBlockingOverlays(page);

    await openPalette(page);
    await page.locator('input[placeholder*="Search navigation"]').first().fill("");
    await page.keyboard.press("s");
    await page.waitForTimeout(500);
    const sModal = await page.getByText(/Finalize|Certif/i).first().isVisible().catch(() => false);
    sModal ? pass("Shortcut S: Sign-off (CFO)") : fail("Shortcut S: Sign-off (CFO)");
    await dismissBlockingOverlays(page);

    // Restore (last — resets state)
    if (await clickPaletteCommand(page, "Restore System Defaults")) {
      const ok = await page.getByText(/sandbox restored|baseline levels/i).isVisible().catch(() => false);
      ok ? pass("Core click: Restore System Defaults") : fail("Core click: Restore System Defaults");
    } else fail("Core click: Restore System Defaults", "not found");

    // —— All personas ——
    for (const p of ALL_PERSONAS) {
      await dismissBlockingOverlays(page);
      if (!(await clickPaletteCommand(page, p.title))) {
        fail(`Persona: ${p.title}`, "not visible");
        continue;
      }
      const val = await page.locator("select").first().inputValue();
      val === p.value ? pass(`Persona: ${p.title}`) : fail(`Persona: ${p.title}`, `got ${val}`);
    }

    // —— All service line drills ——
    for (const line of ALL_SERVICE_LINES) {
      await dismissBlockingOverlays(page);
      const title = `Drill Trend: ${line}`;
      if (!(await clickPaletteCommand(page, title))) {
        fail(`Service drill: ${line}`, "not visible");
        continue;
      }
      const drawer = await page.getByText("Service Line Detail View").isVisible().catch(() => false);
      const toast = await page
        .getByText(new RegExp(`12-Month Performance Trend for ${line}`, "i"))
        .isVisible()
        .catch(() => false);
      drawer && toast ? pass(`Service drill: ${line}`) : fail(`Service drill: ${line}`, `drawer=${drawer} toast=${toast}`);
      await page.locator(".absolute.inset-0.bg-slate-900\\/40").first().click({ force: true }).catch(() => {});
      await page.waitForTimeout(250);
    }

    // —— Keyboard ↑↓ + Enter ——
    await dismissBlockingOverlays(page);
    await openPalette(page);
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await page.waitForTimeout(500);
    const kbdNav = await sidebarActive(page, "Financial Dashboard");
    kbdNav ? pass("ArrowDown + Enter selects command") : fail("ArrowDown + Enter selects command");
    await dismissBlockingOverlays(page);

    // —— AI mode: tab click, all suggestions, Analyze, Full Copilot ——
    await dismissBlockingOverlays(page);
    await openPalette(page);
    await page.getByRole("button", { name: /AI Analytical Prompt/i }).click();
    await page.waitForTimeout(200);

    const AI_SUGGESTIONS = [
      "Why is Cardiology opex elevated",
      "3.2% denial rate",
      "operating margin vs 8.5% goal",
      "Net Patient Revenues YTD",
    ];
    for (const fragment of AI_SUGGESTIONS) {
      const sugBtn = page.locator("button").filter({ hasText: fragment });
      if (!(await sugBtn.first().isVisible({ timeout: 2000 }).catch(() => false))) {
        fail(`AI suggestion: ${fragment}`, "button not visible");
        continue;
      }
      await sugBtn.first().click({ force: true });
      await page.waitForTimeout(2000);
      const ok = await page.getByText("AUTOMATED SYNTHETIC ANSWER").isVisible().catch(() => false);
      ok ? pass(`AI suggestion: ${fragment}`) : fail(`AI suggestion: ${fragment}`);
      if (await page.getByRole("button", { name: "Clear Answer" }).isVisible().catch(() => false)) {
        await page.getByRole("button", { name: "Clear Answer" }).click({ force: true });
        await page.waitForTimeout(300);
      }
    }

    await page.locator("button").filter({ hasText: "operating margin vs 8.5% goal" }).first().click({ force: true });
    await page.waitForTimeout(1100);
    await page.getByRole("button", { name: /Open Full Copilot Console/i }).click({ force: true });
    await page.waitForTimeout(500);
    const onCopilot = await sidebarActive(page, "AI Finance Copilot");
    onCopilot ? pass("AI Open Full Copilot Console") : fail("AI Open Full Copilot Console");
    await dismissBlockingOverlays(page);

    await openPalette(page);
    await page.getByRole("button", { name: /AI Analytical Prompt/i }).click();
    const aiInp = page.locator('input[placeholder*="Ask copilot"]');
    await aiInp.fill("revenue");
    await page.getByRole("button", { name: /^Analyze$/i }).click({ force: true });
    await page.waitForTimeout(1200);
    const analyzeOk = await page.getByText("AUTOMATED SYNTHETIC ANSWER").isVisible().catch(() => false);
    analyzeOk ? pass("AI Analyze button") : fail("AI Analyze button");
    await closePalette(page);

    await openPalette(page);
    const cmdInp = page.locator('input[placeholder*="Search navigation"]');
    await cmdInp.fill("/ai opex");
    await page.waitForTimeout(200);
    const prefixOk = await page.locator('input[placeholder*="Ask copilot"]').isVisible();
    prefixOk ? pass("/ai prefix in command mode") : fail("/ai prefix in command mode");
    await closePalette(page);
  } catch (err) {
    fail("Script error", String(err?.message || err));
  } finally {
    await browser.close();
  }

  const failed = results.filter((r) => r.status === "FAIL");
  const passed = results.filter((r) => r.status === "PASS");
  console.log(
    JSON.stringify(
      {
        baseUrl: BASE,
        passed: passed.length,
        failed: failed.length,
        total: results.length,
        failures: failed,
        results,
      },
      null,
      2
    )
  );
  process.exit(failed.length > 0 ? 1 : 0);
}

main();
