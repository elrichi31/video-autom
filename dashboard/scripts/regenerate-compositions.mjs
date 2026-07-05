// Regenerates every existing composition .tsx from its stored script.json using
// the current generator, so the text-duration + audio-tail fixes apply to
// already-generated videos. Run from the dashboard/ directory.
import { readFile, writeFile, readdir } from "fs/promises";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { createRequire } from "module";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DASHBOARD = path.join(__dirname, "..");
const REPO_ROOT = path.join(DASHBOARD, "..", "remotion");
const SRC = path.join(REPO_ROOT, "src");

// Transpile the TS generator on the fly via the installed typescript compiler.
const require = createRequire(import.meta.url);
const ts = require("typescript");

// Transpile a lib TS module to a sibling temp .mjs (so its relative imports
// resolve), import it, then leave the temp file (cleaned at the end).
const LIB = path.join(DASHBOARD, "lib");
const tempFiles = [];
async function loadLib(name) {
  // Transpile this module and every relative dependency it pulls in.
  async function ensure(modName) {
    const srcPath = path.join(LIB, `${modName}.ts`);
    const outPath = path.join(LIB, `__regen_${modName}.mjs`);
    let src = await readFile(srcPath, "utf-8");
    // Rewrite relative imports to point at the transpiled temp siblings.
    const deps = [...src.matchAll(/from\s+"\.\/([\w-]+)"/g)].map((m) => m[1]);
    for (const dep of deps) {
      await ensure(dep);
      src = src.replaceAll(`"./${dep}"`, `"./__regen_${dep}.mjs"`);
    }
    const code = ts.transpileModule(src, {
      compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
    }).outputText;
    await writeFile(outPath, code, "utf-8");
    tempFiles.push(outPath);
    return outPath;
  }
  const out = await ensure(name);
  return import(pathToFileURL(out).href);
}

const { generateCompositionTsx, validateCompositionTsx } = await loadLib("generate-composition-tsx");
const { generateDataTs } = await loadLib("generate-data-ts");

function toComponentName(slug) {
  return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("") + "Composition";
}

const dirs = await readdir(SRC, { withFileTypes: true });
let count = 0;
for (const d of dirs) {
  if (!d.isDirectory()) continue;
  const scriptPath = path.join(SRC, d.name, "script.json");
  let raw;
  try {
    raw = await readFile(scriptPath, "utf-8");
  } catch {
    continue; // no stored script for this dir
  }
  const script = JSON.parse(raw);
  const tsx = generateCompositionTsx(script);
  const errors = validateCompositionTsx(tsx, script.slug);
  if (errors.length) {
    console.error(`✗ ${script.slug}: ${errors.map((e) => e.rule).join(", ")}`);
    continue;
  }
  const outPath = path.join(SRC, `${toComponentName(script.slug)}.tsx`);
  await writeFile(outPath, tsx, "utf-8");
  await writeFile(path.join(SRC, script.slug, "data.ts"), generateDataTs(script), "utf-8");
  console.log(`✓ ${script.slug} -> ${path.relative(REPO_ROOT, outPath)} (+ data.ts)`);
  count++;
}
// Clean up transpiled temp modules.
const { unlink } = await import("fs/promises");
for (const f of tempFiles) await unlink(f).catch(() => {});

console.log(`\nRegenerated ${count} composition(s).`);
