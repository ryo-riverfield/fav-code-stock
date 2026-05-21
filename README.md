# fav-code-stock

デベロッパー向けのコード・リンクストックサービス（Next.js 16 + Supabase Auth + Tailwind CSS + shadcn/ui）。

## 本番環境

**https://fav-code-stock.vercel.app/**

未ログイン時はログイン画面へリダイレクトされます。

## ローカル開発

```bash
npm install
npm run dev
```

http://localhost:3000 を開きます。

### 環境変数

`.env.local` に設定:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
```

本番（Vercel）でも同じ変数を **Project Settings → Environment Variables** に登録してください。

メール確認のリダイレクト用（推奨）:

```env
NEXT_PUBLIC_SITE_URL=https://fav-code-stock.vercel.app
```

ローカルでは `http://localhost:3000` を使用します。

## Supabase 設定

1. `supabase/rls-policies.sql` を SQL Editor で実行
2. **Authentication → URL Configuration**
   - **Site URL**: `https://fav-code-stock.vercel.app`
   - **Redirect URLs**（両方追加）:
     - `https://fav-code-stock.vercel.app/auth/callback`
     - `http://localhost:3000/auth/callback`
3. **Authentication → Providers → Email** を有効化

## ドキュメント

- [システム構成図](./docs/architecture.md)

## デプロイ

[Vercel](https://vercel.com/) に Git 連携でデプロイ。Next.js プロジェクトとして自動検出されます。
