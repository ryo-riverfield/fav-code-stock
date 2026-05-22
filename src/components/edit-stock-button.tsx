"use client";

import { useState, useTransition } from "react";
import { updateStock } from "@/app/actions/stocks";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Stock } from "@/types/stock";

type EditableStock = Pick<
  Stock,
  "id" | "title" | "url" | "code" | "code_lang" | "created_user"
>;

export function EditStockButton({ stock }: { stock: EditableStock }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const fieldId = (name: string) => `${name}-${stock.id}`;

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
    });
  }

  return (
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
          <div className="space-y-2">
            <Label htmlFor={fieldId("title")}>タイトル *</Label>
            <Input
              id={fieldId("title")}
              name="title"
              required
              defaultValue={stock.title}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={fieldId("url")}>URL</Label>
            <Input
              id={fieldId("url")}
              name="url"
              type="url"
              defaultValue={stock.url ?? ""}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={fieldId("code_lang")}>言語</Label>
              <Input
                id={fieldId("code_lang")}
                name="code_lang"
                className="font-mono text-sm"
                defaultValue={stock.code_lang ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={fieldId("created_user")}>登録者</Label>
              <Input
                id={fieldId("created_user")}
                name="created_user"
                defaultValue={stock.created_user ?? ""}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor={fieldId("code")}>コード</Label>
            <Textarea
              id={fieldId("code")}
              name="code"
              rows={6}
              className="font-mono text-sm leading-relaxed"
              defaultValue={stock.code ?? ""}
            />
          </div>
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
  );
}
