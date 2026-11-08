/*
 * Feestmissie spelmotor.
 *
 * Elke missie roept Missie.start(config) aan. De motor tekent de spelpagina
 * (timer, codeslot, hints, verstopplekken, diploma) en de pagina voor ouders
 * (instellingen, voorbereiding, antwoorden, puzzelvellen om te printen).
 * Een missie levert alleen het verhaal, de codes en de puzzelvellen.
 */
(function () {
  "use strict";

  // ------------------------------------------------------------------ helpers
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]; }); }
  function load(key, fallback) {
    try { var v = localStorage.getItem(key); return v ? Object.assign({}, fallback, JSON.parse(v)) : Object.assign({}, fallback); }
    catch (e) { return Object.assign({}, fallback); }
  }
  function save(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* storage unavailable */ } }
  function fmt(sec) { var s = Math.abs(sec); return (sec < 0 ? "+" : "") + Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); }

  // ------------------------------------------------------------------ printable sheet helpers (SVG in millimetres, A4)
  var S = {
    INK: "#1f1b45", SOFT: "#6b6799", RED: "#d43b4a",
    F_DISPLAY: "Luckiest Guy, Arial Black, Impact, sans-serif",
    F_BODY: "Nunito, Trebuchet MS, sans-serif",
    F_TYPE: "Special Elite, Courier New, monospace",
    esc: esc,
    txt: function (x, y, s, size, opts) {
      opts = opts || {};
      return '<text x="' + x + '" y="' + y + '" font-family="' + (opts.font || S.F_BODY) + '" font-size="' + size + '" fill="' + (opts.fill || S.INK) + '"' +
        (opts.anchor ? ' text-anchor="' + opts.anchor + '"' : "") + (opts.weight ? ' font-weight="' + opts.weight + '"' : "") +
        (opts.ls ? ' letter-spacing="' + opts.ls + '"' : "") + ">" + esc(s) + "</text>";
    },
    lines: function (x, y, arr, size, gap) { return arr.map(function (l, k) { return S.txt(x, y + k * gap, l, size); }).join(""); },
    // seeded random, so every print of a sheet looks the same
    rng: function (seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; },
    // style: { header, footer, stamp, accent, total }
    frame: function (style, n, title, intro, inner) {
      var accent = style.accent || S.RED;
      return '<svg class="sheet" viewBox="0 0 210 297" role="img" aria-label="Puzzelvel envelop ' + n + ": " + esc(title) + '" xmlns="http://www.w3.org/2000/svg">' +
        '<rect width="210" height="297" fill="#ffffff"/>' +
        '<rect x="8" y="8" width="194" height="281" rx="3" fill="none" stroke="' + S.INK + '" stroke-width="0.5" stroke-dasharray="2 1.5"/>' +
        S.txt(16, 21, style.header, 4.2, { font: S.F_TYPE, fill: S.SOFT, ls: 0.4 }) +
        '<circle cx="186" cy="24" r="10" fill="' + accent + '"/>' + S.txt(186, 27.6, String(n), 10, { font: S.F_DISPLAY, fill: "#fff", anchor: "middle" }) +
        '<g transform="rotate(-9 150 22)"><rect x="133" y="15" width="34" height="11" rx="1.5" fill="none" stroke="' + accent + '" stroke-width="0.8"/>' +
        S.txt(150, 23, style.stamp || "GEHEIM", 5.4, { font: S.F_TYPE, fill: accent, anchor: "middle", ls: 0.6 }) + "</g>" +
        S.txt(16, 38, title.toUpperCase(), 9.5, { font: S.F_DISPLAY }) +
        S.lines(16, 47, intro, 4.4, 5.8) +
        inner +
        S.txt(105, 283, style.footer + " · envelop " + n + " van " + (style.total || 4), 3.6, { font: S.F_TYPE, fill: S.SOFT, anchor: "middle" }) +
        "</svg>";
    }
  };

  // ------------------------------------------------------------------ the game
  function start(M) {
    var N = M.steps.length;
    var FRESH_GAME = { phase: "intro", step: 0, startedAt: 0, hints: [], finishedAt: 0, timeUpSeen: false };
    function fresh(extra) { return Object.assign({}, FRESH_GAME, { hints: M.steps.map(function () { return 0; }) }, extra || {}); }

    var setupKey = M.key + "-setup", gameKey = M.key + "-game";
    var setup = load(setupKey, M.defaults);
    var game = load(gameKey, fresh());
    game.hints = M.steps.map(function (_, i) { return (game.hints && game.hints[i]) || 0; });

    function persist() { save(gameKey, game); }
    // place where the envelope after step i is hidden
    function placeFor(i) { return setup[M.fields[i].key] || ""; }

    // sound and wake lock
    var audio = null;
    function beep(good) {
      try {
        audio = audio || new (window.AudioContext || window.webkitAudioContext)();
        var notes = good ? [660, 880, 1320] : [220, 180];
        notes.forEach(function (f, i) {
          var o = audio.createOscillator(), g = audio.createGain();
          o.type = good ? "triangle" : "square"; o.frequency.value = f;
          g.gain.setValueAtTime(0.0001, audio.currentTime + i * 0.11);
          g.gain.exponentialRampToValueAtTime(0.18, audio.currentTime + i * 0.11 + 0.02);
          g.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + i * 0.11 + 0.18);
          o.connect(g).connect(audio.destination); o.start(audio.currentTime + i * 0.11); o.stop(audio.currentTime + i * 0.11 + 0.2);
        });
      } catch (e) { /* no audio */ }
    }
    function keepAwake() {
      try { if (navigator.wakeLock && document.visibilityState === "visible") navigator.wakeLock.request("screen").catch(function () {}); } catch (e) { /* not allowed */ }
    }
    document.addEventListener("visibilitychange", function () { if (game.phase === "play" || game.phase === "found") keepAwake(); });

    // timer
    function elapsed() { return game.startedAt ? Math.floor(((game.finishedAt || Date.now()) - game.startedAt) / 1000) : 0; }
    function tick() {
      var el = document.getElementById("timer");
      if (!el || !game.startedAt) return;
      var left = setup.minutes * 60 - elapsed();
      el.textContent = fmt(left);
      el.classList.toggle("low", left < 5 * 60);
      if (left <= 0 && !game.timeUpSeen && game.phase !== "done") {
        game.timeUpSeen = true; persist();
        showOverlay(
          '<div class="card pop"><p class="eyebrow">Tijd is om</p><h2 class="title-l">' + esc(M.timeUp.title) + "</h2>" +
          "<p>" + esc(M.timeUp.text) + " Jullie mogen doorspelen, de klok telt nu de extra tijd.</p>" +
          '<button class="btn" type="button" id="ov-ok">Doorspelen</button></div>');
      }
    }
    setInterval(tick, 1000);

    function showOverlay(html) {
      var ov = document.getElementById("overlay");
      ov.innerHTML = html; ov.hidden = false;
      var b = ov.querySelector("button"); if (b) { b.focus(); b.addEventListener("click", function () { ov.hidden = true; }); }
    }

    var play = document.getElementById("view-play");

    function statusBar() {
      var pips = M.steps.map(function (s, i) {
        var cls = i < game.step || game.phase === "done" ? "pip done" : (i === game.step ? "pip now" : "pip");
        return '<span class="' + cls + '" aria-label="Envelop ' + (i + 1) + (cls === "pip done" ? ", opgelost" : "") + '">' + (i + 1) + "</span>";
      }).join("");
      return '<div class="card status"><div><div class="timer-label">Tijd over</div><div class="timer" id="timer" role="timer">' +
        fmt(setup.minutes * 60 - elapsed()) + '</div></div><div class="pips" aria-label="Enveloppen">' + pips + "</div></div>";
    }

    function renderIntro() {
      play.innerHTML =
        '<div class="card">' +
        '<span class="stamp">' + esc(M.intro.stamp) + "</span>" +
        '<p class="eyebrow">' + esc(M.intro.eyebrow) + "</p>" +
        '<h1 class="title-xl">' + M.intro.title + "</h1>" +
        M.intro.body(setup, esc) +
        '<p class="small">' + esc(M.intro.needs) + "</p>" +
        '<button class="btn" type="button" id="start">Start de missie</button>' +
        "</div>";
      document.getElementById("start").addEventListener("click", function () {
        game = fresh({ phase: "play", startedAt: Date.now() });
        persist(); beep(true); keepAwake(); render();
      });
    }

    function renderStep() {
      var i = game.step, s = M.steps[i], answer = M.answers[i], len = answer.length;
      var boxes = "";
      for (var k = 0; k < len; k++) boxes += '<span class="box" data-k="' + k + '"></span>';
      var used = game.hints[i];
      var hintHtml = "";
      for (var h = 0; h < used; h++) hintHtml += '<p class="hint">Hint ' + (h + 1) + ": " + esc(s.hints[h]) + "</p>";
      play.innerHTML = statusBar() +
        '<div class="card pop">' +
        '<p class="eyebrow">Envelop ' + (i + 1) + " van " + N + "</p>" +
        '<h2 class="title-l">' + esc(s.title) + "</h2>" +
        "<p>" + esc(s.text) + "</p>" +
        '<form class="lock" id="lock" autocomplete="off">' +
        '<label class="lock-label" for="code">Vul de code in (' + len + (s.mode === "text" ? " letters" : " cijfers") + ")</label>" +
        '<div class="boxes" id="boxes">' + boxes +
        '<input id="code" name="code" maxlength="' + len + '" inputmode="' + (s.mode === "text" ? "text" : "numeric") + '" autocapitalize="characters" spellcheck="false" aria-describedby="fb"></div>' +
        '<p class="feedback" id="fb" aria-live="assertive"></p>' +
        '<button class="btn" type="submit">Open het slot</button>' +
        "</form>" +
        '<div class="hints">' + hintHtml +
        '<div class="hint-row">' +
        (used < s.hints.length ? '<button class="hint-btn" type="button" id="hint">Geef ons hint ' + (used + 1) + "</button>" : "") +
        '<span class="small">' + (used ? used + " van " + s.hints.length + " hints gebruikt" : "Vast? Er zijn " + s.hints.length + " hints.") + "</span>" +
        "</div></div></div>";

      var input = document.getElementById("code"), wrap = document.getElementById("boxes");
      function paint() {
        var v = input.value.toUpperCase();
        wrap.querySelectorAll(".box").forEach(function (b, k) { b.textContent = v[k] || ""; b.classList.toggle("cur", k === Math.min(v.length, len - 1)); });
      }
      input.addEventListener("input", function () {
        input.value = input.value.toUpperCase().replace(s.mode === "text" ? /[^A-Z]/g : /[^0-9]/g, "").slice(0, len);
        wrap.classList.remove("bad"); document.getElementById("fb").textContent = ""; paint();
      });
      input.addEventListener("focus", function () { wrap.classList.add("focus"); paint(); });
      input.addEventListener("blur", function () { wrap.classList.remove("focus"); });
      wrap.addEventListener("click", function () { input.focus(); });
      document.getElementById("lock").addEventListener("submit", function (e) {
        e.preventDefault();
        var fb = document.getElementById("fb");
        if (input.value.length < len) { fb.className = "feedback bad"; fb.textContent = "De code heeft " + len + (s.mode === "text" ? " letters." : " cijfers."); return; }
        if (input.value === answer) {
          wrap.classList.add("good"); fb.className = "feedback good"; fb.textContent = "Klik! Het slot gaat open."; beep(true);
          setTimeout(function () {
            if (i === N - 1) { game.phase = "done"; game.finishedAt = Date.now(); }
            else { game.phase = "found"; }
            persist(); render();
          }, 650);
        } else {
          wrap.classList.remove("bad"); void wrap.offsetWidth; wrap.classList.add("bad");
          fb.className = "feedback bad"; fb.textContent = "Nog niet goed. Kijk nog eens goed naar het raadsel."; beep(false);
        }
      });
      var hb = document.getElementById("hint");
      if (hb) hb.addEventListener("click", function () { game.hints[i] = Math.min(s.hints.length, game.hints[i] + 1); persist(); renderStep(); });
      paint();
    }

    function renderFound() {
      var i = game.step, next = i + 2;
      play.innerHTML = statusBar() +
        '<div class="card pop">' +
        '<p class="eyebrow">Slot ' + (i + 1) + " is open</p>" +
        '<p class="found">' + esc(M.found) + "</p>" +
        (M.steps[i].solved ? '<p>' + esc(M.steps[i].solved) + "</p>" : "") +
        '<p class="lead">Envelop ' + next + ' ligt <strong class="place">' + esc(placeFor(i)) + "</strong>.</p>" +
        '<p class="small">Ga hem halen. Pas als jullie hem hebben, mag je op de knop drukken.</p>' +
        '<button class="btn" type="button" id="next">We hebben envelop ' + next + "</button>" +
        "</div>";
      document.getElementById("next").addEventListener("click", function () { game.step = i + 1; game.phase = "play"; persist(); render(); });
    }

    function renderDone() {
      var used = game.hints.reduce(function (a, b) { return a + b; }, 0);
      var date = new Date(game.finishedAt || Date.now()).toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" });
      var d = M.done, dip = M.diploma;
      play.innerHTML = statusBar() +
        '<div class="card pop" style="text-align:center;align-items:center">' +
        '<p class="eyebrow">Slot ' + N + " is open</p>" +
        '<h2 class="title-xl">' + esc(d.title) + "</h2>" +
        '<p class="lead">' + d.lead(setup, esc) + "</p>" +
        '<p class="small">' + esc(d.small) + "</p>" +
        "</div>" +
        '<div class="diploma pop" role="img" aria-label="Diploma ' + esc(dip.title) + '">' +
        '<p class="d-eyebrow">' + esc(dip.eyebrow) + "</p>" +
        '<p class="d-title">' + esc(dip.title) + "</p>" +
        "<p>" + dip.line(setup, esc) + "</p>" +
        '<div class="d-stats"><span>Tijd: ' + fmt(elapsed()) + "</span><span>Hints: " + used + "</span><span>" + esc(date) + "</span></div>" +
        '<div class="seal">' + dip.seal + "</div>" +
        "</div>" +
        '<button class="btn secondary" type="button" id="again">Nog een keer spelen</button>';
      document.getElementById("again").addEventListener("click", function () { game = fresh(); persist(); render(); });
    }

    // parent guide
    var parent = document.getElementById("view-parent");
    function field(f) {
      var id = "setup-" + f.key;
      return '<div class="field"><label for="' + id + '">' + esc(f.label) + '</label><input id="' + id + '" name="' + f.key + '" type="text" value="' + esc(setup[f.key]) + '"' + (f.ph ? ' placeholder="' + esc(f.ph) + '"' : "") + "></div>";
    }
    function renderParent() {
      var P = M.parent;
      var finalField = M.fields[M.fields.length - 1];
      parent.innerHTML =
        '<div class="guide-head">' +
        '<p class="eyebrow">Voor de spelleider</p>' +
        '<h1 class="title-l">' + esc(P.title) + "</h1>" +
        "<p>" + esc(P.intro) + "</p>" +
        '<div class="facts">' + P.facts.map(function (f) { return '<span class="fact">' + esc(f) + "</span>"; }).join("") + "</div>" +
        "</div>" +
        '<div class="cols">' +
        '<div class="card"><h2 class="title-l" style="font-size:26px">' + esc(P.formTitle) + "</h2>" +
        '<form class="form" id="setup">' +
        field({ key: "name", label: P.nameLabel }) +
        '<div class="field"><label for="setup-minutes">Speeltijd</label><select id="setup-minutes" name="minutes">' +
        [30, 45, 60].map(function (m) { return '<option value="' + m + '"' + (Number(setup.minutes) === m ? " selected" : "") + ">" + m + " minuten</option>"; }).join("") +
        "</select></div>" +
        M.fields.map(field).join("") +
        '<p class="saved" id="saved"></p>' +
        "</form></div>" +
        '<div class="card"><h2 class="title-l" style="font-size:26px">Voorbereiden</h2>' +
        '<ol class="steps">' +
        P.prep.map(function (li) { return "<li><span>" + li + "</span></li>"; }).join("") +
        '<li><span>Verstop envelop 2 tot en met ' + N + ' op de plekken die je hebt ingevuld. ' + esc(P.finalPrep) + ' <strong id="final-echo">' + esc(setup[finalField.key]) + "</strong>.</span></li>" +
        "<li><span>" + esc(P.lastPrep) + "</span></li>" +
        "</ol>" +
        '<p class="small">' + esc(P.tip) + "</p>" +
        '<button class="btn secondary" type="button" id="reset">Spel opnieuw beginnen</button>' +
        "</div></div>" +
        '<details><summary>Antwoorden en uitleg</summary><div class="answers">' +
        M.steps.map(function (s, i) {
          return '<div class="answer"><span><strong>Envelop ' + (i + 1) + "</strong><br><code>" + esc(M.answers[i]) + "</code></span><span>" + esc(s.why) + "</span></div>";
        }).join("") +
        "</div></details>" +
        '<div class="sheets-section" style="display:flex;flex-direction:column;gap:14px">' +
        '<h2 class="title-l" style="font-size:26px">De puzzelvellen</h2>' +
        '<p class="note-box">Print de ' + N + ' vellen op A4. Elk vel komt op een eigen pagina. Dit is de proefversie: in de gekochte download krijg je ze ook als PDF.</p>' +
        '<button class="btn" type="button" id="print" style="align-self:flex-start">Print de puzzelvellen</button>' +
        '<div class="sheets">' +
        M.sheets(S).map(function (sh) { return '<div class="sheet-wrap"><p class="sheet-cap">' + esc(sh[0]) + "</p>" + sh[1] + "</div>"; }).join("") +
        "</div></div>";

      var form = document.getElementById("setup"), saved = document.getElementById("saved"), t = 0;
      form.addEventListener("input", function (e) {
        var el = e.target; if (!el.name) return;
        setup[el.name] = el.name === "minutes" ? Number(el.value) : (el.value.trim() || M.defaults[el.name]);
        save(setupKey, setup);
        document.getElementById("final-echo").textContent = setup[finalField.key];
        saved.textContent = "Opgeslagen op dit apparaat"; clearTimeout(t); t = setTimeout(function () { saved.textContent = ""; }, 1800);
      });
      form.addEventListener("submit", function (e) { e.preventDefault(); });
      document.getElementById("print").addEventListener("click", function () { window.print(); });
      document.getElementById("reset").addEventListener("click", function () {
        game = fresh(); persist();
        this.textContent = "Klaar: het spel staat weer op de start";
      });
    }

    // routing
    function render() {
      var parentView = location.hash === "#ouders";
      document.getElementById("view-play").hidden = parentView;
      document.getElementById("view-parent").hidden = !parentView;
      document.getElementById("tab-play").setAttribute("aria-current", parentView ? "false" : "page");
      document.getElementById("tab-parent").setAttribute("aria-current", parentView ? "page" : "false");
      if (parentView) { renderParent(); return; }
      if (game.phase === "play") renderStep();
      else if (game.phase === "found") renderFound();
      else if (game.phase === "done") renderDone();
      else renderIntro();
    }
    window.addEventListener("hashchange", render);
    render(); tick();
  }

  window.Missie = { start: start, svg: S };
})();
