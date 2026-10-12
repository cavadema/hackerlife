-- HackerLife — Fase 2: tabela de saves do jogo
-- Guarda o progresso de cada usuário como um único blob JSON (mesmo formato do saveGame() do jogo),
-- com algumas colunas desnormalizadas (level, username) para o ranking da Fase 3.

create table if not exists public.game_saves (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  username   text,
  data       jsonb not null,
  level      integer not null default 1,
  updated_at timestamptz not null default now()
);

-- Row Level Security: cada usuário só enxerga e altera o próprio save.
alter table public.game_saves enable row level security;

drop policy if exists "game_saves_select_own" on public.game_saves;
create policy "game_saves_select_own"
  on public.game_saves for select
  using (auth.uid() = user_id);

drop policy if exists "game_saves_insert_own" on public.game_saves;
create policy "game_saves_insert_own"
  on public.game_saves for insert
  with check (auth.uid() = user_id);

drop policy if exists "game_saves_update_own" on public.game_saves;
create policy "game_saves_update_own"
  on public.game_saves for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
