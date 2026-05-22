# fav-code-stock

デベロッパー向けのコード・リンクストックサービス（Next.js 16 + Supabase Auth + Tailwind CSS + shadcn/ui）。

## 本番環境

**https://fav-code-stock.vercel.app/**

未ログイン時はログイン画面へリダイレクトされます。

## 主な機能

- メール / パスワード認証（Supabase Auth）
- ストックの登録・編集・削除（自分のデータのみ・RLS）
- カテゴリー・言語マスタの管理（追加・編集・削除）
- カテゴリー別アコーディオン一覧（0 件のカテゴリーは非表示）
- 本番 / 開発環境のタイトル表示切替

## ローカル開発

```bash
npm install
npm run dev
```

http://localhost:3000 を開きます。

### 環境変数

`.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

本番（Vercel）では `NEXT_PUBLIC_SITE_URL=https://fav-code-stock.vercel.app` を追加してください。

## Supabase 設定

SQL Editor で **順に** 実行:

1. `supabase/rls-policies.sql` — `stocks` テーブル用 RLS（初回）
2. `supabase/migrations/002_categories_languages.sql` — `categories` / `languages` マスタ、`stocks` の FK 移行

ダッシュボード:

- **Authentication → Providers → Email** を有効化
- **Authentication → URL Configuration**
  - Site URL: `https://fav-code-stock.vercel.app`
  - Redirect URLs:
    - `https://fav-code-stock.vercel.app/auth/callback`
    - `http://localhost:3000/auth/callback`

## ドキュメント

- [システム構成図](./docs/architecture.md)

## デプロイ

[Vercel](https://vercel.com/) に Git 連携でデプロイ。Next.js プロジェクトとして自動検出されます。
