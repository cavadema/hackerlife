"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

export default function Cadastro() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, username }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Não foi possível criar a conta.");
        setLoading(false);
        return;
      }
      // Login automático logo após o cadastro (sem confirmação de e-mail).
      const { error: signErr } = await supabase.auth.signInWithPassword({ email, password });
      if (signErr) {
        setError("Conta criada, mas o login falhou. Tente entrar.");
        setLoading(false);
        return;
      }
      if (typeof window !== "undefined") {
        try {
          (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "sign_up", {
            method: "email",
          });
        } catch {}
        window.location.href = "/jogar";
      }
    } catch {
      setError("Erro de conexão. Tente novamente.");
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">
          Hacker<span>Life</span>
        </div>
        <p className="auth-sub">Crie sua conta e salve seu progresso.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}

          <div className="auth-field">
            <label htmlFor="username">Apelido</label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ghost_zero"
              required
            />
            <span className="hint">3–20 caracteres: letras, números ou _. Aparece no ranking.</span>
          </div>

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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="mínimo 6 caracteres"
              minLength={6}
              required
            />
          </div>

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? "Criando..." : "Criar conta e jogar"}
          </button>
        </form>

        <p className="auth-alt">
          Já tem conta? <Link href="/entrar">Entrar</Link>
        </p>
        <Link className="auth-back" href="/">
          ← voltar ao início
        </Link>
      </div>
    </div>
  );
}
