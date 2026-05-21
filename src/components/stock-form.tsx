"use client";

import { useActionState } from "react";
import { createStock } from "@/app/actions/stocks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type FormState = {
  error?: string;
  success?: boolean;
};

const initialState: FormState = {};

export function StockForm() {
  const [state, formAction, pending] = useActionState(
    async (_prev: FormState, formData: FormData) => {
      const result = await createStock(formData);
      if ("error" in result && result.error) {
        return { error: result.error };
      }
      return { success: true };
    },
    initialState
  );

  return (
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
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">タイトル *</Label>
            <Input
              id="title"
              name="title"
              required
              placeholder="useMemo の使い分け"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input id="url" name="url" type="url" placeholder="https://..." />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="code_lang">言語</Label>
              <Input
                id="code_lang"
                name="code_lang"
                placeholder="typescript"
                className="font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="created_user">登録者</Label>
              <Input
                id="created_user"
                name="created_user"
                placeholder="you"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="code">コード</Label>
            <Textarea
              id="code"
              name="code"
              rows={8}
              placeholder="const x = 1;"
              className="font-mono text-sm leading-relaxed"
            />
          </div>
          {state.error && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}
          {state.success && !state.error && (
            <p className="text-sm text-emerald-500">ストックを追加しました</p>
          )}
          <Button type="submit" disabled={pending} className="w-full sm:w-auto">
            {pending ? "登録中..." : "ストックに追加"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
