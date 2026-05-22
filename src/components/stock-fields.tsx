import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Category } from "@/types/category";
import type { Language } from "@/types/language";

const selectClassName =
  "flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm shadow-xs outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

export type StockFieldValues = {
  title: string;
  url: string;
  code: string;
  category_id: number;
  code_lang_id: number | null;
};

export function StockFields({
  idPrefix,
  categories,
  languages,
  defaultValues,
}: {
  idPrefix: string;
  categories: Category[];
  languages: Language[];
  defaultValues?: Partial<StockFieldValues>;
}) {
  const fieldId = (name: string) => `${idPrefix}-${name}`;

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor={fieldId("title")}>タイトル *</Label>
        <Input
          id={fieldId("title")}
          name="title"
          required
          defaultValue={defaultValues?.title ?? ""}
          placeholder="useMemo の使い分け"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={fieldId("url")}>URL</Label>
        <Input
          id={fieldId("url")}
          name="url"
          type="url"
          defaultValue={defaultValues?.url ?? ""}
          placeholder="https://..."
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={fieldId("category_id")}>カテゴリー *</Label>
          <select
            id={fieldId("category_id")}
            name="category_id"
            required
            defaultValue={
              defaultValues?.category_id != null
                ? String(defaultValues.category_id)
                : ""
            }
            className={selectClassName}
          >
            <option value="" disabled>
              選択してください
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor={fieldId("code_lang_id")}>言語</Label>
          <select
            id={fieldId("code_lang_id")}
            name="code_lang_id"
            defaultValue={
              defaultValues?.code_lang_id != null
                ? String(defaultValues.code_lang_id)
                : ""
            }
            className={selectClassName}
          >
            <option value="">未選択</option>
            {languages.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor={fieldId("code")}>コード</Label>
        <Textarea
          id={fieldId("code")}
          name="code"
          rows={8}
          defaultValue={defaultValues?.code ?? ""}
          placeholder="const x = 1;"
          className="font-mono text-sm leading-relaxed"
        />
      </div>
    </>
  );
}
