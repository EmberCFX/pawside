-- Pawside production schema. Run this in the Supabase SQL editor once.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text unique not null,
  full_name text,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.pets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles (id) on delete cascade,
  name text not null,
  type text,
  breed text,
  age text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  booking_number text unique not null,
  customer_id uuid references public.profiles (id) on delete set null,
  service_slug text not null,
  service_name text,
  duration_minutes int,
  frequency text,
  visit_date date,
  visit_time text,
  weekdays int[],
  add_on_slugs text[] not null default '{}',
  membership text,
  promo_code text,
  pet_count int not null default 1,
  pets_json jsonb not null default '[]',
  address_line1 text,
  address_line2 text,
  city text,
  state text,
  postal_code text,
  entry_instructions text,
  care_instructions text,
  contact_name text,
  contact_email text not null,
  contact_phone text,
  subtotal int not null default 0,
  total int not null default 0,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  payment_status text not null default 'unpaid'
    check (payment_status in ('unpaid', 'paid', 'refunded')),
  stripe_session_id text,
  stripe_payment_intent text,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  pet_type text,
  service text,
  message text not null,
  created_at timestamptz not null default now()
);

create index if not exists bookings_created_at_idx on public.bookings (created_at desc);
create index if not exists bookings_email_idx on public.bookings (contact_email);
create index if not exists messages_created_at_idx on public.contact_messages (created_at desc);

-- New accounts get a profile. ADMIN_EMAILS is also applied in app code.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    case
      when lower(new.email) = 'hello@pawside.co' then 'admin'
      else 'customer'
    end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.pets enable row level security;
alter table public.bookings enable row level security;
alter table public.contact_messages enable row level security;

create policy "profiles_own_read" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_own_update" on public.profiles
  for update using (auth.uid() = id);

create policy "pets_own_all" on public.pets
  for all using (auth.uid() = owner_id);

create policy "bookings_own_read" on public.bookings
  for select using (auth.uid() = customer_id or contact_email = (select email from public.profiles where id = auth.uid()));

-- Writes go through the service role in API routes.
grant usage on schema public to anon, authenticated, service_role;
grant all on all tables in schema public to service_role;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update, delete on public.pets to authenticated;
grant select on public.bookings to authenticated;
