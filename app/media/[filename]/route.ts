import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { UPLOAD_DIR, MIME_BY_EXTENSION } from "@/lib/media/storage";

const NOT_FOUND = new NextResponse("Not found", { status: 404 });

// Serves data/uploads/* fresh from disk on every request — deliberately not
// public/, which Next.js's production server snapshots at boot (see
// lib/media/storage.ts for why that broke the "publish, no restart" promise).
export async function GET(_request: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params;

  // Filenames are always server-generated (hero-<uuid>.<ext>), so a path
  // separator here can only mean traversal — reject outright.
  if (filename.includes("/") || filename.includes("\\") || filename.includes("..")) {
    return NOT_FOUND;
  }

  const extension = filename.split(".").pop()?.toLowerCase() ?? "";
  const mime = MIME_BY_EXTENSION[extension];
  if (!mime) {
    return NOT_FOUND;
  }

  try {
    const data = await fs.readFile(path.join(UPLOAD_DIR, filename));
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": mime,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NOT_FOUND;
  }
}
