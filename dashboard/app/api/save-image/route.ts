import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const REPO_ROOT = path.join(process.cwd(), "..");

export async function POST(req: NextRequest) {
  const { slug, filename, b64 }: { slug: string; filename: string; b64: string } = await req.json();

  const dir = path.join(REPO_ROOT, "public", slug);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), Buffer.from(b64, "base64"));

  return NextResponse.json({ ok: true, path: `${slug}/${filename}` });
}
