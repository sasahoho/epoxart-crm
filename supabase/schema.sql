create extension if not exists "pgcrypto";

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  full_name text not null,
  email text not null,
  phone text not null,
  city text not null,
  address text not null,
  project_type text not null,
  square_feet integer not null,
  length_ft numeric,
  width_ft numeric,
  concrete_condition text,
  humidity text,
  desired_date text,
  description text not null,
  photo_paths text[] not null default '{}',
  status text not null default 'Nouvelle',
  notes text
);

alter table public.quotes enable row level security;

-- Les visiteurs passent par l'API serveur. Aucun accès direct public à la table.
revoke all on table public.quotes from anon, authenticated;

insert into storage.buckets (id, name, public)
values ('quote-photos', 'quote-photos', false)
on conflict (id) do nothing;
