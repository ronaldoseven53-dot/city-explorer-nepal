create table favorites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  destination_id text not null,
  created_at timestamptz default now(),
  unique(user_id, destination_id)
);

alter table favorites enable row level security;

create policy "Users manage own favorites" on favorites
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
