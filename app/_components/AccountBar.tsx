"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type State =
  | { status: "loading" }
  | { status: "anon" }
  | { status: "auth"; nick: string };

export default function AccountBar() {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      const s = data.session;
      if (s) {
        const nick = (s.user.user_metadata?.username as string) || "você";
        setState({ status: "auth", nick });
      } else {
        setState({ status: "anon" });
      }
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      if (!active) return;
      if (s) {
        const nick = (s.user.user_metadata?.username as string) || "você";
        setState({ status: "auth", nick });
      } else {
        setState({ status: "anon" });
      }
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    try {
      sessionStorage.removeItem("hl_cloud_synced");
    } catch {}
    setState({ status: "anon" });
  }

  return (
    <div className="acctbar">
      {state.status === "loading" && <span className="acctbar-ph" aria-hidden />}

      {state.status === "anon" && (
        <>
          <a className="acctbar-link" href="/entrar">
            Entrar
          </a>
          <a className="acctbar-cta" href="/cadastro">
            Criar conta
          </a>
        </>
      )}

      {state.status === "auth" && (
        <>
          <span className="acctbar-nick">
            <span className="acctbar-cloud">☁</span> {state.nick}
          </span>
          <a className="acctbar-cta" href="/jogar">
            Continuar jogo
          </a>
          <button className="acctbar-link" onClick={handleLogout} type="button">
            Sair
          </button>
        </>
      )}
    </div>
  );
}
