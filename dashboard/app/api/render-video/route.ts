import { NextRequest } from "next/server";
import { spawn } from "child_process";
import { writeFile, unlink, readFile } from "fs/promises";
import path from "path";
import os from "os";

const REMOTION_DIR = path.join(process.cwd(), "..", "remotion");
const npx = process.platform === "win32" ? "npx.cmd" : "npx";

function slugToCompositionId(slug: string): string {
  return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("") + "VerticalPremium";
}

export async function POST(req: NextRequest) {
  const { slug, voiceoverFile }: { slug: string; voiceoverFile?: string } = await req.json();

  const compositionId = slugToCompositionId(slug);
  const outputFile    = path.join(REMOTION_DIR, "out", `${slug}.mp4`);

  // Load per-scene audio files if available
  let voiceoverFiles: Record<string, string> | null = null;
  try {
    const scriptJson = await readFile(
      path.join(REMOTION_DIR, "public", slug, `${slug}-voiceover-script.json`), "utf-8"
    );
    const parsed = JSON.parse(scriptJson);
    voiceoverFiles = parsed?.voiceoverFiles ?? null;
  } catch { /* no saved voiceover data */ }

  const props     = {
    voiceoverFile: voiceoverFile ?? null,
    voiceoverFiles,
  };
  const propsFile = path.join(os.tmpdir(), `remotion-props-${slug}.json`);

  await writeFile(propsFile, JSON.stringify(props), "utf-8");

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const send = (data: object) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        } catch { /* stream already closed */ }
      };

      const child = spawn(
        npx,
        [
          "remotion", "render",
          compositionId,
          outputFile,
          `--props=${propsFile}`,
          "--codec=h264",
          "--crf=1",
          "--pixel-format=yuv420p",
          "--jpeg-quality=100",
          "--gl=angle",
        ],
        { cwd: REMOTION_DIR, shell: process.platform === "win32" },
      );

      let lastProgress = -1;
      const errorLines: string[] = [];

      const parseChunk = (chunk: Buffer, isStderr = false) => {
        const text = chunk.toString();

        if (isStderr) errorLines.push(text);

        const pctMatch = text.match(/(\d{1,3})%/);
        if (pctMatch) {
          const pct = Math.min(99, parseInt(pctMatch[1]));
          if (pct !== lastProgress) { lastProgress = pct; send({ progress: pct }); }
        }
        const frameMatch = text.match(/(\d+)\/(\d+)/);
        if (frameMatch) {
          const cur = parseInt(frameMatch[1]);
          const tot = parseInt(frameMatch[2]);
          if (tot > 0) {
            const pct = Math.min(99, Math.round((cur / tot) * 100));
            if (pct !== lastProgress) { lastProgress = pct; send({ progress: pct }); }
          }
        }
      };

      child.stdout?.on("data", (c: Buffer) => parseChunk(c, false));
      child.stderr?.on("data", (c: Buffer) => parseChunk(c, true));

      child.on("close", (code) => {
        unlink(propsFile).catch(() => {});
        if (code === 0) {
          send({ progress: 100, done: true, outputFile: `${slug}.mp4` });
        } else {
          const detail = errorLines.join("").slice(-2000); // last 2000 chars of stderr
          send({ error: `Render falló (código ${code}):\n${detail}` });
        }
        controller.close();
      });

      child.on("error", (err) => {
        unlink(propsFile).catch(() => {});
        send({ error: err.message });
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}
