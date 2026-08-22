"use server";

import { revalidatePath } from "next/cache";
import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { setSetting, deleteSetting, getSetting } from "@/lib/settings/store";
import { sectionImageSettingKey, SECTION_KEYS, type SectionKey } from "@/lib/settings/keys";
import { locales } from "@/lib/locale/config";
import { UPLOAD_DIR, mediaUrlFor } from "@/lib/media/storage";

const MAX_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function isSectionKey(value: FormDataEntryValue | null): value is SectionKey {
  return typeof value === "string" && (SECTION_KEYS as readonly string[]).includes(value);
}

function revalidateHomepages() {
  // Every section lives on one page per locale, so any block's image needs
  // all four locale homepages revalidated, not just one.
  for (const locale of locales) {
    revalidatePath(`/${locale}`);
  }
}

export type UploadSectionImageState = { error?: string };

// `section` travels as a plain hidden form field, not a bound closure
// argument (`.bind(null, section)`) — binding args onto a Server Action
// reliably hung this app under Next.js 16 + Turbopack: the action itself
// ran to completion (verified with step-by-step logging — every line up to
// and including the final return executed), but the HTTP response never
// arrived, every time, regardless of the number of revalidatePath calls.
// A hidden form field is the same unbound-action shape the original
// single-hero version used successfully, so it sidesteps whatever in the
// bound-closure serialization path was hanging.
export async function uploadSectionImageAction(
  _prevState: UploadSectionImageState | undefined,
  formData: FormData,
): Promise<UploadSectionImageState> {
  const section = formData.get("section");
  if (!isSectionKey(section)) {
    return { error: "Unknown section." };
  }

  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose an image file first." };
  }

  const extension = ALLOWED_TYPES[file.type];
  if (!extension) {
    return { error: "Only JPEG, PNG, or WebP images are supported." };
  }

  if (file.size > MAX_BYTES) {
    return { error: "Image is too large — 10MB maximum." };
  }

  await fs.mkdir(UPLOAD_DIR, { recursive: true });

  // Filename is generated, never taken from the client — avoids any path
  // traversal or executable-extension trick via a crafted upload name.
  const filename = `${section}-${randomUUID()}.${extension}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(UPLOAD_DIR, filename), bytes);

  const settingKey = sectionImageSettingKey(section);
  const previous = getSetting(settingKey);
  setSetting(settingKey, mediaUrlFor(filename));

  if (previous) {
    const previousFilename = previous.split("/").pop();
    if (previousFilename) {
      await fs.unlink(path.join(UPLOAD_DIR, previousFilename)).catch(() => {
        // Best-effort cleanup — a missing old file is not an error condition.
      });
    }
  }

  revalidateHomepages();
  return {};
}

export async function removeSectionImageAction(formData: FormData): Promise<void> {
  const section = formData.get("section");
  if (!isSectionKey(section)) return;

  const settingKey = sectionImageSettingKey(section);
  const current = getSetting(settingKey);
  deleteSetting(settingKey);

  if (current) {
    const currentFilename = current.split("/").pop();
    if (currentFilename) {
      await fs.unlink(path.join(UPLOAD_DIR, currentFilename)).catch(() => {});
    }
  }

  revalidateHomepages();
}
