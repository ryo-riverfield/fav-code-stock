"use client";

import { useState, useTransition } from "react";
import { updateStock } from "@/app/actions/stocks";
import { ActionFeedbackDialog } from "@/components/action-feedback-dialog";
import { StockFields } from "@/components/stock-fields";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Category } from "@/types/category";
import type { Language } from "@/types/language";
import type { StockWithRelations } from "@/types/stock";

export function EditStockButton({
  stock,
  categories,
  languages,
}: {
  stock: StockWithRelations;
  categories: Category[];
  languages: Language[];
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await updateStock(formData);
      if ("error" in result && result.error) {
        setError(result.error);
        return;
      }
      setOpen(false);
      setFeedback("ストックを更新しました");
    });
  }

  return (
    <>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button type="button" variant="outline" size="sm">
            編集
          </Button>
        }
      />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>ストックを編集</DialogTitle>
          <DialogDescription>
            「{stock.title}」の内容を更新します
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="id" value={stock.id} />
          <StockFields
            idPrefix={`edit-${stock.id}`}
            categories={categories}
            languages={languages}
            defaultValues={{
              title: stock.title,
              url: stock.url ?? "",
              code: stock.code ?? "",
              category_id: stock.category_id,
              code_lang_id: stock.code_lang_id,
            }}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter className="border-t-0 bg-transparent p-0 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={pending}
            >
              キャンセル
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "保存中..." : "保存"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

    <ActionFeedbackDialog
      open={feedback !== null}
      message={feedback}
      onOpenChange={(isOpen) => {
        if (!isOpen) setFeedback(null);
      }}
    />
    </>
  );
}
