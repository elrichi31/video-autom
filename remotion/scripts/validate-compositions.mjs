// Scans all *Composition.tsx files in src/ and checks for known error patterns.
// Run with: node remotion/scripts/validate-compositions.mjs
import { readdirSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC_DIR = join(__dirname, "..", "src");

const CHECKS = [
  {
    rule: "correct-import-path",
    detail: "Import must use './dark-web/components', not '../dark-web/components'",
    test: (content) =>
      !content.includes("../dark-web/components") ||
      !content.includes("dark-web/components"),
  },
  {
    rule: "voiceover-files-prop",
    detail: "Component must accept voiceoverFiles prop (SceneAudio type)",
    test: (content) => content.includes("voiceoverFiles") && content.includes("SceneAudio"),
  },
  {
    rule: "per-scene-audio-helper",
    detail: "Must have per-scene audio helper a(key)",
    test: (content) => content.includes("const a = (key"),
  },
  {
    rule: "duration-export-camelcase",
    detail: "Duration export must be camelCase and include SIL buffer (e.g. mySlugDuration = TOTAL + 7 * SIL)",
    test: (content) => /export const [a-z][a-zA-Z]+Duration = TOTAL/.test(content),
  },
  {
    rule: "silence-buffer",
    detail: "Must have SIL silence buffer (const SIL = ...) and use slot() offsets",
    test: (content) => content.includes("const SIL =") && content.includes("slot(D."),
  },
];

// These are legacy compositions that don't follow the new template — skip them.
const SKIP = new Set([
  "Composition.tsx",
  "HallucinationsComposition.tsx",
  "CyberAttacksComposition.tsx",
  "AiSkillsComposition.tsx",
  "HackerGroupsComposition.tsx",
  "AiAgentsComposition.tsx",
  "CyberToolsComposition.tsx",
  "PhoneHackedComposition.tsx",
  "AiAutomationsComposition.tsx",
  "DarkWebComposition.tsx",
  "ZeroDayComposition.tsx",
]);

const files = readdirSync(SRC_DIR).filter(
  (f) => f.endsWith("Composition.tsx") && !SKIP.has(f),
);

let totalErrors = 0;

for (const file of files) {
  const content = readFileSync(join(SRC_DIR, file), "utf-8");
  const errors = CHECKS.filter((c) => !c.test(content));

  if (errors.length === 0) {
    console.log(`✓ ${file}`);
  } else {
    totalErrors += errors.length;
    console.log(`✗ ${file}`);
    for (const e of errors) {
      console.log(`    [${e.rule}] ${e.detail}`);
    }
  }
}

console.log(`\n${files.length} compositions checked, ${totalErrors} error(s) found.`);
if (totalErrors > 0) process.exit(1);
