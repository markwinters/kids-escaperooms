/* De Verdwenen Mijter: Sinterklaas, 5 tot 9 jaar. Draait op de spelmotor in ../assets/missie.js. */
(function () {
  "use strict";
  var S = Missie.svg, txt = S.txt, lines = S.lines;
  var INK = S.INK, SOFT = S.SOFT, F_DISPLAY = S.F_DISPLAY, F_TYPE = S.F_TYPE;
  var RED = "#c8102e", GOLD = "#f5c542", CREAM = "#fff7e0", TAN = "#f1dcb8";
  var STYLE = { header: "SINTERKLAAS · GEHEIME OPDRACHT", footer: "De Verdwenen Mijter", accent: RED };
  function frame(n, title, intro, inner) { return S.frame(STYLE, n, title, intro, inner); }
  function codeBoxes(x, y, n, label) {
    var o = '<rect x="16" y="' + (y - 10) + '" width="178" height="' + 30 + '" rx="3" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="0.5"/>' +
      txt(22, y, label, 4.6, { weight: 800 });
    for (var b = 0; b < n; b++) o += '<rect x="' + (x + b * 15) + '" y="' + (y + 4) + '" width="12" height="13" rx="1.5" fill="#fff" stroke="' + INK + '" stroke-width="0.5"/>';
    return o;
  }

  // ------------------------------------------------------------------ small drawings (centred on 0,0, about 24 units wide)
  function star(r, fill) {
    var pts = [];
    for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; pts.push((Math.cos(a) * rr).toFixed(2) + "," + (Math.sin(a) * rr).toFixed(2)); }
    return '<polygon points="' + pts.join(" ") + '" fill="' + fill + '"/>';
  }
  function moon(r, fill) {
    return '<path d="M' + (r * 0.3) + " " + (-r * 0.95) + " A" + r + " " + r + " 0 1 0 " + (r * 0.3) + " " + (r * 0.95) +
      " A" + (r * 0.78) + " " + (r * 0.78) + " 0 1 1 " + (r * 0.3) + " " + (-r * 0.95) + 'Z" fill="' + fill + '"/>';
  }
  function pepernoot(r) {
    return '<circle r="' + r + '" fill="' + TAN + '"/><circle cx="' + (-r * 0.35) + '" cy="' + (-r * 0.25) + '" r="' + (r * 0.12) + '" fill="' + INK + '" stroke="none"/>' +
      '<circle cx="' + (r * 0.3) + '" cy="' + (-r * 0.05) + '" r="' + (r * 0.12) + '" fill="' + INK + '" stroke="none"/><circle cx="' + (-r * 0.05) + '" cy="' + (r * 0.38) + '" r="' + (r * 0.12) + '" fill="' + INK + '" stroke="none"/>';
  }
  var PICS = {
    schoen: '<path d="M-12 6 V-4 Q-12 -8 -8 -8 H-4 L-2 -2 Q5 -1 10 1 Q13 2.5 13 6 Z" fill="#ffd9a8"/><path d="M-12 7 H13" stroke-width="2.4" stroke-linecap="round"/><path d="M-6 -6 L-3 -6 M-5.5 -3.5 L-2.5 -3.5" />',
    stal: '<path d="M-11 11 V-2 L0 -11 L11 -2 V11 Z" fill="#f4a3a3"/><rect x="-5" y="1" width="10" height="10" fill="#fff"/><path d="M-5 1 L5 11 M5 1 L-5 11"/>',
    muis: '<path d="M9 4 Q15 3 13 -4" fill="none"/><ellipse cx="0" cy="4" rx="9.5" ry="6" fill="#d9d9e3"/><circle cx="-5" cy="-2.5" r="3.6" fill="#d9d9e3"/><circle cx="-7" cy="3" r="0.9" fill="' + INK + '" stroke="none"/><circle cx="-9.6" cy="4.6" r="1.1" fill="#f4a3a3"/>',
    ster: star(12, GOLD),
    kat: '<path d="M-9 -2 L-8 -12 L-2 -7 Z M9 -2 L8 -12 L2 -7 Z" fill="#ffc98a"/><circle cx="0" cy="2" r="9.5" fill="#ffc98a"/><circle cx="-3.4" cy="0" r="1.1" fill="' + INK + '" stroke="none"/><circle cx="3.4" cy="0" r="1.1" fill="' + INK + '" stroke="none"/><path d="M-1.4 3.4 H1.4 L0 5 Z" fill="' + INK + '"/><path d="M-3 4.4 L-12 3 M-3 5.6 L-12 7 M3 4.4 L12 3 M3 5.6 L12 7" stroke-width="0.4"/>',
    maan: moon(12, "#fff1a8"),
    boom: '<rect x="-2" y="4" width="4" height="9" fill="#b98455"/><circle cx="0" cy="-3" r="9" fill="#9be0a8"/><circle cx="-6" cy="2" r="5" fill="#9be0a8"/><circle cx="6" cy="2" r="5" fill="#9be0a8"/>',
    vis: '<path d="M6 0 L13 -6 V6 Z" fill="#9cc3ff"/><ellipse cx="-2" cy="0" rx="10" ry="6" fill="#9cc3ff"/><circle cx="-7" cy="-1.5" r="1.1" fill="' + INK + '" stroke="none"/><path d="M-1 -4 Q2 0 -1 4" fill="none"/>'
  };
  function pic(name, x, y, scale) {
    return '<g transform="translate(' + x + " " + y + ") scale(" + (scale || 1) + ')" stroke="' + INK + '" stroke-width="0.7" stroke-linejoin="round" stroke-linecap="round">' + PICS[name] + "</g>";
  }

  // ------------------------------------------------------------------ envelope 1: the pepernoten maze
  // A perfect maze (exactly one route), seeded so every print is the same. The digits 5, 2, 8 lie on the route,
  // the decoys 3, 7, 1 lie in dead ends.
  var MAZE = (function () {
    var W = 9, H = 9, rand = S.rng(5122026), open = [];
    for (var i = 0; i < W * H; i++) open.push({ n: false, e: false, s: false, w: false });
    var seen = [], stack = [0]; seen[0] = true;
    while (stack.length) {
      var c = stack[stack.length - 1], cx = c % W, cy = Math.floor(c / W), nb = [];
      if (cy > 0 && !seen[c - W]) nb.push(["n", c - W, "s"]);
      if (cx < W - 1 && !seen[c + 1]) nb.push(["e", c + 1, "w"]);
      if (cy < H - 1 && !seen[c + W]) nb.push(["s", c + W, "n"]);
      if (cx > 0 && !seen[c - 1]) nb.push(["w", c - 1, "e"]);
      if (!nb.length) { stack.pop(); continue; }
      var pick = nb[Math.floor(rand() * nb.length)];
      open[c][pick[0]] = true; open[pick[1]][pick[2]] = true; seen[pick[1]] = true; stack.push(pick[1]);
    }
    // route from the chair (top left) to the window (bottom right)
    var prev = [], queue = [0], end = W * H - 1; prev[0] = -1;
    while (queue.length) {
      var q = queue.shift(), qx = q % W;
      [["n", q - W], ["e", q + 1], ["s", q + W], ["w", q - 1]].forEach(function (d) {
        if (open[q][d[0]] && prev[d[1]] === undefined) { prev[d[1]] = q; queue.push(d[1]); }
      });
      void qx;
    }
    var route = [];
    for (var p = end; p !== -1; p = prev[p]) route.unshift(p);
    var onRoute = {}; route.forEach(function (r) { onRoute[r] = true; });
    var digits = {};
    [[0.28, "5"], [0.55, "2"], [0.8, "8"]].forEach(function (d) { digits[route[Math.floor(route.length * d[0])]] = d[1]; });
    var deadEnds = [];
    open.forEach(function (o, k) {
      var deg = (o.n ? 1 : 0) + (o.e ? 1 : 0) + (o.s ? 1 : 0) + (o.w ? 1 : 0);
      if (deg === 1 && !onRoute[k] && k !== 0 && k !== end) deadEnds.push(k);
    });
    // spread decoys: take dead ends far apart from each other
    var decoys = [];
    deadEnds.sort(function (a, b) { return (a * 7919) % 97 - (b * 7919) % 97; });
    deadEnds.forEach(function (k) {
      if (decoys.length < 3 && decoys.every(function (d) { return Math.abs(d % W - k % W) + Math.abs(Math.floor(d / W) - Math.floor(k / W)) > 3; })) decoys.push(k);
    });
    ["3", "7", "1"].forEach(function (d, k) { if (decoys[k] !== undefined) digits[decoys[k]] = d; });
    return { W: W, H: H, open: open, route: route, digits: digits, decoys: decoys, rand: rand };
  })();

  function sheet1() {
    var cs = 17, x0 = 28.5, y0 = 72, W = MAZE.W, H = MAZE.H, walls = "", inner = "";
    inner += '<rect x="' + x0 + '" y="' + y0 + '" width="' + (W * cs) + '" height="' + (H * cs) + '" fill="#fffaf0"/>';
    for (var c = 0; c < W * H; c++) {
      var cx = x0 + (c % W) * cs, cy = y0 + Math.floor(c / W) * cs, o = MAZE.open[c];
      if (!o.n && c !== 0) walls += "M" + cx + " " + cy + " H" + (cx + cs);
      if (!o.w) walls += "M" + cx + " " + cy + " V" + (cy + cs);
      if (c % W === W - 1) walls += "M" + (cx + cs) + " " + cy + " V" + (cy + cs);
      if (Math.floor(c / W) === H - 1 && c !== W * H - 1) walls += "M" + cx + " " + (cy + cs) + " H" + (cx + cs);
    }
    // a few loose pepernoten as decoration, never on a digit
    var rand = S.rng(77), deco = 0, guard = 0;
    while (deco < 9 && guard++ < 200) {
      var k = Math.floor(rand() * W * H);
      if (MAZE.digits[k] || k === 0 || k === W * H - 1) continue;
      inner += '<g transform="translate(' + (x0 + (k % W) * cs + cs / 2) + " " + (y0 + Math.floor(k / W) * cs + cs / 2) + ')" stroke="' + INK + '" stroke-width="0.4">' + pepernoot(2.6) + "</g>";
      deco++;
    }
    Object.keys(MAZE.digits).forEach(function (k) {
      k = Number(k);
      inner += txt(x0 + (k % W) * cs + cs / 2, y0 + Math.floor(k / W) * cs + cs / 2 + 3.6, MAZE.digits[k], 10, { font: F_DISPLAY, fill: RED, anchor: "middle" });
    });
    inner += '<path d="' + walls + '" fill="none" stroke="' + INK + '" stroke-width="1.6" stroke-linecap="square"/>';
    // start: the chair of the Sint; finish: the open window
    inner += txt(x0 + cs / 2, y0 - 4, "START: STOEL VAN DE SINT", 4.2, { font: F_TYPE, fill: INK }) +
      '<path d="M' + (x0 + cs / 2) + " " + (y0 - 2) + " V" + (y0 + 5) + '" stroke="' + RED + '" stroke-width="1" marker-end="none"/>' +
      '<path d="M' + (x0 + cs / 2 - 2) + " " + (y0 + 3) + " L" + (x0 + cs / 2) + " " + (y0 + 6) + " L" + (x0 + cs / 2 + 2) + " " + (y0 + 3) + '" fill="none" stroke="' + RED + '" stroke-width="1"/>';
    var ex = x0 + (W - 1) * cs + cs / 2, ey = y0 + H * cs;
    inner += '<path d="M' + (ex - 2) + " " + (ey + 1) + " L" + ex + " " + (ey + 4) + " L" + (ex + 2) + " " + (ey + 1) + " M" + ex + " " + (ey - 4) + " V" + (ey + 4) + '" fill="none" stroke="' + RED + '" stroke-width="1"/>' +
      txt(ex + 3, ey + 8.5, "OPEN RAAM", 4.2, { font: F_TYPE, anchor: "end" });
    inner += codeBoxes(84, 252, 3, "Deze cijfers kwam ik tegen:");
    return frame(1, "Het pepernotenspoor", ["De dief liet een spoor van pepernoten achter. Zoek de weg van de stoel", "naar het raam. Schrijf de cijfers op die je onderweg tegenkomt."], inner);
  }

  // ------------------------------------------------------------------ envelope 2: colour the pepernoten
  var FONT = {
    "6": ["###", "#..", "###", "#.#", "###"],
    "3": ["###", "..#", "###", "..#", "###"],
    "1": [".#.", "##.", ".#.", ".#.", "###"]
  };
  function sheet2() {
    var code = "631", cols = 13, rows = 7, cs = 13, x0 = 20.5, y0 = 66, inner = "", rand = S.rng(6312026);
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var on = false;
        if (r >= 1 && r <= 5) {
          var gx = c - 1, digit = Math.floor(gx / 4), dx = gx % 4;
          if (gx >= 0 && digit < 3 && dx < 3) on = FONT[code[digit]][r - 1][dx] === "#";
        }
        var x = x0 + c * cs, y = y0 + r * cs;
        inner += '<rect x="' + x + '" y="' + y + '" width="' + cs + '" height="' + cs + '" fill="#fff" stroke="' + INK + '" stroke-width="0.4"/>';
        var sym = on ? pepernoot(4) : (rand() < 0.6 ? star(4.6, "#fff") : moon(4.4, "#fff"));
        inner += '<g transform="translate(' + (x + cs / 2) + " " + (y + cs / 2) + ") rotate(" + Math.floor(rand() * 40 - 20) + ')" stroke="' + INK + '" stroke-width="0.5">' + sym + "</g>";
      }
    }
    // legend
    inner += '<g transform="translate(26 171)" stroke="' + INK + '" stroke-width="0.5">' + pepernoot(4) + "</g>" + txt(33, 172.8, "Kleur dit hokje helemaal in", 4.6, { weight: 800 }) +
      '<g transform="translate(112 171)" stroke="' + INK + '" stroke-width="0.5">' + star(4.6, "#fff") + "</g>" +
      '<g transform="translate(123 171)" stroke="' + INK + '" stroke-width="0.5">' + moon(4.4, "#fff") + "</g>" + txt(130, 172.8, "Laat dit hokje wit", 4.6, { weight: 800 });
    // the feather found on the window sill
    inner += '<rect x="16" y="184" width="178" height="52" rx="3" fill="none" stroke="' + INK + '" stroke-width="0.5" stroke-dasharray="2 1.5"/>' +
      '<g transform="translate(44 210) rotate(35)" stroke="' + INK + '" stroke-width="0.6">' +
      '<path d="M0 22 C-8 8 -8 -14 0 -24 C8 -14 8 8 0 22 Z" fill="#fff"/>' +
      '<path d="M0 -24 C8 -14 8 -2 5 3 L-5 3 C-8 -2 -8 -14 0 -24 Z" fill="' + INK + '"/>' +
      '<path d="M0 -24 C4 -19 5 -15 5 -12 L-5 -12 C-5 -15 -4 -19 0 -24 Z" fill="#3b5bbf"/>' +
      '<path d="M0 -20 V28" fill="none"/></g>' +
      txt(70, 200, "GEVONDEN OP DE VENSTERBANK", 5.4, { font: F_DISPLAY, fill: RED }) +
      lines(70, 209, ["Naast de pepernoten lag deze veer.", "Hij is zwart en wit, met een blauw puntje.", "Van wie zou die zijn?"], 4.4, 6);
    inner += codeBoxes(84, 252, 3, "De code is:");
    return frame(2, "Kleur de pepernoten", ["Kleur alle hokjes met een pepernoot. Laat de sterren en maantjes wit.", "Dan zie je drie cijfers. Dat is de code."], inner);
  }

  // ------------------------------------------------------------------ envelope 3: the rhyme
  function sheet3() {
    var inner = '<rect x="16" y="62" width="178" height="80" rx="3" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="0.5"/>';
    var poem = [
      ["Wat moet de Sint toch zonder mijter doen?", "Hij zocht hem zelfs in zijn eigen ________ (1)"],
      ["Hij zocht bij zijn paard, hij zocht in de ________ (2)", "maar daar lag alleen wat hooi, en dat was al."],
      ["Toen zocht hij in de kelder van zijn huis,", "maar daar zat alleen een kleine grijze ________ (3)"],
      ["Hij keek uit het raam, heel hoog en heel ver,", "en zag iets glimmen, zo fel als een ________ (4)"]
    ];
    poem.forEach(function (p, k) { inner += lines(24, 72 + k * 17.5, p, 4.6, 6.4); });
    inner += txt(186, 139, "De Sint", 4.4, { font: F_TYPE, anchor: "end" });
    inner += txt(16, 154, "WELK PLAATJE RIJMT?", 7, { font: F_DISPLAY, fill: RED });
    var tiles = [["maan", "N"], ["schoen", "G"], ["vis", "E"], ["ster", "D"], ["stal", "O"], ["kat", "A"], ["muis", "U"], ["boom", "R"]];
    tiles.forEach(function (t, k) {
      var x = 16 + (k % 4) * 45, y = 160 + Math.floor(k / 4) * 42;
      inner += '<rect x="' + x + '" y="' + y + '" width="42" height="38" rx="3" fill="#fff" stroke="' + INK + '" stroke-width="0.5"/>' +
        pic(t[0], x + 18, y + 17, 0.95) +
        txt(x + 18, y + 34, t[0], 3.8, { anchor: "middle", fill: SOFT }) +
        '<circle cx="' + (x + 35.5) + '" cy="' + (y + 7) + '" r="4.4" fill="' + RED + '"/>' +
        txt(x + 35.5, y + 8.9, t[1], 5, { font: F_DISPLAY, fill: "#fff", anchor: "middle" });
    });
    inner += '<rect x="16" y="246" width="178" height="28" rx="3" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="0.5"/>' +
      txt(22, 256, "Schrijf de letter van elk goed plaatje op:", 4.6, { weight: 800 });
    for (var b = 0; b < 4; b++) {
      inner += '<rect x="' + (125 + b * 15) + '" y="252" width="12" height="13" rx="1.5" fill="#fff" stroke="' + INK + '" stroke-width="0.5"/>' +
        txt(125 + b * 15 + 6, 270, String(b + 1), 3.2, { fill: SOFT, anchor: "middle" });
    }
    return frame(3, "Het rijmpje van de Sint", ["De Sint schreef een gedicht, maar er missen woorden. Zoek bij elk gat", "het plaatje dat rijmt. De letters op de goede plaatjes zijn de code."], inner);
  }

  // ------------------------------------------------------------------ envelope 4: presents from low to high
  function present(x, top, w, h, digit, fill, ribbon) {
    var cx = x + w / 2, o = '<g stroke="' + INK + '" stroke-width="0.6">';
    o += '<rect x="' + (x - 2) + '" y="' + (top - 9) + '" width="' + (w + 4) + '" height="' + (h + 11) + '" fill="none" stroke="' + SOFT + '" stroke-width="0.4" stroke-dasharray="1.6 1.2"/>';
    o += '<rect x="' + x + '" y="' + top + '" width="' + w + '" height="' + h + '" fill="' + fill + '"/>';
    o += '<rect x="' + (cx - 2.2) + '" y="' + top + '" width="4.4" height="' + h + '" fill="' + ribbon + '"/>';
    o += '<path d="M' + cx + " " + top + " C" + (cx - 8) + " " + (top - 9) + " " + (cx - 9) + " " + (top - 1) + " " + cx + " " + top +
      " C" + (cx + 9) + " " + (top - 1) + " " + (cx + 8) + " " + (top - 9) + " " + cx + " " + top + 'Z" fill="' + ribbon + '"/>';
    o += '<circle cx="' + cx + '" cy="' + (top + h / 2) + '" r="5.6" fill="#fff"/>';
    o += "</g>" + txt(cx, top + h / 2 + 2.6, digit, 7.4, { font: F_DISPLAY, fill: RED, anchor: "middle" });
    return o;
  }
  function sheet4() {
    var inner = "";
    // heights: 4 = 26, 1 = 34, 7 = 43, 2 = 52 (the widest is the lowest, to make it tricky)
    inner += present(22, 75, 36, 43, "7", "#9cc3ff", GOLD);
    inner += present(74, 92, 58, 26, "4", "#9be0a8", RED);
    inner += present(150, 72, 28, 52, "2", "#ffd9a8", RED);
    inner += present(96, 140, 46, 34, "1", "#f4a3a3", GOLD);
    inner += '<g transform="translate(26 158)" fill="none" stroke="' + INK + '" stroke-width="0.6"><circle cx="0" cy="-2" r="1.8"/><circle cx="0" cy="2" r="1.8"/><path d="M1.5 -1 L8 2 M1.5 1 L8 -2"/></g>' +
      txt(38, 159.5, "Knip de pakjes uit", 4.2, { fill: SOFT }) + txt(38, 165.5, "langs de stippellijn.", 4.2, { fill: SOFT });
    inner += '<rect x="16" y="186" width="178" height="86" rx="3" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="0.5" stroke-dasharray="3 2"/>' +
      txt(105, 196, "Zet de pakjes hier op een rij: van laag naar hoog", 4.6, { anchor: "middle", weight: 800 }) +
      '<path d="M22 264 H188" stroke="#b98455" stroke-width="2.4" stroke-linecap="round"/>' +
      txt(24, 270.5, "laag", 3.8, { fill: SOFT }) + txt(186, 270.5, "hoog", 3.8, { fill: SOFT, anchor: "end" });
    return frame(4, "De pakjes van de ekster", ["De ekster stopte de mijter in een groot pakje met een cijferslot.", "Zet de pakjes van laag naar hoog. Lees de cijfers: dat is de code."], inner);
  }

  Missie.start({
    key: "mijter",
    // the colours of this mission page; see the :root block in ../assets/missie.css for every name
    kleuren: { night: "#2a0d18", card: "#3e1423", line: "#6b2639", cream: "#fff6e8", muted: "#eab9c3", red: "#ff6b74", yellow: "#f5c542", mint: "#8fe3b5", onYellow: "#2a0d18", glow: "rgba(245, 197, 66, 0.14)", diplomaRand: "#f3d27a", diplomaTitel: "#b3102a", zegel: "#b3102a" },
    answers: ["528", "631", "GOUD", "4172"],
    steps: [
      {
        title: "Het pepernotenspoor",
        text: "Open envelop 1. De dief liet een spoor van pepernoten achter. Zoek de weg van de stoel van de Sint naar het open raam. Schrijf de cijfers op die je onderweg tegenkomt.",
        mode: "numeric",
        hints: [
          "Ga met je vinger door de gangen. Je mag niet door een muur. Begin bij de stoel, linksboven.",
          "Het eerste cijfer is een 5. Staat een cijfer in een gang die doodloopt? Dan telt het niet mee."
        ],
        solved: "Het spoor gaat naar het open raam. Is de dief weggevlogen?",
        why: "De weg van de stoel naar het raam komt langs 5, 2 en 8. De 3, 7 en 1 staan in gangen die doodlopen."
      },
      {
        title: "Kleur de pepernoten",
        text: "Open envelop 2. Kleur alle hokjes met een pepernoot. Laat de sterren en de maantjes wit. Dan zie je drie cijfers.",
        mode: "numeric",
        hints: [
          "Een pepernoot is een rondje met drie stipjes. Een ster heeft punten en een maantje is krom.",
          "Het eerste cijfer is een 6. Kijk van links naar rechts."
        ],
        solved: "Op de vensterbank lag een zwart-witte veer. Wie houdt er zo van glimmende dingen?",
        why: "Als je de hokjes met een pepernoot inkleurt, zie je 6 3 1."
      },
      {
        title: "Het rijmpje van de Sint",
        text: "Open envelop 3. In het gedicht van de Sint missen vier woorden. Zoek bij elk gat het plaatje dat rijmt. De letters op de goede plaatjes zijn de code.",
        mode: "text",
        hints: [
          "Lees het gedicht hardop. Het woord dat mist, klinkt aan het eind hetzelfde als de andere regel. Doen rijmt op ...?",
          "Het eerste plaatje is de schoen, want schoen rijmt op doen. De code is iets dat heel erg glimt."
        ],
        solved: "GOUD! De dief is een ekster. Eksters houden van alles wat glimt, en de mijter glimt het allermooist.",
        why: "Schoen rijmt op doen (G), stal op al (O), muis op huis (U) en ster op ver (D). Samen: GOUD."
      },
      {
        title: "De pakjes van de ekster",
        text: "Open envelop 4. De ekster stopte de mijter in een groot pakje met een cijferslot. Knip de pakjes uit en zet ze op een rij, van laag naar hoog. Lees de cijfers.",
        mode: "numeric",
        hints: [
          "Zet de pakjes naast elkaar op tafel, met de onderkant op één lijn. Kijk alleen naar hoe hoog ze zijn, niet hoe breed.",
          "Het laagste pakje heeft een 4. Het hoogste pakje is smal."
        ],
        why: "Van laag naar hoog: het pakje met 4, dan 1, dan 7, dan 2. Het brede pakje is het laagste."
      }
    ],
    defaults: { name: "Noor en Sam", minutes: 45, place2: "in de schoenenkast", place3: "onder de kussens van de bank", place4: "bij de kapstok", mijter: "achter de gordijnen" },
    fields: [
      { key: "place2", label: "Waar verstop je envelop 2?", ph: "bijv. in de schoenenkast" },
      { key: "place3", label: "Waar verstop je envelop 3?", ph: "bijv. onder de kussens van de bank" },
      { key: "place4", label: "Waar verstop je envelop 4?", ph: "bijv. bij de kapstok" },
      { key: "mijter", label: "Waar verstop je de mijter (of de cadeautjes)?", ph: "bijv. achter de gordijnen" }
    ],
    intro: {
      stamp: "Spoed",
      eyebrow: "Geheime brief van de Sint",
      title: "De<br>Verdwenen<br>Mijter",
      body: function (setup, esc) {
        return '<p class="lead">Alarm! Vanavond komt Sinterklaas bij <strong>' + esc(setup.name) + "</strong>. Maar zijn mijter is verdwenen!</p>" +
          '<p class="poem">Lieve kinderen, wat een pech,<br>mijn mijter is weg, hij is écht weg!<br>Ik zag alleen pepernoten op de grond.<br>Wie loopt er met mijn mijter rond?<br><span>Groetjes, de Sint</span></p>' +
          "<p>Los vier raadsels op en vind de mijter. Jullie hebben " + esc(setup.minutes) + " minuten, dan begint pakjesavond.</p>";
      },
      needs: "Jullie hebben nodig: envelop 1 (die krijgen jullie van de spelleider), een pen, kleurpotloden en een schaar."
    },
    timeUp: { title: "Pakjesavond begint!", text: "Snel, speurneuzen. De Sint wacht op zijn mijter." },
    found: "Goed zo, speurneuzen!",
    done: {
      title: "Mijter gevonden!",
      lead: function (setup, esc) { return 'De mijter ligt <strong class="place">' + esc(setup.mijter) + "</strong>."; },
      small: "De ekster vond hem zo mooi glimmen. Nu kan de Sint weer op pad. Pakjesavond kan beginnen!"
    },
    diploma: {
      eyebrow: "Sinterklaas · Oorkonde",
      title: "Officiële Mijterspeurders",
      line: function (setup, esc) { return 'Op pakjesavond bij <span class="d-name">' + esc(setup.name) + "</span><br>hebben deze speurders de mijter van de Sint teruggevonden."; },
      seal: "Dank<br>je wel!"
    },
    parent: {
      title: "Zo zet je De Verdwenen Mijter klaar",
      intro: "Een escaperoom voor pakjesavond of een Sinterklaasfeest thuis. De kinderen lossen vier raadsels op papier op en vullen de codes in op deze pagina. Na elke goede code vertelt de pagina waar de volgende envelop ligt. Na de laatste code vinden ze de mijter.",
      formTitle: "Jullie Sinterklaasfeest",
      nameLabel: "Voor wie is het feest? (namen of familienaam)",
      prep: [
        "Print de vier puzzelvellen hieronder, op A4. Kleur mag, zwart-wit kan ook.",
        "Stop elk vel in een eigen envelop en zet het nummer erop.",
        "Heb je geen mijter? Knip er een uit rood karton, of leg er de cadeautjes neer."
      ],
      finalPrep: "De mijter (of de cadeautjes) verstop je",
      lastPrep: "Leg pennen, kleurpotloden en een schaar klaar. Geef de kinderen envelop 1 en deze telefoon op Spelen.",
      tip: "Tip: kinderen van 5 en 6 kunnen vaak nog niet goed lezen. Lees de opdrachten en het rijmpje dan voor. Het doolhof, het kleuren en de pakjes kunnen ze zelf."
    },
    sheets: function () {
      return [
        ["Envelop 1 · pepernotenspoor", sheet1()],
        ["Envelop 2 · kleur de pepernoten", sheet2()],
        ["Envelop 3 · rijmpje", sheet3()],
        ["Envelop 4 · pakjes op volgorde", sheet4()]
      ];
    }
  });

  // for testing: lets a check confirm the maze has one route through 5, 2, 8 and three decoys
  window.__mijterMaze = MAZE;
})();
