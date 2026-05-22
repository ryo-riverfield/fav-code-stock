"use client";

import { useState, useTransition } from "react";
import { createStock } from "@/app/actions/stocks";
import { ActionFeedbackDialog } from "@/components/action-feedback-dialog";
import { StockFields } from "@/components/stock-fields";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Category } from "@/types/category";
import type { Language } from "@/types/language";

export function StockForm({
  categories,
  languages,
  defaultCategoryId,
}: {
  categories: Category[];
  languages: Language[];
  defaultCategoryId?: number;
}) {
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const result = await createStock(formData);
      if ("error" in result && result.error) {
        setError(result.error);
        return;
      }
      setFormKey((k) => k + 1);
      setFeedback("ストックを追加しました");
    });
  }

  return (
    <>
      <Card className="border-border/60 bg-card/80 shadow-lg backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-mono text-lg tracking-tight">
            New Stock
          </CardTitle>
          <CardDescription>
            コードスニペットやリンクをストックに追加
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <StockFields
              key={formKey}
              idPrefix="new-stock"
              categories={categories}
              languages={languages}
              defaultValues={{
                title: "",
                url: "",
                code: "",
                category_id: defaultCategoryId,
                code_lang_id: null,
              }}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button
              type="submit"
              disabled={pending}
              className="w-full sm:w-auto"
            >
              {pending ? "登録中..." : "ストックに追加"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <ActionFeedbackDialog
        open={feedback !== null}
        message={feedback}
        onOpenChange={(open) => {
          if (!open) setFeedback(null);
        }}
      />
    </>
  );
}
