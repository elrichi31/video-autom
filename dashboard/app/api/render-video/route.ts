import { NextRequest, NextResponse } from "next/server";
import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";

const execFileAsync = promisify(execFile);
const REMOTION_DIR = path.join(process.cwd(), "..", "remotion");
const npx = process.platform === "win32" ? "npx.cmd" : "npx";

function slugToCompositionId(slug: string): string {
  return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("") + "VerticalPremium";
}

export async function POST(req: NextRequest) {
  const { slug, voiceoverFile }: { slug: string; voiceoverFile?: string } = await req.json();

  const compositionId = slugToCompositionId(slug);
  const outputFile    = path.join(REMOTION_DIR, "out", `${slug}.mp4`);

  const props: Record<string, string | null> = { voiceoverFile: voiceoverFile ?? null };
  const propsJson = JSON.stringify(props);

  try {
    const { stdout, stderr } = await execFileAsync(
      npx,
      ["remotion", "render", compositionId, outputFile, `--props=${propsJson}`],
      { cwd: REMOTION_DIR, timeout: 600_000 }, // 10 min max
    );

    return NextResponse.json({
      ok: true,
      compositionId,
      outputFile: `${slug}.mp4`,
      stdout: stdout.slice(-500),
      stderr: stderr.slice(-200),
    });
  } catch (err: unknown) {
    const e = err as { stdout?: string; stderr?: string; message?: string };
    return NextResponse.json(
      { error: e.message ?? "Error al renderizar", stderr: e.stderr?.slice(-500) },
      { status: 500 },
    );
  }
}
