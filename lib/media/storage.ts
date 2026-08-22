import path from "node:path";

// Uploaded files live outside public/ deliberately: Next.js's production
// server (`next start`) snapshots public/ at process boot and 404s on
// anything added to it afterward — confirmed by testing, not assumed. This
// directory is read fresh on every request instead, via
// app/media/[filename]/route.ts, matching the "publish, no restart needed"
// design of the rest of the admin panel.
export const UPLOAD_DIR = path.join(process.cwd(), "data", "uploads");

export const MIME_BY_EXTENSION: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export function mediaUrlFor(filename: string): string {
  return `/media/${filename}`;
}
