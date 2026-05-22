-- ============================================================
-- 002: categories / languages マスタ + stocks FK 化
-- Supabase SQL Editor で実行
-- ============================================================

-- 1. マスタテーブル
create table if not exists public.categories (
  id bigint generated always as identity primary key,
  name text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.languages (
  id bigint generated always as identity primary key,
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

insert into public.categories (name) values
  ('未分類'),
  ('React'),
  ('Supabase')
on conflict (name) do nothing;

insert into public.languages (name, slug) values
  ('TypeScript', 'typescript'),
  ('JavaScript', 'javascript'),
  ('SQL', 'sql'),
  ('その他', 'other')
on conflict (slug) do nothing;

-- 2. stocks: FK 追加
alter table public.stocks
  add column if not exists category_id bigint references public.categories (id)
    on update cascade on delete restrict,
  add column if not exists code_lang_id bigint references public.languages (id)
    on update cascade on delete set null;

-- 3. 既存データ移行（code_lang がある場合）
update public.stocks s
set code_lang_id = l.id
from public.languages l
where s.code_lang is not null
  and lower(trim(s.code_lang)) = l.slug;

update public.stocks s
set code_lang_id = (select id from public.languages where slug = 'other')
where s.code_lang_id is null
  and s.code_lang is not null
  and trim(s.code_lang) <> '';

update public.stocks s
set category_id = (select id from public.categories where name = '未分類')
where s.category_id is null;

-- 4. 旧カラム削除
alter table public.stocks
  drop column if exists code_lang,
  drop column if exists created_user,
  drop column if exists update_user;

alter table public.stocks
  alter column category_id set not null;

-- 5. RLS: マスタ
alter table public.categories enable row level security;
alter table public.languages enable row level security;

drop policy if exists "Authenticated users can read categories" on public.categories;
drop policy if exists "Authenticated users can insert categories" on public.categories;
drop policy if exists "Authenticated users can update categories" on public.categories;
drop policy if exists "Authenticated users can delete categories" on public.categories;

create policy "Authenticated users can read categories"
  on public.categories for select to authenticated using (true);
create policy "Authenticated users can insert categories"
  on public.categories for insert to authenticated with check (true);
create policy "Authenticated users can update categories"
  on public.categories for update to authenticated using (true) with check (true);
create policy "Authenticated users can delete categories"
  on public.categories for delete to authenticated using (true);

drop policy if exists "Authenticated users can read languages" on public.languages;
drop policy if exists "Authenticated users can insert languages" on public.languages;
drop policy if exists "Authenticated users can update languages" on public.languages;
drop policy if exists "Authenticated users can delete languages" on public.languages;

create policy "Authenticated users can read languages"
  on public.languages for select to authenticated using (true);
create policy "Authenticated users can insert languages"
  on public.languages for insert to authenticated with check (true);
create policy "Authenticated users can update languages"
  on public.languages for update to authenticated using (true) with check (true);
create policy "Authenticated users can delete languages"
  on public.languages for delete to authenticated using (true);
