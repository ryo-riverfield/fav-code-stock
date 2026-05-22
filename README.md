# fav-code-stock

デベロッパー向けのコード・リンクストックサービス（Next.js 16 + Supabase Auth + Tailwind CSS + shadcn/ui）。
お気に入りのコードスニペットを、カテゴリーや言語ごとにマスタ管理してストックできる 自分専用のコード帳アプリ です。

## 本番環境

**https://fav-code-stock.vercel.app/**

未ログイン時はログイン画面へリダイレクトされます。

## 主な機能

- メール / パスワード認証（Supabase Auth）
- ストックの登録・編集・削除（認証ユーザー専用・RLSによる保護）
- カテゴリー・言語マスタの管理（追加・編集・削除）
- カテゴリー別アコーディオン一覧（0 件のカテゴリーは非表示）
- 本番 / 開発環境のタイトル表示切替

## CRUD 詳細

 - Create: お気に入りコードの新規登録（カテゴリー・言語はセレクトボックス選択）
 - Read: ストックしたコードをカテゴリーごとにアコーディオンで開閉しながら一覧表示
 - Update: 登録済みコードやタイトルの編集
 - Delete: 不要になったストックの削除
 - DB マスタ管理: カテゴリーと言語は PostgreSQL 上でマスタテーブル化し、外部キーで厳密に紐付け

## こだわったポイント

- **データ構造の最適化:** 
カテゴリーや言語をフリーテキストではなくマスタ管理にすることで、表記揺れを防ぎ堅牢な設計。
- **優れた UI/UX:** 
大量のコードをストックしても画面が散らからないよう、アコーディオン UI でスッキリ整理。

## 開発環境

- Frontend: Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui
- Backend/DB: Supabase (PostgreSQL)
- Hosting: Vercel
- Editor: Cursor (VScode)

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
2. `supabase/migrations/002_categories_languages.sql` — `categories` / `languages` マスタの作成、`stocks` の外部キー（FK）移行SQLの実行

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

Vercel に Git 連携でデプロイ。Next.js プロジェクトとして自動検出されます。
