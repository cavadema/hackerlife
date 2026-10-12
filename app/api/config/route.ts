import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Config pública do Supabase para o jogo estático (public/jogar.html).
// Apenas valores públicos (URL + anon key, protegidos por RLS). Nunca expor service role aqui.
export async function GET() {
  return NextResponse.json(
    {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? null,
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? null,
    },
    { headers: { "Cache-Control": "public, max-age=3600" } }
  );
}
