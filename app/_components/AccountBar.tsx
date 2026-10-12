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
    function apply(s: import("@supabase/supabase-js").Session | null) {
      if (!active) return;
      try {
        document.body.dataset.auth = s ? "in" : "out";
      } catch {}
      if (s) {
        const nick = (s.user.user_metadata?.username as string) || "você";
        setState({ status: "auth", nick });
      } else {
        setState({ status: "anon" });
      }
    }
    supabase.auth.getSession().then(({ data }) => apply(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => apply(s));
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
          <a className="acctbar-link" href="/ranking">
            Ranking
          </a>
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
          <a className="acctbar-link" href="/ranking">
            Ranking
          </a>
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
