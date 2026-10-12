/* HackerLife — nuvem (Supabase) + eventos de funil (GA4).
   Não altera o motor do jogo: encaixa em saveGame/loadGame/resetGame.
   Eventos de GA rodam para TODOS (anônimos incluídos). Nuvem só para logados. */
(function () {
  "use strict";
  var SAVE_KEY = "hackerlife_save";
  var STORAGE_KEY = "sb-hackerlife-auth";
  var SYNC_FLAG = "hl_cloud_synced";
  var START_FLAG = "hl_started";
  var MSG_KEY = "hl_msgs_v1"; // persistência das mensagens (inbox/sms do celular)
  var cloudPush = null; // definido em main() quando logado: agenda push à nuvem

  // ---- Persistência das mensagens do celular (e-mails + SMS) ----
  // inbox/smsBox não são globais, mas addEmail/addSMS/renderPhone/toast são.
  // Intercepta as adições: guarda no localStorage, restaura na ordem ao carregar
  // (sem toast) e ignora reenvios duplicados (o onboarding reenvia a cada load).
  function msgSig(kind, e) {
    return kind === "e"
      ? "e|" + (e.subject || "") + "|" + (e.body || "")
      : "s|" + (e.from || "") + "|" + (e.text || "");
  }
  function loadMsgStore() {
    try { return JSON.parse(localStorage.getItem(MSG_KEY) || "null") || { log: [] }; }
    catch (e) { return { log: [] }; }
  }
  // Une dois logs de mensagens por assinatura, preservando a ordem (a primeiro, extras de b depois).
  function mergeLogs(a, b) {
    var seen = {}, out = [];
    function add(log) {
      if (!log || !log.length) return;
      for (var i = 0; i < log.length; i++) {
        var it = log[i];
        if (!it || !it.m) continue;
        var sig = msgSig(it.k, it.m);
        if (!seen[sig]) { seen[sig] = 1; out.push(it); }
      }
    }
    add(a); add(b);
    return out;
  }
  function setupMessagePersistence() {
    if (window.__hlMsgPersist) return;
    if (typeof window.addEmail !== "function" || typeof window.addSMS !== "function") return;
    window.__hlMsgPersist = true;

    var store = loadMsgStore();
    var delivered = {};
    for (var i = 0; i < store.log.length; i++) {
      var it = store.log[i];
      delivered[msgSig(it.k, it.m)] = 1;
    }
    function persist() { try { localStorage.setItem(MSG_KEY, JSON.stringify(store)); } catch (e) {} }

    var origAddEmail = window.addEmail;
    var origAddSMS = window.addSMS;

    window.addEmail = function (e) {
      var sig = msgSig("e", e);
      if (delivered[sig]) return;        // já entregue antes → ignora (sem replay)
      delivered[sig] = 1;
      var r = origAddEmail(e);
      store.log.push({ k: "e", m: e }); persist();
      if (cloudPush) cloudPush();
      return r;
    };
    window.addSMS = function (e) {
      var sig = msgSig("s", e);
      if (delivered[sig]) return;
      delivered[sig] = 1;
      var r = origAddSMS(e);
      store.log.push({ k: "s", m: e }); persist();
      if (cloudPush) cloudPush();
      return r;
    };

    // Restaura as mensagens já entregues, na ordem original, sem notificação/toast.
    if (store.log.length) {
      var origToast = window.toast;
      try {
        window.toast = function () {};
        for (var j = 0; j < store.log.length; j++) {
          var m = store.log[j];
          if (m.k === "e") origAddEmail(m.m); else origAddSMS(m.m);
        }
      } catch (e) {}
      window.toast = origToast;
      try { if (typeof window.renderPhone === "function") window.renderPhone(); } catch (e) {}
    }
  }

  function ga() {
    var g = window.gtag;
    if (typeof g === "function") { try { g.apply(null, arguments); } catch (e) {} }
  }
  function readLocal() {
    try { return JSON.parse(localStorage.getItem(SAVE_KEY) || "null"); } catch (e) { return null; }
  }
  // Lê o apelido da sessão de forma síncrona (sem esperar o Supabase carregar).
  function nickSync() {
    try {
      var o = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      var u = o && (o.user || (o.currentSession && o.currentSession.user));
      return (u && u.user_metadata && u.user_metadata.username) || null;
    } catch (e) { return null; }
  }

  // Troca o handle "ghost_zero" exibido pelo apelido do jogador (só o texto na tela).
  // Pega conteúdo já renderizado e o que aparece dinamicamente (terminal, e-mails, feed).
  function personalizeHandle(nick) {
    var TARGET = "ghost_zero";
    if (window.__hlPersonalized) return;
    if (!nick || nick === TARGET || nick.indexOf(TARGET) !== -1) return; // evita loop
    window.__hlPersonalized = true;

    function fixText(node) {
      if (node.nodeValue && node.nodeValue.indexOf(TARGET) !== -1) {
        node.nodeValue = node.nodeValue.split(TARGET).join(nick);
      }
    }
    function walk(node) {
      if (node.nodeType === 3) { fixText(node); return; }
      if (node.nodeType !== 1) return;
      var t = node.tagName;
      if (t === "SCRIPT" || t === "STYLE" || t === "INPUT" || t === "TEXTAREA") return;
      if (node.id === "hl-cloud-badge") return;
      for (var i = 0; i < node.childNodes.length; i++) walk(node.childNodes[i]);
    }

    walk(document.body); // varredura inicial
    try {
      var obs = new MutationObserver(function (muts) {
        for (var i = 0; i < muts.length; i++) {
          var m = muts[i];
          if (m.type === "characterData") fixText(m.target);
          else if (m.addedNodes) for (var j = 0; j < m.addedNodes.length; j++) walk(m.addedNodes[j]);
        }
      });
      obs.observe(document.body, { subtree: true, childList: true, characterData: true });
    } catch (e) {}
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
    // Personaliza o handle "ghost_zero" com o apelido do jogador logado (imediato).
    var earlyNick = nickSync();
    if (earlyNick) personalizeHandle(earlyNick);

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

    // PULL — reconcilia progresso E mensagens com a nuvem uma vez por carregamento.
    if (!sessionStorage.getItem(SYNC_FLAG)) {
      try {
        var res = await sb.from("game_saves").select("data, messages").eq("user_id", uid).maybeSingle();
        var server = res.data && res.data.data;
        var serverMsgs = (res.data && res.data.messages) || null;
        var local = readLocal();
        var sServer = (server && server.savedAt) || 0;
        var sLocal = (local && local.savedAt) || 0;

        var progressNewer = server && (!local || sServer > sLocal);

        // Mescla as mensagens: se a nuvem trouxe alguma que falta no local, atualiza.
        var localStore = loadMsgStore();
        var mergedLog = mergeLogs(serverMsgs && serverMsgs.log, localStore.log);
        var msgsChanged = mergedLog.length !== localStore.log.length;

        if (progressNewer || msgsChanged) {
          if (progressNewer) localStorage.setItem(SAVE_KEY, JSON.stringify(server));
          if (msgsChanged) localStorage.setItem(MSG_KEY, JSON.stringify({ log: mergedLog }));
          sessionStorage.setItem(SYNC_FLAG, "1");
          location.reload();
          return;
        }
      } catch (e) {}
      sessionStorage.setItem(SYNC_FLAG, "1");
    }

    // PUSH — espelha save + mensagens na nuvem (debounce).
    var timer = null;
    function cloudSave() {
      var data = readLocal();
      if (!data) return;
      sb.from("game_saves")
        .upsert({ user_id: uid, username: username, data: data, messages: loadMsgStore(), level: data.level || 1, updated_at: new Date().toISOString() })
        .then(function () {});
    }
    cloudPush = function () { clearTimeout(timer); timer = setTimeout(cloudSave, 2500); };
    wrapSaveGame(cloudPush);

    // RESET — apaga também o save da nuvem (um confirm só).
    window.resetGame = async function () {
      if (!confirm("Tem certeza? Todo o progresso será perdido.")) return;
      try { await sb.from("game_saves").delete().eq("user_id", uid); } catch (e) {}
      try { localStorage.removeItem(SAVE_KEY); } catch (e) {}
      try { localStorage.removeItem(MSG_KEY); } catch (e) {}
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
        '<a href="/ranking" target="_blank" rel="noopener" style="color:#484f58;text-decoration:none">ranking ↗</a>' +
        '<a href="#" id="hl-logout" style="color:#484f58;text-decoration:none">sair</a>';
      el.querySelector("#hl-logout").addEventListener("click", async function (ev) {
        ev.preventDefault();
        try {
          var cfg = await fetch("/api/config").then(function (r) { return r.json(); });
          var sb = window.supabase.createClient(cfg.url, cfg.anonKey, { auth: { storageKey: STORAGE_KEY } });
          await sb.auth.signOut();
        } catch (e) {}
        try { sessionStorage.removeItem(SYNC_FLAG); } catch (e) {}
        try { localStorage.removeItem(MSG_KEY); } catch (e) {}
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

  // Persistência de mensagens: síncrona e imediata, antes do initGame (onboarding).
  setupMessagePersistence();

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", main);
  else main();
})();
