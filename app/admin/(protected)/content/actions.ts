"use server";

import { revalidatePath } from "next/cache";
import { setContent, type ContentTree } from "@/lib/content/store";
import { isLocale, type Locale } from "@/lib/locale/config";

export async function saveContentAction(locale: Locale, content: ContentTree): Promise<void> {
  if (!isLocale(locale)) {
    throw new Error("Invalid locale");
  }

  await setContent(locale, content);

  // Publication triggers revalidation, not a redeploy — mirrors SAD 6.4.
  revalidatePath(`/${locale}`);
  revalidatePath(`/${locale}/privacy`);
  revalidatePath(`/${locale}/cookies`);
  revalidatePath(`/${locale}/legal`);
}
