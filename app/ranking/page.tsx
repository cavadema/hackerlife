import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";

export const revalidate = 60; // ISR: atualiza a cada 60s (rápido + SEO + fresco)

export const metadata: Metadata = {
  title: "Ranking — Simulador de Hacker (HackerLife)",
  description:
    "Ranking dos melhores hackers do HackerLife: veja os jogadores com maior nível e progresso no Simulador de Hacker. Crie sua conta e dispute o topo.",
  alternates: { canonical: "/ranking" },
  openGraph: {
    type: "website",
    url: "https://simuladordehacker.com.br/ranking",
    title: "Ranking — Simulador de Hacker (HackerLife)",
    description: "Os melhores hackers do HackerLife. Dispute o topo do ranking.",
  },
};

type Row = {
  username: string;
  level: number;
  money: number;
  xp: number;
  rep: number;
};

function fmtMoney(n: number) {
  return "R$" + (n || 0).toLocaleString("pt-BR");
}

export default async function Ranking() {
  let rows: Row[] = [];
  let erro = false;
  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("leaderboard")
      .select("username, level, money, xp, rep")
      .order("level", { ascending: false })
      .order("money", { ascending: false })
      .order("xp", { ascending: false })
      .limit(100);
    if (error) erro = true;
    else rows = (data as Row[]) ?? [];
  } catch {
    erro = true;
  }

  return (
    <div id="landing">
      <div className="landing-inner">
        <div className="acctbar">
          <a className="acctbar-link" href="/">
            ← início
          </a>
          <a className="acctbar-cta" href="/jogar">
            Jogar
          </a>
        </div>

        <section className="landing-hero" style={{ paddingBottom: 32 }}>
          <h1 style={{ fontSize: "clamp(24px,5vw,38px)" }}>
            Ranking <span>Hacker</span>
          </h1>
          <p className="tagline">
            <strong>Os hackers mais avançados do HackerLife.</strong> Suba de nível e dispute o topo.
          </p>
        </section>

        {erro && <p className="rank-empty">Não foi possível carregar o ranking agora. Tente novamente em instantes.</p>}

        {!erro && rows.length === 0 && (
          <p className="rank-empty">
            Ninguém no ranking ainda. <a href="/cadastro">Crie sua conta</a> e seja o primeiro!
          </p>
        )}

        {!erro && rows.length > 0 && (
          <table className="rank-table">
            <thead>
              <tr>
                <th className="rank-pos">#</th>
                <th>Hacker</th>
                <th className="rank-num">Nível</th>
                <th className="rank-num">Dinheiro</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.username + i} className={i < 3 ? "rank-top" : ""}>
                  <td className="rank-pos">
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                  </td>
                  <td className="rank-nick">{r.username}</td>
                  <td className="rank-num">{r.level}</td>
                  <td className="rank-num">{fmtMoney(r.money)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div style={{ textAlign: "center", padding: "28px 0 8px" }}>
          <a className="landing-cta" href="/jogar">
            ▶ Jogar e subir no ranking
          </a>
        </div>
      </div>
    </div>
  );
}
