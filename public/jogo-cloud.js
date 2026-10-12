/* HackerLife — nuvem (Supabase) + eventos de funil (GA4).
   Não altera o motor do jogo: encaixa em saveGame/loadGame/resetGame.
   Eventos de GA rodam para TODOS (anônimos incluídos). Nuvem só para logados. */
(function () {
  "use strict";
  var SAVE_KEY = "hackerlife_save";
  var STORAGE_KEY = "sb-hackerlife-auth";
  var SYNC_FLAG = "hl_cloud_synced";
  var START_FLAG = "hl_started";

  function ga() {
    var g = window.gtag;
    if (typeof g === "function") { try { g.apply(null, arguments); } catch (e) {} }
  }
  function readLocal() {
    try { return JSON.parse(localStorage.getItem(SAVE_KEY) || "null"); } catch (e) { return null; }
  }
  function loadScript(src) {
    return new Promise(function (res, rej) {
      var s = document.createElement("script");
      s.src = src; s.onload = res; s.onerror = rej;
      document.head.appendChild(s);
    });
  }

  // Emite eventos de funil comparando o save anterior com o novo.
  function emitFunnel(prev, cur) {
    if (!cur) return;
    if (prev && cur.level > prev.level) ga("event", "nivel_up", { level: cur.level });
    var curM = (cur.doneMissions && cur.doneMissions.length) || 0;
    var prevM = (prev && prev.doneMissions && prev.doneMissions.length) || 0;
    if (curM > prevM) ga("event", "missao_completada", { total: curM, level: cur.level || 1 });
  }

  // Embrulha saveGame para: (1) eventos de GA (todos) e (2) push à nuvem (logados).
  function wrapSaveGame(onSave) {
    if (typeof window.saveGame !== "function" || window.__hlWrapped) return;
    window.__hlWrapped = true;
    var prev = readLocal();
    var orig = window.saveGame;
    window.saveGame = function () {
      var r = orig.apply(this, arguments);
      var cur = readLocal();
      emitFunnel(prev, cur);
      prev = cur;
      if (onSave) onSave(cur);
      return r;
    };
  }

  async function main() {
    // Evento de início de jogo (uma vez por aba), antes de depender da nuvem.
    var loggedInGuess = !!localStorage.getItem(STORAGE_KEY);
    if (!sessionStorage.getItem(START_FLAG)) {
      sessionStorage.setItem(START_FLAG, "1");
      ga("event", "jogo_iniciado", { logado: loggedInGuess });
    }

    var cfg;
    try { cfg = await fetch("/api/config").then(function (r) { return r.json(); }); }
    catch (e) { wrapSaveGame(null); return; }
    if (!cfg || !cfg.url || !cfg.anonKey || !window.supabase) { wrapSaveGame(null); return; }

    var sb = window.supabase.createClient(cfg.url, cfg.anonKey, {
      auth: { storageKey: STORAGE_KEY, persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
    });

    var session = (await sb.auth.getSession()).data.session;
    renderBadge(session);

    if (!session) {
      // Anônimo: só GA (sem nuvem). O progresso local é herdado se criar conta depois.
      wrapSaveGame(null);
      return;
    }

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

    // PUSH — espelha saves locais na nuvem (debounce).
    var timer = null;
    function cloudSave() {
      var data = readLocal();
      if (!data) return;
      sb.from("game_saves")
        .upsert({ user_id: uid, username: username, data: data, level: data.level || 1, updated_at: new Date().toISOString() })
        .then(function () {});
    }
    wrapSaveGame(function () { clearTimeout(timer); timer = setTimeout(cloudSave, 2500); });

    // RESET — apaga também o save da nuvem (um confirm só).
    window.resetGame = async function () {
      if (!confirm("Tem certeza? Todo o progresso será perdido.")) return;
      try { await sb.from("game_saves").delete().eq("user_id", uid); } catch (e) {}
      try { localStorage.removeItem(SAVE_KEY); } catch (e) {}
      sessionStorage.setItem(SYNC_FLAG, "1");
      location.reload();
    };

    cloudSave(); // garante que a nuvem reflita o estado atual (inclui progresso anônimo herdado)
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
        '<a href="/ranking" style="color:#484f58;text-decoration:none">ranking</a>' +
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
        '<a href="/cadastro" style="color:#58a6ff;text-decoration:none">criar conta p/ salvar</a>';
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
