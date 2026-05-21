"use client";

import { useActionState, useState } from "react";
import { signIn, signUp, type AuthFormState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const initialState: AuthFormState = {};

type Mode = "login" | "signup";

export function LoginForm({ authError }: { authError?: string }) {
  const [mode, setMode] = useState<Mode>("login");
  const [loginState, loginAction, loginPending] = useActionState(
    signIn,
    initialState
  );
  const [signupState, signupAction, signupPending] = useActionState(
    signUp,
    initialState
  );

  const state = mode === "login" ? loginState : signupState;
  const action = mode === "login" ? loginAction : signupAction;
  const pending = mode === "login" ? loginPending : signupPending;

  return (
    <Card className="w-full max-w-md border-border/60 bg-card/80 shadow-xl backdrop-blur-sm">
      <CardHeader className="text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          fav-code-stock
        </p>
        <CardTitle className="text-2xl tracking-tight">
          {mode === "login" ? "ログイン" : "新規登録"}
        </CardTitle>
        <CardDescription>
          {mode === "login"
            ? "アカウントでログインしてストックを管理"
            : "メールアドレスでアカウントを作成"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex rounded-lg border border-border/80 p-1">
          <button
            type="button"
            onClick={() => setMode("login")}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              mode === "login"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            ログイン
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              mode === "signup"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            新規登録
          </button>
        </div>

        <form action={action} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">メールアドレス</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">パスワード</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              required
              minLength={6}
              placeholder="••••••••"
            />
          </div>

          {(authError || state.error) && (
            <p className="text-sm text-destructive">
              {authError ?? state.error}
            </p>
          )}
          {state.message && (
            <p className="text-sm text-emerald-500">{state.message}</p>
          )}

          <Button type="submit" disabled={pending} className="w-full">
            {pending
              ? "処理中..."
              : mode === "login"
                ? "ログイン"
                : "アカウントを作成"}
          </Button>
        </form>

        {mode === "signup" && (
          <p className="mt-4 text-center text-xs text-muted-foreground">
            開発時は Supabase ダッシュボードで Email confirmations を OFF
            にすると、すぐログインできます。
          </p>
        )}
      </CardContent>
    </Card>
  );
}
