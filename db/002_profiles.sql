-- HackerLife — Fase 2: perfis públicos (apelido/handle para o ranking)
-- Separado de auth.users para poder ter leitura pública (ranking) sem expor e-mail.

create table if not exists public.profiles (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  username   text not null,
  created_at timestamptz not null default now()
);

-- Apelido único (case-insensitive): "Ghost" e "ghost" não coexistem.
create unique index if not exists profiles_username_lower_idx
  on public.profiles (lower(username));

alter table public.profiles enable row level security;

-- Leitura pública (necessária para o ranking da Fase 3). Não expõe e-mail.
drop policy if exists "profiles_public_read" on public.profiles;
create policy "profiles_public_read"
  on public.profiles for select
  using (true);

-- Escrita acontece só pelo servidor (service role, que ignora RLS no cadastro).
-- Nenhuma policy de insert/update para usuários comuns = eles não alteram perfis diretamente.
