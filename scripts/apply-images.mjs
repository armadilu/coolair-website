// Copies the six images dropped in public/img/incoming/ to every place the
// site references them. Run from AC_web:  node scripts/apply-images.mjs
//
// Sources are numbered 1..6 with any common image extension. Nothing is
// deleted — the old files are simply overwritten, and git still has them.

import { copyFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";

const PUBLIC = resolve(process.cwd(), "public");
const INCOMING = join(PUBLIC, "img", "incoming");

const TARGETS = {
  1: ["img/page-service-repair.jpg", "img/cube/face-1.jpg"],
  2: ["img/page-service-installation.jpg", "img/cube/face-2.jpg"],
  3: ["img/page-service-maintenance.jpg", "img/cube/face-3.jpg"],
  4: ["img/page-service-air-quality.jpg", "img/cube/face-4.jpg"],
  5: ["img/page-service-duct-cleaning.jpg", "img/bg/bg-service-duct-cleaning.jpg"],
  6: ["img/page-shop.jpg", "img/bg/bg-shop.jpg"],
};

if (!existsSync(INCOMING)) {
  console.error(`No such folder: ${INCOMING}`);
  process.exit(1);
}

const files = readdirSync(INCOMING);
let copied = 0;
const missing = [];

for (const [n, targets] of Object.entries(TARGETS)) {
  const src = files.find((f) => f.replace(extname(f), "") === n && /\.(jpe?g|png|webp)$/i.test(f));
  if (!src) {
    missing.push(n);
    continue;
  }
  for (const t of targets) {
    const dest = join(PUBLIC, t);
    mkdirSync(dirname(dest), { recursive: true });
    copyFileSync(join(INCOMING, src), dest);
    console.log(`${src}  ->  ${t}`);
    copied++;
  }
}

console.log(`\n${copied} file(s) written.`);
if (missing.length) console.log(`Still waiting on: ${missing.join(", ")}`);
