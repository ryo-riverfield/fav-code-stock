"use client";

import { useTransition } from "react";
import { deleteStock } from "@/app/actions/stocks";
import { Button } from "@/components/ui/button";

export function DeleteStockButton({
  stockId,
  stockTitle,
}: {
  stockId: number;
  stockTitle: string;
}) {
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    const message = `「${stockTitle}」を削除しますか？\nこの操作は取り消せません。`;
    if (!window.confirm(message)) return;

    startTransition(async () => {
      const result = await deleteStock(stockId);
      if ("error" in result && result.error) {
        window.alert(result.error);
      }
    });
  }

  return (
    <Button
      type="button"
      variant="destructive"
      size="sm"
      disabled={pending}
      onClick={handleDelete}
    >
      {pending ? "削除中..." : "削除"}
    </Button>
  );
}
