/**
 * Header layout screenshots (light/dark, desktop + laptop widths).
 * Usage: node scripts/capture-header-audit.mjs [baseUrl]
 */
import { chromium } from "playwright";
import { mkdir } from "fs/promises";
import path from "path";

const baseUrl = process.argv[2] || "http://127.0.0.1:3000";
const outDir = path.join(process.cwd(), "docs/screenshots/header-audit");

const viewports = [
  { name: "desktop-1440", width: 1440, height: 200, theme: "light" },
  { name: "desktop-1440-dark", width: 1440, height: 200, theme: "dark" },
  { name: "laptop-1024", width: 1024, height: 200, theme: "light" },
  { name: "laptop-1024-dark", width: 1024, height: 200, theme: "dark" },
  { name: "tablet-768", width: 768, height: 200, theme: "light" },
];

async function seedSession(page, theme) {
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await page.evaluate((t) => {
    localStorage.setItem("commonspirit_is_logged_in", "true");
    localStorage.setItem("commonspirit_theme", t);
    localStorage.setItem("commonspirit_user_persona", "analyst");
    localStorage.setItem("commonspirit_tour_seen", "true");
  }, theme);
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(400);
}

async function captureHeader(page, file) {
  const header = page.locator("header").first();
  await header.waitFor({ state: "visible", timeout: 10000 });
  await header.screenshot({ path: file });
  console.log("wrote", file);
}

async function main() {
  await mkdir(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });

  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      colorScheme: vp.theme === "dark" ? "dark" : "light",
    });
    const page = await context.newPage();
    await seedSession(page, vp.theme);
    const file = path.join(outDir, `header-${vp.name}.png`);
    await captureHeader(page, file);
    await context.close();
  }

  // Overflow menu open (desktop light)
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 280 },
    colorScheme: "light",
  });
  const page = await ctx.newPage();
  await seedSession(page, "light");
  await page.getByRole("button", { name: "More actions" }).click();
  await page.waitForTimeout(300);
  await page.locator("header").first().screenshot({
    path: path.join(outDir, "header-actions-menu-open.png"),
  });
  console.log("wrote", path.join(outDir, "header-actions-menu-open.png"));
  await ctx.close();

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
