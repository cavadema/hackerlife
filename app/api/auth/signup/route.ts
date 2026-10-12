import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

const USERNAME_RE = /^[a-zA-Z0-9_]{3,20}$/;

export async function POST(request: Request) {
  let body: { email?: string; password?: string; username?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";
  const username = (body.username ?? "").trim();

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "E-mail inválido." }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "A senha precisa ter ao menos 6 caracteres." }, { status: 400 });
  }
  if (!USERNAME_RE.test(username)) {
    return NextResponse.json(
      { error: "Apelido deve ter 3–20 caracteres: letras, números ou _." },
      { status: 400 }
    );
  }

  const admin = createAdminClient();

  // Apelido já em uso? (case-insensitive)
  const { data: taken } = await admin
    .from("profiles")
    .select("user_id")
    .ilike("username", username)
    .maybeSingle();
  if (taken) {
    return NextResponse.json({ error: "Esse apelido já está em uso." }, { status: 409 });
  }

  // Cria o usuário já confirmado (cadastro instantâneo, sem e-mail de confirmação).
  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { username },
  });

  if (createErr || !created?.user) {
    const msg = createErr?.message ?? "";
    if (/already|registered|exists/i.test(msg)) {
      return NextResponse.json({ error: "Esse e-mail já está cadastrado." }, { status: 409 });
    }
    return NextResponse.json({ error: "Não foi possível criar a conta." }, { status: 400 });
  }

  // Reserva o apelido no perfil público.
  const { error: profErr } = await admin
    .from("profiles")
    .insert({ user_id: created.user.id, username });

  if (profErr) {
    // Conflito de corrida no apelido: desfaz o usuário recém-criado.
    await admin.auth.admin.deleteUser(created.user.id);
    return NextResponse.json({ error: "Esse apelido já está em uso." }, { status: 409 });
  }

  return NextResponse.json({ ok: true });
}
