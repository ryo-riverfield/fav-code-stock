-- Supabase SQL Editor で実行してください
-- Authentication > Providers で Email を有効化してください

alter table stocks enable row level security;

-- 既存ポリシーがある場合は先に削除
-- drop policy if exists "Users can read own stocks" on stocks;
-- drop policy if exists "Users can insert own stocks" on stocks;
-- drop policy if exists "Users can update own stocks" on stocks;
-- drop policy if exists "Users can delete own stocks" on stocks;

create policy "Users can read own stocks"
  on stocks for select
  using (auth.uid() = user_id);

create policy "Users can insert own stocks"
  on stocks for insert
  with check (auth.uid() = user_id);

create policy "Users can update own stocks"
  on stocks for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own stocks"
  on stocks for delete
  using (auth.uid() = user_id);

-- Supabase ダッシュボード設定:
-- Authentication > Providers > Email
--   - Enable Email provider: ON
-- Authentication > URL Configuration
--   - Site URL: https://fav-code-stock.vercel.app
--   - Redirect URLs:
--       https://fav-code-stock.vercel.app/auth/callback
--       http://localhost:3000/auth/callback
-- すぐ試す場合: Authentication > Providers > Email > Confirm email: OFF
--
-- Vercel Environment Variables:
--   NEXT_PUBLIC_SUPABASE_URL
--   NEXT_PUBLIC_SUPABASE_ANON_KEY
--   NEXT_PUBLIC_SITE_URL=https://fav-code-stock.vercel.app
