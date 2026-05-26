import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, readFile } from "fs/promises";
import path from "path";
import type { AnyVideoScript, GeneratedImage } from "@/lib/types";
import { generateDataTs } from "@/lib/generate-data-ts";
import { generateCompositionTsx, validateCompositionTsx } from "@/lib/generate-composition-tsx";

const REPO_ROOT = path.join(process.cwd(), "..", "remotion");

function toComponentName(slug: string): string {
  return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("") + "Composition";
}

function toDurationExport(slug: string): string {
  return slug.replace(/-(\w)/g, (_, c: string) => c.toUpperCase()) + "Duration";
}

async function registerInRoot(slug: string) {
  const rootPath = path.join(REPO_ROOT, "src", "Root.tsx");
  let src = await readFile(rootPath, "utf-8");

  const componentName = toComponentName(slug);
  const durationExport = toDurationExport(slug);
  const compositionId = slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("") + "VerticalPremium";

  // Skip if already registered
  if (src.includes(componentName)) return;

  const calcMetaAlias = slug.replace(/-(\w)/g, (_: string, c: string) => c.toUpperCase()) + "CalculateMetadata";

  // Insert import before "export const RemotionRoot"
  const importBlock = `import {\n  ${componentName},\n  ${durationExport},\n  calculateMetadata as ${calcMetaAlias},\n} from "./${componentName}";\n`;
  src = src.replace(
    /^(export const RemotionRoot)/m,
    `${importBlock}\n$1`,
  );

  // Insert Composition before the closing </> tag
  const compositionBlock =
    `      <Composition\n` +
    `        id="${compositionId}"\n` +
    `        component={${componentName}}\n` +
    `        calculateMetadata={${calcMetaAlias}}\n` +
    `        durationInFrames={${durationExport}}\n` +
    `        fps={30}\n` +
    `        width={1080}\n` +
    `        height={1920}\n` +
    `        defaultProps={{ voiceoverFile: null, voiceoverFiles: null, sceneDurations: null }}\n` +
    `      />\n`;
  src = src.replace(/(\s+<\/>\s*\);\s*};?\s*$)/, `\n${compositionBlock}    </>\n  );\n};\n`);

  await writeFile(rootPath, src, "utf-8");
}

export async function POST(req: NextRequest) {
  const { script, images }: { script: AnyVideoScript; images: GeneratedImage[] } = await req.json();
  const saved: string[] = [];

  // 1. data.ts + script.json
  const srcDir = path.join(REPO_ROOT, "src", script.slug);
  await mkdir(srcDir, { recursive: true });
  await writeFile(path.join(srcDir, "data.ts"),     generateDataTs(script),          "utf-8");
  await writeFile(path.join(srcDir, "script.json"), JSON.stringify(script, null, 2), "utf-8");
  saved.push(`src/${script.slug}/data.ts`);
  saved.push(`src/${script.slug}/script.json`);

  // 2. Composition .tsx
  const componentName = toComponentName(script.slug);
  const tsxContent = generateCompositionTsx(script);
  const validationErrors = validateCompositionTsx(tsxContent, script.slug);
  if (validationErrors.length > 0) {
    const msg = validationErrors.map((e) => `[${e.rule}] ${e.detail}`).join("\n");
    return NextResponse.json({ error: `Composition generada inválida:\n${msg}` }, { status: 500 });
  }
  const tsxPath = path.join(REPO_ROOT, "src", `${componentName}.tsx`);
  await writeFile(tsxPath, tsxContent, "utf-8");
  saved.push(`src/${componentName}.tsx`);

  // 3. Images
  if (images.length > 0) {
    const pubDir = path.join(REPO_ROOT, "public", script.slug);
    await mkdir(pubDir, { recursive: true });
    for (const img of images) {
      const buffer = Buffer.from(img.b64, "base64");
      await writeFile(path.join(pubDir, img.filename), buffer);
      saved.push(`public/${script.slug}/${img.filename}`);
    }
  }

  // 4. Register in Root.tsx
  try {
    await registerInRoot(script.slug);
    saved.push("src/Root.tsx (actualizado)");
  } catch (err) {
    saved.push(`src/Root.tsx (error: ${String(err)})`);
  }

  return NextResponse.json({ saved });
}
