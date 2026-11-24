-- PurrfectCat：收藏 / 我的代码 / 个人主页
-- 用法：Supabase 控制台 → SQL Editor → 粘贴整份 → Run。可以重复运行。

-- ---------- 个人资料（公开可读，不含邮箱）----------
create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  handle       text not null unique check (handle ~ '^[a-z0-9_-]{3,20}$'),
  display_name text check (char_length(display_name) <= 40),
  bio          text check (char_length(bio) <= 200),
  created_at   timestamptz not null default now()
);

-- ---------- 收藏的动效 + 自己写的代码 ----------
create table if not exists public.items (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  kind        text not null check (kind in ('motion', 'custom')),
  motion_id   text check (char_length(motion_id) <= 80),        -- kind = motion：动效库里的 id
  title       text check (char_length(title) <= 80),            -- kind = custom
  description text check (char_length(description) <= 300),
  html        text check (char_length(html) <= 20000),
  css         text check (char_length(css) <= 20000),
  js          text check (char_length(js) <= 20000),
  visibility  text not null default 'private' check (visibility in ('public', 'private')),
  liked       boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  check ((kind = 'motion' and motion_id is not null) or (kind = 'custom' and title is not null))
);
create unique index if not exists items_one_motion_per_user on public.items (user_id, motion_id) where kind = 'motion';
create index if not exists items_user_created on public.items (user_id, created_at desc);

-- updated_at 自动更新
create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
drop trigger if exists items_touch on public.items;
create trigger items_touch before update on public.items for each row execute function public.touch_updated_at();

-- 每人最多 300 条，防止被灌库
create or replace function public.cap_items() returns trigger language plpgsql as $$
begin
  if (select count(*) from public.items where user_id = new.user_id) >= 300 then
    raise exception 'item limit reached (300)';
  end if;
  return new;
end $$;
drop trigger if exists items_cap on public.items;
create trigger items_cap before insert on public.items for each row execute function public.cap_items();

-- ---------- 行级权限（public / private 靠这里保证，不是靠前端）----------
alter table public.profiles enable row level security;
alter table public.items    enable row level security;

drop policy if exists "profiles are readable by everyone" on public.profiles;
create policy "profiles are readable by everyone" on public.profiles for select using (true);
drop policy if exists "users create their own profile" on public.profiles;
create policy "users create their own profile" on public.profiles for insert with check (auth.uid() = id);
drop policy if exists "users update their own profile" on public.profiles;
create policy "users update their own profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "public items or my own" on public.items;
create policy "public items or my own" on public.items for select using (visibility = 'public' or user_id = auth.uid());
drop policy if exists "insert my own items" on public.items;
create policy "insert my own items" on public.items for insert with check (user_id = auth.uid());
drop policy if exists "update my own items" on public.items;
create policy "update my own items" on public.items for update using (user_id = auth.uid()) with check (user_id = auth.uid());
drop policy if exists "delete my own items" on public.items;
create policy "delete my own items" on public.items for delete using (user_id = auth.uid());

-- 主页名字一旦起好就不能改（链接不会失效）
create or replace function public.lock_handle() returns trigger language plpgsql as $$
begin
  if new.handle <> old.handle then raise exception 'handle cannot be changed'; end if;
  return new;
end $$;
drop trigger if exists profiles_lock_handle on public.profiles;
create trigger profiles_lock_handle before update on public.profiles for each row execute function public.lock_handle();
