-- HackerLife — sincronizar mensagens do celular (inbox/SMS) na nuvem.
-- Guarda o "log" de mensagens entregues junto do save, por usuário.

alter table public.game_saves
  add column if not exists messages jsonb;
