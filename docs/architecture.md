# fav-code-stock システム構成

デベロッパー向けストックサービス（Next.js 16 + Supabase Auth + PostgreSQL）のアーキテクチャ概要です。

## デプロイ環境

| 環境 | URL |
|------|-----|
| 本番（Vercel） | https://fav-code-stock.vercel.app/ |
| ローカル | http://localhost:3000 |

ホスティング: [Vercel](https://vercel.com/)  
バックエンド: Supabase（Auth + PostgreSQL + RLS）

## 技術スタック

| 層 | 技術 |
|----|------|
| フロントエンド | Next.js 16 (App Router), React 19 |
| UI | Tailwind CSS v4, shadcn/ui (base-nova) |
| 認証・DB | Supabase Auth + PostgreSQL |
| サーバー連携 | `@supabase/ssr`（Cookie ベースセッション） |
| データ操作 | Server Actions |
| 保護 | Middleware によるルートガード + RLS |

## 環境変数

`.env.local` に以下を設定します。

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
```

本番（Vercel の Environment Variables）:

```env
NEXT_PUBLIC_SITE_URL=https://fav-code-stock.vercel.app
```

ローカル:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## 1. 全体アーキテクチャ

```mermaid
flowchart TB
    subgraph Client["ブラウザ"]
        U[ユーザー]
    end

    subgraph NextApp["Next.js 16 App (fav-code-stock)"]
        MW["middleware.ts<br/>セッション更新・認可"]

        subgraph Pages["Pages / Routes"]
            P_HOME["/ page.tsx<br/>メイン画面"]
            P_LOGIN["/login<br/>ログイン・新規登録"]
            P_CB["/auth/callback<br/>メール確認コールバック"]
        end

        subgraph Components["UI Components"]
            SF[StockForm<br/>Client]
            SL[StockList<br/>Server]
            LF[LoginForm<br/>Client]
            UM[UserMenu<br/>Server]
            UI[shadcn/ui + Tailwind v4]
        end

        subgraph Actions["Server Actions"]
            AUTH["actions/auth.ts<br/>signIn / signUp / signOut"]
            STOCK["actions/stocks.ts<br/>createStock / fetchStocks"]
        end

        subgraph Lib["Supabase クライアント層"]
            SRV["lib/supabase/server.ts"]
            MID["lib/supabase/middleware.ts"]
            BR["lib/supabase/client.ts"]
        end
    end

    subgraph Supabase["Supabase (BaaS)"]
        AUTH_SVC["Auth<br/>Email / Password"]
        DB[("PostgreSQL<br/>stocks テーブル")]
        RLS["Row Level Security<br/>auth.uid() = user_id"]
    end

    ENV[".env.local<br/>NEXT_PUBLIC_SUPABASE_URL<br/>NEXT_PUBLIC_SUPABASE_ANON_KEY"]

    U --> MW
    MW --> Pages
    Pages --> Components
    Components --> Actions
    Actions --> SRV
    MW --> MID
    MID --> AUTH_SVC
    SRV --> AUTH_SVC
    SRV --> DB
    DB --> RLS
    AUTH_SVC --> DB
    ENV -.-> SRV
    ENV -.-> MID
```

---

## 2. ディレクトリ構成

```
fav-code-stock/
├── docs/
│   └── architecture.md          # 本ドキュメント
├── supabase/
│   └── rls-policies.sql         # RLS ポリシー定義
├── src/
│   ├── middleware.ts            # 認証ガード・セッション更新
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx             # メイン画面 (/)
│   │   ├── login/page.tsx       # ログイン画面
│   │   ├── auth/callback/route.ts
│   │   └── actions/
│   │       ├── auth.ts          # signIn, signUp, signOut
│   │       └── stocks.ts        # createStock, fetchStocks
│   ├── components/
│   │   ├── auth/                # LoginForm, UserMenu, SignOutButton
│   │   ├── stock-form.tsx
│   │   ├── stock-list.tsx
│   │   └── ui/                  # shadcn/ui
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── server.ts        # Server Components / Actions 用
│   │   │   ├── middleware.ts    # Middleware 用
│   │   │   └── client.ts        # ブラウザ用（将来の Client 利用向け）
│   │   └── auth/url.ts          # サイト URL 取得（signUp リダイレクト）
│   └── types/stock.ts
└── .env.local
```

```mermaid
flowchart LR
    subgraph src
        middleware[middleware.ts]
        app[app/]
        components[components/]
        lib[lib/]
        types[types/stock.ts]
    end

    subgraph app_detail
        layout[layout.tsx]
        page[page.tsx /]
        login[login/page.tsx]
        callback[auth/callback/route.ts]
        act_auth[actions/auth.ts]
        act_stock[actions/stocks.ts]
    end

    subgraph comp_detail
        stock_form[stock-form.tsx]
        stock_list[stock-list.tsx]
        auth_login[auth/login-form.tsx]
        auth_menu[auth/user-menu.tsx]
        ui[ui/* shadcn]
    end

    subgraph lib_detail
        supa_srv[supabase/server.ts]
        supa_mid[supabase/middleware.ts]
        supa_cli[supabase/client.ts]
        auth_url[auth/url.ts]
    end

    app --> app_detail
    components --> comp_detail
    lib --> lib_detail
```

---

## 3. ルーティング

| パス | 認証 | 役割 |
|------|------|------|
| `/` | 必須 | ストック登録・一覧 |
| `/login` | 不要（ログイン済みは `/` へリダイレクト） | ログイン・新規登録 |
| `/auth/callback` | 不要 | メール確認後のセッション確立 |

Middleware（`src/middleware.ts`）は全ルート（静的アセット除く）で実行され、`src/lib/supabase/middleware.ts` の `updateSession` で以下を行います。

- セッション Cookie の更新
- 未ログイン → `/login` へリダイレクト（`/login`, `/auth` は除外）
- ログイン済みで `/login` → `/` へリダイレクト

---

## 4. 認証フロー

```mermaid
sequenceDiagram
    participant U as ユーザー
    participant MW as Middleware
    participant LP as /login
    participant SA as Server Actions (auth)
    participant SB as Supabase Auth
    participant HP as / (メイン)

    U->>MW: 任意URLへアクセス
    MW->>SB: getUser()（Cookieからセッション検証）

    alt 未ログイン & /login,/auth 以外
        MW-->>U: 302 → /login
        U->>LP: ログイン or 新規登録
        LP->>SA: signIn / signUp
        SA->>SB: signInWithPassword / signUp
        SB-->>SA: セッション Cookie 設定
        SA-->>U: redirect /
    else ログイン済み & /login
        MW-->>U: 302 → /
    else ログイン済み
        MW-->>U: ページ表示
        U->>HP: メイン画面
    end

    Note over U,SB: メール確認ON時
    U->>SB: 確認メールのリンク
    SB-->>U: /auth/callback?code=...
    U->>SB: exchangeCodeForSession
    SB-->>U: redirect /
```

### Supabase ダッシュボード設定

1. **Authentication → Providers → Email** を有効化
2. **Authentication → URL Configuration**
   - Site URL: `https://fav-code-stock.vercel.app`
   - Redirect URLs（本番・ローカル両方）:
     - `https://fav-code-stock.vercel.app/auth/callback`
     - `http://localhost:3000/auth/callback`
3. 開発時は **Confirm email** を OFF にすると即ログイン可能
4. `supabase/rls-policies.sql` を SQL Editor で実行
5. Vercel に `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` を設定

---

## 5. ストック登録・一覧フロー

```mermaid
sequenceDiagram
    participant U as ユーザー
    participant SF as StockForm (Client)
    participant SS as createStock / fetchStocks
    participant SC as supabase/server
    participant DB as stocks + RLS

    U->>SF: フォーム送信
    SF->>SS: createStock(formData)
    SS->>SC: createClient()
    SC->>SC: auth.getUser()
    SS->>DB: INSERT (title, url, code...)
    Note over DB: user_id = auth.uid() (DB default)<br/>RLS: insert with check (auth.uid() = user_id)
    DB-->>SS: OK
    SS-->>SF: success + revalidatePath("/")

    U->>SL: StockList (Server Component)
    SL->>SS: fetchStocks()
    SS->>DB: SELECT * ORDER BY created_at
    Note over DB: RLS: select where auth.uid() = user_id
    DB-->>SL: 自分の行のみ
    SL-->>U: カード一覧表示
```

---

## 6. データモデル

```mermaid
erDiagram
    AUTH_USERS ||--o{ STOCKS : "user_id = auth.uid()"

    AUTH_USERS {
        uuid id PK
        string email
    }

    STOCKS {
        int8 id PK
        uuid user_id FK "default auth.uid()"
        text title "必須"
        text url "nullable"
        text code "nullable"
        text code_lang "nullable"
        text created_user "nullable"
        timestamptz created_at "default now()"
        text update_user "nullable"
        timestamptz updated_at "nullable"
    }
```

### RLS ポリシー

`supabase/rls-policies.sql` で定義。すべて **`auth.uid() = user_id`** です。

| 操作 | ポリシー名 |
|------|------------|
| SELECT | Users can read own stocks |
| INSERT | Users can insert own stocks |
| UPDATE | Users can update own stocks |
| DELETE | Users can delete own stocks |

---

## 7. 画面とコンポーネント

```mermaid
flowchart TB
    subgraph Main["/ メイン画面 (page.tsx)"]
        H[Header + UserMenu]
        F[StockForm]
        L[StockList]
    end

    subgraph LoginPage["/login"]
        LF2[LoginForm<br/>ログイン / 新規登録タブ]
    end

    H --> SO[SignOutButton → signOut]
    H --> SU[supabase.auth.getUser]
    F --> CS[createStock]
    L --> FS[fetchStocks]
    LF2 --> SI[signIn]
    LF2 --> SU2[signUp]

    CS & FS & SI & SU2 & SO --> SC[lib/supabase/server.ts]
```

### コンポーネント種別

| コンポーネント | 種別 | 説明 |
|----------------|------|------|
| `StockForm` | Client | `useActionState` + `createStock` |
| `StockList` | Server | `fetchStocks` で一覧取得 |
| `LoginForm` | Client | ログイン / 新規登録タブ切替 |
| `UserMenu` | Server | 表示メール + ログアウト |
| `SignOutButton` | Server | `signOut` Server Action |

---

## 8. 主要ファイル参照

| ファイル | 責務 |
|----------|------|
| `src/middleware.ts` | Middleware エントリポイント |
| `src/lib/supabase/middleware.ts` | セッション更新・リダイレクト判定 |
| `src/lib/supabase/server.ts` | サーバー側 Supabase クライアント |
| `src/app/actions/auth.ts` | 認証 Server Actions |
| `src/app/actions/stocks.ts` | ストック CRUD（現状: 作成・一覧） |
| `src/app/auth/callback/route.ts` | OAuth / メール確認コールバック |
| `src/types/stock.ts` | `Stock` 型定義 |

---

## 9. 今後の拡張候補

- ストックの編集・削除 UI
- タグ検索・全文検索
- Supabase Realtime による一覧のリアルタイム更新
- OAuth プロバイダ（GitHub 等）の追加
