-- プロジェクトテーブル
create table projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id),
  name text not null,
  company text,
  amount_excluding_tax integer,
  amount_including_tax integer,
  duration text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- タスクテーブル
create table tasks (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references projects(id) on delete cascade,
  text text not null,
  completed boolean default false,
  percentage integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- サブタスクテーブル
create table sub_tasks (
  id uuid default gen_random_uuid() primary key,
  task_id uuid references tasks(id) on delete cascade,
  text text not null,
  completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- メモテーブル
create table notes (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references projects(id) on delete cascade,
  type text not null,
  title text not null,
  content text,
  date date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ファイルテーブル
create table files (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references projects(id) on delete cascade,
  name text not null,
  type text,
  url text not null,
  category text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
