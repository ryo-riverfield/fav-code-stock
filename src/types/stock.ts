import type { Category } from "@/types/category";
import type { Language } from "@/types/language";

export type Stock = {
  id: number;
  user_id: string;
  title: string;
  url: string | null;
  code: string | null;
  category_id: number;
  code_lang_id: number | null;
  created_at: string;
  updated_at: string | null;
};

export type StockWithRelations = Stock & {
  categories: Pick<Category, "id" | "name"> | null;
  languages: Pick<Language, "id" | "name" | "slug"> | null;
};
