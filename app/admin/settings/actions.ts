"use server";

import { createServerClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function saveHeroImageAction(
  url: string,
): Promise<{ error: string } | void> {
  const supabase = await createServerClient();

  if (url) {
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key: "hero_image_url", value: url }, { onConflict: "key" });
    if (error) return { error: error.message };
  } else {
    // Empty = delete the setting so the homepage falls back to destination image
    await supabase.from("site_settings").delete().eq("key", "hero_image_url");
  }

  revalidatePath("/");
  revalidatePath("/admin/settings");
}

export async function saveAboutSettingsAction(data: {
  photo_url: string;
  heading: string;
  bio: string;
}): Promise<{ error: string } | void> {
  const supabase = await createServerClient();

  const rows = [
    { key: "about_photo_url", value: data.photo_url },
    { key: "about_heading",   value: data.heading },
    { key: "about_bio",       value: data.bio },
  ].filter((r) => r.value.trim() !== "");

  const keysToDelete = [
    data.photo_url.trim() === "" ? "about_photo_url" : null,
    data.heading.trim()   === "" ? "about_heading"   : null,
    data.bio.trim()       === "" ? "about_bio"       : null,
  ].filter(Boolean) as string[];

  if (rows.length > 0) {
    const { error } = await supabase
      .from("site_settings")
      .upsert(rows, { onConflict: "key" });
    if (error) return { error: error.message };
  }

  for (const key of keysToDelete) {
    await supabase.from("site_settings").delete().eq("key", key);
  }

  revalidatePath("/about");
  revalidatePath("/admin/settings");
}

export async function saveAboutStatsAction(stats: {
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
}): Promise<{ error: string } | void> {
  const supabase = await createServerClient();

  const rows = [
    { key: "about_stat_1_value", value: stats.stat1Value },
    { key: "about_stat_1_label", value: stats.stat1Label },
    { key: "about_stat_2_value", value: stats.stat2Value },
    { key: "about_stat_2_label", value: stats.stat2Label },
    { key: "about_stat_3_value", value: stats.stat3Value },
    { key: "about_stat_3_label", value: stats.stat3Label },
  ].filter((r) => r.value.trim() !== "");

  if (rows.length > 0) {
    const { error } = await supabase
      .from("site_settings")
      .upsert(rows, { onConflict: "key" });
    if (error) return { error: error.message };
  }

  revalidatePath("/about");
  revalidatePath("/admin/settings");
}
