"use client";

import { useActionState, useState, useTransition } from "react";
import {
  createCategory,
  deleteCategory,
  updateCategory,
  type MasterActionResult,
} from "@/app/actions/masters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Category } from "@/types/category";

const initial: MasterActionResult | null = null;

export function CategoryManager({ categories }: { categories: Category[] }) {
  const [createState, createAction, createPending] = useActionState(
    createCategory,
    initial
  );
  const [editId, setEditId] = useState<number | null>(null);
  const [deletePending, startDelete] = useTransition();

  return (
    <div className="space-y-4">
      <form action={createAction} className="flex gap-2">
        <div className="flex-1 space-y-1">
          <Label htmlFor="new-category" className="sr-only">
            新規カテゴリー
          </Label>
          <Input
            id="new-category"
            name="name"
            placeholder="カテゴリー名"
            required
          />
        </div>
        <Button type="submit" size="sm" disabled={createPending}>
          追加
        </Button>
      </form>
      {createState && "error" in createState && (
        <p className="text-xs text-destructive">{createState.error}</p>
      )}

      <ul className="space-y-2">
        {categories.map((cat) => (
          <li
            key={cat.id}
            className="flex flex-wrap items-center gap-2 rounded-lg border border-border/60 bg-muted/20 px-3 py-2"
          >
            {editId === cat.id ? (
              <CategoryEditRow
                category={cat}
                onDone={() => setEditId(null)}
              />
            ) : (
              <>
                <span className="flex-1 text-sm font-medium">{cat.name}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditId(cat.id)}
                >
                  編集
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  disabled={deletePending}
                  onClick={() => {
                    if (
                      !window.confirm(
                        `「${cat.name}」を削除しますか？\n紐づくストックがある場合は削除できません。`
                      )
                    ) {
                      return;
                    }
                    startDelete(async () => {
                      const result = await deleteCategory(cat.id);
                      if ("error" in result && result.error) {
                        window.alert(result.error);
                      }
                    });
                  }}
                >
                  削除
                </Button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CategoryEditRow({
  category,
  onDone,
}: {
  category: Category;
  onDone: () => void;
}) {
  const [state, action, pending] = useActionState(updateCategory, initial);

  return (
    <form action={action} className="flex w-full flex-1 flex-wrap gap-2">
      <input type="hidden" name="id" value={category.id} />
      <Input
        name="name"
        defaultValue={category.name}
        required
        className="min-w-[120px] flex-1"
      />
      <Button type="submit" size="sm" disabled={pending}>
        保存
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={onDone}>
        取消
      </Button>
      {state && "error" in state && (
        <p className="w-full text-xs text-destructive">{state.error}</p>
      )}
    </form>
  );
}
