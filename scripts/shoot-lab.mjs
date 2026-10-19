// Prints do laboratório: node scripts/shoot-lab.mjs <saida.png> "<query>" [w] [h]
import { chromium } from "playwright";
const [out, q = "", w = "900", h = "900"] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? "/opt/pw-browsers/chromium", args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const p = await b.newPage({ viewport: { width: +w, height: +h } });
const logs = [];
p.on("pageerror", (e) => logs.push(e.message));
p.on("console", (m) => m.type() === "error" && logs.push(m.text()));
await p.goto(`${process.env.BASE ?? "http://localhost:3000"}/laboratorio?${q}`, { waitUntil: "networkidle", timeout: 180000 });
await p.waitForTimeout(+(process.env.SETTLE ?? 12000));
await p.screenshot({ path: out, timeout: 180000 });
console.log(logs.join("\n") || "ok");
await b.close();
