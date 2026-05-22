"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/types/category";
import type { Language } from "@/types/language";

export type MasterActionResult = { success: true } | { error: string };

async function requireAuthSupabase() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "ログインが必要です" as const, supabase: null };
  }
  return { supabase, error: null };
}

export async function fetchCategories(): Promise<Category[]> {
  const auth = await requireAuthSupabase();
  if (auth.error) return [];

  const { data, error } = await auth.supabase!
    .from("categories")
    .select("*")
    .order("name");

  if (error) throw new Error(error.message);
  return (data ?? []) as Category[];
}

export async function fetchLanguages(): Promise<Language[]> {
  const auth = await requireAuthSupabase();
  if (auth.error) return [];

  const { data, error } = await auth.supabase!
    .from("languages")
    .select("*")
    .order("name");

  if (error) throw new Error(error.message);
  return (data ?? []) as Language[];
}

export async function createCategory(
  _prev: MasterActionResult | null,
  formData: FormData
): Promise<MasterActionResult> {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "カテゴリー名を入力してください" };

  const auth = await requireAuthSupabase();
  if (auth.error) return { error: auth.error };

  const { error } = await auth.supabase!.from("categories").insert({ name });
  if (error) return { error: error.message };

  revalidatePath("/");
  return { success: true };
}

export async function updateCategory(
  _prev: MasterActionResult | null,
  formData: FormData
): Promise<MasterActionResult> {
  const id = Number(formData.get("id"));
  const name = String(formData.get("name") ?? "").trim();
  if (!Number.isInteger(id) || id <= 0) return { error: "無効な ID です" };
  if (!name) return { error: "カテゴリー名を入力してください" };

  const auth = await requireAuthSupabase();
  if (auth.error) return { error: auth.error };

  const { error } = await auth
    .supabase!.from("categories")
    .update({ name })
    .eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/");
  return { success: true };
}

export async function deleteCategory(id: number): Promise<MasterActionResult> {
  if (!Number.isInteger(id) || id <= 0) return { error: "無効な ID です" };

  const auth = await requireAuthSupabase();
  if (auth.error) return { error: auth.error };

  const { error } = await auth.supabase!.from("categories").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/");
  return { success: true };
}

export async function createLanguage(
  _prev: MasterActionResult | null,
  formData: FormData
): Promise<MasterActionResult> {
  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  if (!name) return { error: "言語名を入力してください" };
  if (!slug) return { error: "スラッグを入力してください" };

  const auth = await requireAuthSupabase();
  if (auth.error) return { error: auth.error };

  const { error } = await auth.supabase!.from("languages").insert({ name, slug });
  if (error) return { error: error.message };

  revalidatePath("/");
  return { success: true };
}

export async function updateLanguage(
  _prev: MasterActionResult | null,
  formData: FormData
): Promise<MasterActionResult> {
  const id = Number(formData.get("id"));
  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  if (!Number.isInteger(id) || id <= 0) return { error: "無効な ID です" };
  if (!name) return { error: "言語名を入力してください" };
  if (!slug) return { error: "スラッグを入力してください" };

  const auth = await requireAuthSupabase();
  if (auth.error) return { error: auth.error };

  const { error } = await auth
    .supabase!.from("languages")
    .update({ name, slug })
    .eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/");
  return { success: true };
}

export async function deleteLanguage(id: number): Promise<MasterActionResult> {
  if (!Number.isInteger(id) || id <= 0) return { error: "無効な ID です" };

  const auth = await requireAuthSupabase();
  if (auth.error) return { error: auth.error };

  const { error } = await auth.supabase!.from("languages").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/");
  return { success: true };
}
