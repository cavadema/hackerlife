/* HackerLife — sincronização do save com a nuvem (Supabase).
   Não altera o motor do jogo: encaixa na costura saveGame/loadGame/resetGame.
   Anônimo = comportamento atual (só localStorage). Logado = save sobe/baixa da nuvem. */
(function () {
  "use strict";
  var SAVE_KEY = "hackerlife_save";
  var STORAGE_KEY = "sb-hackerlife-auth";
  var SYNC_FLAG = "hl_cloud_synced";

  function loadScript(src) {
    return new Promise(function (res, rej) {
      var s = document.createElement("script");
      s.src = src;
      s.onload = res;
      s.onerror = rej;
      document.head.appendChild(s);
    });
  }

  function readLocal() {
    try { return JSON.parse(localStorage.getItem(SAVE_KEY) || "null"); } catch (e) { return null; }
  }

  async function main() {
    var cfg;
    try { cfg = await fetch("/api/config").then(function (r) { return r.json(); }); }
    catch (e) { return; }
    if (!cfg || !cfg.url || !cfg.anonKey || !window.supabase) return;

    var sb = window.supabase.createClient(cfg.url, cfg.anonKey, {
      auth: { storageKey: STORAGE_KEY, persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
    });

    var session = (await sb.auth.getSession()).data.session;
    renderBadge(session);
    if (!session) return; // anônimo: só local (conversão vem na Fase 3)

    var uid = session.user.id;
    var username = (session.user.user_metadata && session.user.user_metadata.username) || null;

    // PULL — reconcilia com a nuvem uma vez por carregamento.
    if (!sessionStorage.getItem(SYNC_FLAG)) {
      try {
        var res = await sb.from("game_saves").select("data").eq("user_id", uid).maybeSingle();
        var server = res.data && res.data.data;
        var local = readLocal();
        var sServer = (server && server.savedAt) || 0;
        var sLocal = (local && local.savedAt) || 0;
        if (server && (!local || sServer > sLocal)) {
          localStorage.setItem(SAVE_KEY, JSON.stringify(server));
          sessionStorage.setItem(SYNC_FLAG, "1");
          location.reload();
          return;
        }
      } catch (e) {}
      sessionStorage.setItem(SYNC_FLAG, "1");
    }

    // PUSH — espelha saves locais na nuvem (com debounce), embrulhando saveGame.
    var timer = null;
    function cloudSave() {
      var data = readLocal();
      if (!data) return;
      sb.from("game_saves")
        .upsert({ user_id: uid, username: username, data: data, level: data.level || 1, updated_at: new Date().toISOString() })
        .then(function () {});
    }
    function schedule() { clearTimeout(timer); timer = setTimeout(cloudSave, 2500); }

    if (typeof window.saveGame === "function") {
      var origSave = window.saveGame;
      window.saveGame = function () { var r = origSave.apply(this, arguments); schedule(); return r; };
    }

    // RESET — apaga também o save da nuvem (um confirm só).
    window.resetGame = async function () {
      if (!confirm("Tem certeza? Todo o progresso será perdido.")) return;
      try { await sb.from("game_saves").delete().eq("user_id", uid); } catch (e) {}
      try { localStorage.removeItem(SAVE_KEY); } catch (e) {}
      sessionStorage.setItem(SYNC_FLAG, "1"); // evita re-puxar após o reload
      location.reload();
    };

    cloudSave(); // garante que a nuvem reflita o estado atual ao entrar
  }

  function renderBadge(session) {
    var el = document.createElement("div");
    el.id = "hl-cloud-badge";
    el.style.cssText =
      "position:fixed;top:8px;left:8px;z-index:99999;font-family:monospace;font-size:11px;" +
      "background:#161b22;border:1px solid #30363d;border-radius:6px;padding:4px 8px;color:#8b949e;" +
      "display:flex;gap:8px;align-items:center;opacity:.9";
    if (session) {
      var nick = (session.user.user_metadata && session.user.user_metadata.username) || "você";
      el.innerHTML =
        '<span style="color:#7ee787">☁</span><span>' + escapeHtml(nick) + "</span>" +
        '<a href="#" id="hl-logout" style="color:#484f58;text-decoration:none">sair</a>';
      el.querySelector("#hl-logout").addEventListener("click", async function (ev) {
        ev.preventDefault();
        try {
          var cfg = await fetch("/api/config").then(function (r) { return r.json(); });
          var sb = window.supabase.createClient(cfg.url, cfg.anonKey, { auth: { storageKey: STORAGE_KEY } });
          await sb.auth.signOut();
        } catch (e) {}
        try { sessionStorage.removeItem(SYNC_FLAG); } catch (e) {}
        location.href = "/";
      });
    } else {
      el.innerHTML =
        '<span style="color:#484f58">não salvo</span>' +
        '<a href="/entrar" style="color:#58a6ff;text-decoration:none">entrar p/ salvar</a>';
    }
    document.body.appendChild(el);
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", main);
  else main();
})();
