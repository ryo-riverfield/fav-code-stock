"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type StockActionResult = { success: true } | { error: string };

export type CreateStockResult = StockActionResult;

type ParsedStockFields =
  | { ok: true; data: {
      title: string;
      url: string | null;
      code: string | null;
      code_lang: string | null;
      created_user: string | null;
    } }
  | { ok: false; error: string };

function parseStockFormData(formData: FormData): ParsedStockFields {
  const title = String(formData.get("title") ?? "").trim();
  if (!title) {
    return { ok: false, error: "タイトルは必須です" };
  }

  return {
    ok: true,
    data: {
      title,
      url: String(formData.get("url") ?? "").trim() || null,
      code: String(formData.get("code") ?? "").trim() || null,
      code_lang: String(formData.get("code_lang") ?? "").trim() || null,
      created_user: String(formData.get("created_user") ?? "").trim() || null,
    },
  };
}

async function requireAuthUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "ログインが必要です" as const, supabase: null, user: null };
  }

  return { supabase, user, error: null };
}

export async function createStock(
  formData: FormData
): Promise<CreateStockResult> {
  const parsed = parseStockFormData(formData);
  if (!parsed.ok) {
    return { error: parsed.error };
  }

  const auth = await requireAuthUser();
  if (auth.error) {
    return { error: auth.error };
  }

  const { error } = await auth.supabase!.from("stocks").insert(parsed.data);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  return { success: true };
}

export async function fetchStocks() {
  const auth = await requireAuthUser();
  if (auth.error) {
    return [];
  }

  const { data, error } = await auth.supabase!
    .from("stocks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function updateStock(
  formData: FormData
): Promise<StockActionResult> {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0) {
    return { error: "無効なストック ID です" };
  }

  const parsed = parseStockFormData(formData);
  if (!parsed.ok) {
    return { error: parsed.error };
  }

  const auth = await requireAuthUser();
  if (auth.error) {
    return { error: auth.error };
  }

  const { error } = await auth
    .supabase!.from("stocks")
    .update(parsed.data)
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  return { success: true };
}

export async function deleteStock(id: number): Promise<StockActionResult> {
  if (!Number.isInteger(id) || id <= 0) {
    return { error: "無効なストック ID です" };
  }

  const auth = await requireAuthUser();
  if (auth.error) {
    return { error: auth.error };
  }

  const { error } = await auth.supabase!.from("stocks").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  return { success: true };
}
