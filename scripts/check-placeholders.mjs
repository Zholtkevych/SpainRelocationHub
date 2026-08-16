// Fails if any {{PLACEHOLDER: ...}} sentinel survives in messages/*.json —
// run before a production deploy, not as part of the normal build (staging
// must be able to ship with placeholders still present). See
// docs/launch-checklist.md for what each placeholder maps to.
import fs from "node:fs";
import path from "node:path";

const MESSAGES_DIR = path.join(process.cwd(), "messages");
const SENTINEL = /\{\{PLACEHOLDER:[^}]*\}\}/g;

let found = 0;

for (const file of fs.readdirSync(MESSAGES_DIR)) {
  if (!file.endsWith(".json")) continue;
  const content = fs.readFileSync(path.join(MESSAGES_DIR, file), "utf-8");
  const matches = content.match(SENTINEL);
  if (matches) {
    found += matches.length;
    console.log(`${file}:`);
    for (const m of matches) console.log(`  - ${m}`);
  }
}

if (found > 0) {
  console.error(`\n${found} unresolved placeholder(s) — not launch-ready.`);
  process.exit(1);
} else {
  console.log("No placeholders found — launch-ready on content.");
}
