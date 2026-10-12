"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

export default function Entrar() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: signErr } = await supabase.auth.signInWithPassword({ email, password });
    if (signErr) {
      setError("E-mail ou senha incorretos.");
      setLoading(false);
      return;
    }
    if (typeof window !== "undefined") {
      try {
        (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "login", {
          method: "email",
        });
      } catch {}
      window.location.href = "/jogar";
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">
          Hacker<span>Life</span>
        </div>
        <p className="auth-sub">Entre para continuar seu progresso.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}

          <div className="auth-field">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@email.com"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="sua senha"
              required
            />
          </div>

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="auth-alt">
          Não tem conta? <Link href="/cadastro">Criar agora</Link>
        </p>
        <Link className="auth-back" href="/">
          ← voltar ao início
        </Link>
      </div>
    </div>
  );
}
