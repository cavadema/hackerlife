-- HackerLife — Fase 3: view do ranking (junta apelido + métricas do save).
-- Lida no servidor com a service role (ignora RLS); expõe só colunas de ranking.

create or replace view public.leaderboard as
select
  p.username,
  g.level,
  coalesce((g.data->>'money')::bigint, 0) as money,
  coalesce((g.data->>'xp')::int, 0)       as xp,
  coalesce((g.data->>'rep')::int, 0)       as rep,
  g.updated_at
from public.game_saves g
join public.profiles p on p.user_id = g.user_id;
