/**
 * Capture dark-mode contrast audit screenshots (local or production).
 * Usage: node scripts/capture-contrast-audit.mjs [baseUrl]
 */
import { chromium } from "playwright";
import { mkdir } from "fs/promises";
import path from "path";

const baseUrl = process.argv[2] || "http://127.0.0.1:3000";
const outDir = path.join(process.cwd(), "docs/screenshots/contrast-audit");

const shots = [
  { name: "dashboard-charts-dark", path: "/", nav: "dashboard", wait: 1200 },
  { name: "dashboard-table-dark", path: "/", nav: "dashboard", scroll: "#service-line-performance-table", wait: 800 },
  { name: "service-lines-cards-dark", path: "/", nav: "serviceLines", wait: 1200 },
  { name: "forecast-charts-dark", path: "/", nav: "forecast", wait: 1200 },
  { name: "copilot-chat-dark", path: "/", nav: "copilot", wait: 800 },
  { name: "overview-stewardship-dark", path: "/", nav: "overview", wait: 1000 },
  { name: "responsible-ai-cards-dark", path: "/", nav: "responsibleAI", wait: 1000 },
];

async function seedSession(page) {
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => {
    localStorage.setItem("commonspirit_is_logged_in", "true");
    localStorage.setItem("commonspirit_theme", "dark");
    localStorage.setItem("commonspirit_user_persona", "analyst");
  });
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  const skipTour = page.getByRole("button", { name: /skip tour/i });
  if (await skipTour.count()) {
    await skipTour.first().click({ timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(500);
  }
  const dismiss = page.getByRole("button", { name: /skip|close|got it|dismiss|later/i });
  if (await dismiss.count()) {
    await dismiss.first().click({ timeout: 2000 }).catch(() => {});
    await page.waitForTimeout(400);
  }
  await page.keyboard.press("Escape").catch(() => {});
}

const NAV_LABELS = {
  dashboard: "Financial Dashboard",
  serviceLines: "Service Lines Review",
  forecast: "Forecast & Walk",
  copilot: "AI Finance Copilot",
  overview: "Executive Tower",
  responsibleAI: "Responsible AI & Dev",
};

async function clickNav(page, navId) {
  const label = NAV_LABELS[navId];
  await page.locator("aside nav button", { hasText: label }).click({ timeout: 10000 });
  await page.waitForTimeout(700);
}

async function main() {
  await mkdir(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: "dark",
  });
  const page = await context.newPage();

  await seedSession(page);

  for (const shot of shots) {
    await page.goto(`${baseUrl}${shot.path}`, { waitUntil: "networkidle" });
    if (shot.nav) await clickNav(page, shot.nav);
    if (shot.scroll) {
      const el = page.locator(shot.scroll);
      if (await el.count()) await el.scrollIntoViewIfNeeded();
    }
    await page.waitForTimeout(shot.wait);
    const file = path.join(outDir, `${shot.name}.png`);
    await page.screenshot({ path: file, fullPage: false });
    console.log("wrote", file);
  }

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
