-- Drop existing policies if they exist
drop policy if exists "Public profiles are viewable by everyone" on profiles;
drop policy if exists "Users can insert their own profile" on profiles;
drop policy if exists "Users can update own profile" on profiles;

-- Create profiles table if it doesn't exist
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  role text default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes
create index if not exists profiles_email_idx on profiles(email);
create index if not exists profiles_role_idx on profiles(role);

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

-- Create a trigger to set updated_at on update
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
drop trigger if exists profiles_updated_at on profiles;
create trigger profiles_updated_at
  before update on profiles
  for each row
  execute procedure handle_updated_at();

-- Create a trigger to automatically create a profile for new users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql;

-- Create trigger for new user
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Insert existing users into profiles if they don't exist
insert into public.profiles (id, email, role)
select id, email, 'user'
from auth.users
where id not in (select id from public.profiles)
on conflict (id) do nothing; 