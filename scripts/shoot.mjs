// Verificação visual: abre a home, rola até frações do scroll e tira prints.
// Uso: node scripts/shoot.mjs <outDir> <width> <height> <p1,p2,...>
import { chromium } from "playwright";
const [out = "shots", w = "1440", h = "900", ps = "0,0.19,0.42,0.64,0.86,1"] = process.argv.slice(2);
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH ?? "/opt/pw-browsers/chromium",
  args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: +(process.env.DSF ?? 1) });
if (process.env.CLEAN) await page.addInitScript(() => { document.addEventListener("DOMContentLoaded", () => { const s = document.createElement("style"); s.textContent = ".panels-layer,.site-header,.stage-rail,.hero-intro,.scroll-cue,.outro-cue,nextjs-portal{display:none!important}"; document.head.appendChild(s); }); });
const logs = [];
page.on("console", (m) => (m.type() === "error" || m.type() === "warning") && logs.push(`[${m.type()}] ${m.text()}`));
page.on("pageerror", (e) => logs.push(`[pageerror] ${e.message}`));
await page.goto(process.env.URL ?? "http://localhost:3000/?debug", { waitUntil: "networkidle", timeout: 180000 });
await page.waitForSelector(".loader.is-done", { timeout: 180000 });
await page.waitForTimeout(2500);
for (const p of ps.split(",").map(Number)) {
  await page.evaluate((p) => {
    const el = document.querySelector(".cinema");
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, top + (el.offsetHeight - innerHeight) * p);
  }, p);
  // Espera o scrub do GSAP alcançar o alvo (a GPU por software é lenta).
  await page.waitForFunction((p) => Math.abs(window.__zenite.progress - p) < 0.002, p, { timeout: 60000, polling: 250 }).catch(() => {});
  await page.waitForTimeout(+(process.env.SETTLE ?? 3500));
  await page.screenshot({ path: `${out}/p${String(p).replace(".", "_")}.png` });
}
console.log(JSON.stringify(await page.evaluate(() => [...document.querySelectorAll(".stage-rail button")].map((b) => { const r = b.querySelector(".rail-dot").getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y)]; }))));
console.log(logs.slice(0, 30).join("\n") || "sem erros no console");
await browser.close();
