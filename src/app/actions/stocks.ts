"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type CreateStockResult =
  | { success: true }
  | { error: string };

export async function createStock(
  formData: FormData
): Promise<CreateStockResult> {
  const title = String(formData.get("title") ?? "").trim();
  if (!title) {
    return { error: "タイトルは必須です" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "ログインが必要です" };
  }

  const { error } = await supabase.from("stocks").insert({
    title,
    url: String(formData.get("url") ?? "").trim() || null,
    code: String(formData.get("code") ?? "").trim() || null,
    code_lang: String(formData.get("code_lang") ?? "").trim() || null,
    created_user: String(formData.get("created_user") ?? "").trim() || null,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  return { success: true };
}

export async function fetchStocks() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("stocks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}
