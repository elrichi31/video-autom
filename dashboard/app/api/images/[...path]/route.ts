import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

const REPO_ROOT = path.join(process.cwd(), "..", "remotion");

export async function GET(_req: NextRequest, { params }: { params: { path: string[] } }) {
  const filePath = path.join(REPO_ROOT, "public", ...params.path);

  // Basic path traversal guard
  if (!filePath.startsWith(path.join(REPO_ROOT, "public"))) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    const buffer = await readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const mime =
      ext === ".png"  ? "image/png"  :
      ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" :
      ext === ".webp" ? "image/webp" :
      "application/octet-stream";

    return new NextResponse(buffer, {
      headers: { "Content-Type": mime, "Cache-Control": "public, max-age=3600" },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
