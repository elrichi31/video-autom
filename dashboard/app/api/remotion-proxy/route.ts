import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const compositionId = req.nextUrl.searchParams.get("composition") ?? "";

  let html: string;
  try {
    const res = await fetch(
      `http://localhost:3000/${encodeURIComponent(compositionId)}`,
      { headers: { Accept: "text/html" } },
    );
    html = await res.text();
  } catch {
    return new NextResponse(
      `<html><body style="background:#0d0d0d;color:#555;font-family:monospace;display:flex;align-items:center;justify-content:center;height:100vh;margin:0">
        <p>Remotion Studio no está corriendo en localhost:3000</p>
      </body></html>`,
      { status: 200, headers: { "Content-Type": "text/html" } },
    );
  }

  // Inject base href so all relative asset paths resolve to Remotion Studio.
  // This lets the browser load JS/CSS directly from localhost:3000 without
  // going through this proxy.
  html = html.replace("<head>", `<head><base href="http://localhost:3000/">`);

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      // Intentionally no X-Frame-Options — we want iframe embedding
    },
  });
}
