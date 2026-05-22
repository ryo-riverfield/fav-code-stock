"use client";

import { useActionState, useState, useTransition } from "react";
import {
  createLanguage,
  deleteLanguage,
  updateLanguage,
  type MasterActionResult,
} from "@/app/actions/masters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Language } from "@/types/language";

const initial: MasterActionResult | null = null;

export function LanguageManager({ languages }: { languages: Language[] }) {
  const [createState, createAction, createPending] = useActionState(
    createLanguage,
    initial
  );
  const [editId, setEditId] = useState<number | null>(null);
  const [deletePending, startDelete] = useTransition();

  return (
    <div className="space-y-4">
      <form action={createAction} className="grid gap-2 sm:grid-cols-3">
        <Input name="name" placeholder="言語名" required />
        <Input name="slug" placeholder="slug (typescript)" required className="font-mono text-sm" />
        <Button type="submit" size="sm" disabled={createPending}>
          追加
        </Button>
      </form>
      {createState && "error" in createState && (
        <p className="text-xs text-destructive">{createState.error}</p>
      )}

      <ul className="space-y-2">
        {languages.map((lang) => (
          <li
            key={lang.id}
            className="flex flex-wrap items-center gap-2 rounded-lg border border-border/60 bg-muted/20 px-3 py-2"
          >
            {editId === lang.id ? (
              <LanguageEditRow
                language={lang}
                onDone={() => setEditId(null)}
              />
            ) : (
              <>
                <span className="flex-1 text-sm">
                  <span className="font-medium">{lang.name}</span>
                  <span className="ml-2 font-mono text-xs text-muted-foreground">
                    {lang.slug}
                  </span>
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEditId(lang.id)}
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
                      !window.confirm(`「${lang.name}」を削除しますか？`)
                    ) {
                      return;
                    }
                    startDelete(async () => {
                      const result = await deleteLanguage(lang.id);
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

function LanguageEditRow({
  language,
  onDone,
}: {
  language: Language;
  onDone: () => void;
}) {
  const [state, action, pending] = useActionState(updateLanguage, initial);

  return (
    <form action={action} className="grid w-full flex-1 gap-2 sm:grid-cols-2">
      <input type="hidden" name="id" value={language.id} />
      <Input name="name" defaultValue={language.name} required />
      <Input
        name="slug"
        defaultValue={language.slug}
        required
        className="font-mono text-sm"
      />
      <div className="flex gap-2 sm:col-span-2">
        <Button type="submit" size="sm" disabled={pending}>
          保存
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onDone}>
          取消
        </Button>
      </div>
      {state && "error" in state && (
        <p className="sm:col-span-2 text-xs text-destructive">{state.error}</p>
      )}
    </form>
  );
}
