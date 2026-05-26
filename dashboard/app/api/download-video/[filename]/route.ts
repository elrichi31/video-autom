import { NextRequest, NextResponse } from "next/server";
import { open, stat } from "fs/promises";
import path from "path";

const REMOTION_DIR = path.join(process.cwd(), "..", "remotion");

export async function HEAD(
  _req: NextRequest,
  { params }: { params: { filename: string } },
) {
  const filename = params.filename;
  if (!filename.endsWith(".mp4") || filename.includes("..")) {
    return new NextResponse(null, { status: 403 });
  }
  const filePath = path.join(REMOTION_DIR, "out", filename);
  try {
    const stats = await stat(filePath);
    return new NextResponse(null, {
      status: 200,
      headers: {
        "Content-Type":   "video/mp4",
        "Content-Length": String(stats.size),
        "Accept-Ranges":  "bytes",
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { filename: string } },
) {
  const filename = params.filename;

  if (!filename.endsWith(".mp4") || filename.includes("..")) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const filePath = path.join(REMOTION_DIR, "out", filename);

  let fileSize: number;
  try {
    fileSize = (await stat(filePath)).size;
  } catch {
    return new NextResponse("Video no encontrado. Renderízalo primero.", { status: 404 });
  }

  const rangeHeader = req.headers.get("range");

  if (rangeHeader) {
    const [startStr, endStr] = rangeHeader.replace(/bytes=/, "").split("-");
    const start = parseInt(startStr, 10);
    const end   = endStr ? parseInt(endStr, 10) : fileSize - 1;
    const chunkSize = end - start + 1;

    const fh     = await open(filePath, "r");
    const buffer = Buffer.alloc(chunkSize);
    await fh.read(buffer, 0, chunkSize, start);
    await fh.close();

    return new NextResponse(buffer, {
      status: 206,
      headers: {
        "Content-Range":  `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges":  "bytes",
        "Content-Length": String(chunkSize),
        "Content-Type":   "video/mp4",
      },
    });
  }

  // Full file — used when user clicks download
  const forceDownload = req.nextUrl.searchParams.get("download") === "1";
  const fh     = await open(filePath, "r");
  const buffer = Buffer.alloc(fileSize);
  await fh.read(buffer, 0, fileSize, 0);
  await fh.close();

  return new NextResponse(buffer, {
    headers: {
      "Content-Type":        "video/mp4",
      "Accept-Ranges":       "bytes",
      "Content-Length":      String(fileSize),
      ...(forceDownload && {
        "Content-Disposition": `attachment; filename="${filename}"`,
      }),
    },
  });
}
