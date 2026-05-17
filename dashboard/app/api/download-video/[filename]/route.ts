import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

const REMOTION_DIR = path.join(process.cwd(), "..", "remotion");

export async function GET(
  _req: NextRequest,
  { params }: { params: { filename: string } },
) {
  const filename = params.filename;

  // Guard: only allow .mp4 files from out/
  if (!filename.endsWith(".mp4") || filename.includes("..")) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const filePath = path.join(REMOTION_DIR, "out", filename);

  try {
    const buffer = await readFile(filePath);
    return new NextResponse(buffer, {
      headers: {
        "Content-Type":        "video/mp4",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length":      String(buffer.byteLength),
      },
    });
  } catch {
    return new NextResponse("Video no encontrado. Asegúrate de renderizarlo primero.", { status: 404 });
  }
}
