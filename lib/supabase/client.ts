"use client";

import { createClient } from "@supabase/supabase-js";

// Cliente de navegador: guarda a sessão no localStorage com uma chave FIXA e compartilhada.
// A mesma chave é usada pelo jogo estático (public/jogar.html), então o login feito aqui
// vale lá dentro (mesma origem = mesmo localStorage). NÃO mudar sem atualizar o jogo.
export const SUPABASE_STORAGE_KEY = "sb-hackerlife-auth";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storageKey: SUPABASE_STORAGE_KEY,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  }
);
