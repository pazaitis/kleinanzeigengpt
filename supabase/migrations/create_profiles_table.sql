-- Drop existing triggers first
drop trigger if exists on_auth_user_created on auth.users;

-- Drop existing functions with CASCADE to handle dependencies
drop function if exists public.handle_new_user() cascade;
drop function if exists public.handle_updated_at() cascade;

-- Drop and recreate profiles table
drop table if exists profiles cascade;

-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  role text default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes
create index profiles_email_idx on profiles(email);
create index profiles_role_idx on profiles(role);

-- Enable RLS (Row Level Security)
alter table profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

create policy "Users can insert their own profile"
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );

-- Create functions and triggers
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on profiles
  for each row
  execute procedure handle_updated_at();

-- Recreate trigger for analyses table
create trigger handle_analyses_updated_at
  before update on analyses
  for each row
  execute procedure handle_updated_at();

create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Insert admin user if not exists
insert into profiles (id, email, role)
select id, email, 'admin'
from auth.users
where email = 'your-admin-email@example.com'  -- Replace with your admin email
on conflict (id) do update
set role = 'admin'; 