/* De Taartrover: verjaardag, 7 tot 10 jaar. Draait op de spelmotor in ../assets/missie.js. */
(function () {
  "use strict";
  var S = Missie.svg, esc = S.esc, txt = S.txt, lines = S.lines;
  var INK = S.INK, SOFT = S.SOFT, RED = S.RED, F_DISPLAY = S.F_DISPLAY, F_BODY = S.F_BODY, F_TYPE = S.F_TYPE;
  var STYLE = { header: "TAARTBUREAU · DOSSIER 7-B", footer: "De Taartrover", accent: RED };
  function frame(n, title, intro, inner) { return S.frame(STYLE, n, title, intro, inner); }

  // fingerprints: arch, loop, whorl (and a whorl with a scar)
  var fpCount = 0;
  function fingerprint(cx, cy, w, h, type, scar) {
    var id = "fp" + (++fpCount), rx = w / 2, ry = h / 2, step = Math.min(w, h) / 17, p = [];
    if (type === "arch") {
      for (var k = -13; k <= 13; k++) {
        var y0 = cy + k * step * 1.05, hump = 2.6 + Math.max(0, 6 - Math.abs(k)) * 0.55;
        p.push('<path d="M' + (cx - rx - 2) + " " + (y0 + 1.2) + " Q" + cx + " " + (y0 - hump * 1.6) + " " + (cx + rx + 2) + " " + (y0 + 1.2) + '"/>');
      }
    } else if (type === "loop") {
      for (var j = 1; j <= 14; j++) {
        var r = j * step, ex = cx + rx * 0.15;
        p.push('<path d="M' + (cx - rx - 3) + " " + (cy - r) + " L" + ex + " " + (cy - r) + " A" + r + " " + r + " 0 0 1 " + ex + " " + (cy + r) + " L" + (cx - rx - 3) + " " + (cy + r) + '"/>');
      }
    } else {
      for (var q = 1; q <= 14; q++) {
        var a = q * step * 0.92, b = q * step * 1.08, ox = Math.sin(q * 0.9) * step * 0.22, oy = Math.cos(q * 0.7) * step * 0.2;
        p.push('<ellipse cx="' + (cx + ox).toFixed(2) + '" cy="' + (cy - step * 0.6 + oy).toFixed(2) + '" rx="' + a.toFixed(2) + '" ry="' + b.toFixed(2) + '"/>');
      }
    }
    var scarLine = scar ? '<path d="M' + (cx - rx * 0.75) + " " + (cy - ry * 0.35) + " L" + (cx + rx * 0.55) + " " + (cy + ry * 0.2) + '" stroke="#fff" stroke-width="' + (step * 0.9).toFixed(2) + '" stroke-linecap="round"/>' : "";
    return '<defs><clipPath id="' + id + '"><ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '"/></clipPath></defs>' +
      '<g clip-path="url(#' + id + ')"><rect x="' + (cx - rx) + '" y="' + (cy - ry) + '" width="' + w + '" height="' + h + '" fill="#fbf7ee"/>' +
      '<g fill="none" stroke="' + INK + '" stroke-width="' + (step * 0.42).toFixed(2) + '">' + p.join("") + "</g>" + scarLine + "</g>" +
      '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="none" stroke="' + SOFT + '" stroke-width="0.35"/>';
  }

  function face(kind, x, y) {
    var s = '<g transform="translate(' + x + " " + y + ')" stroke="' + INK + '" stroke-width="0.6" stroke-linejoin="round" stroke-linecap="round">';
    var head = '<circle cx="0" cy="2" r="8" fill="#ffe2c4"/><circle cx="-2.8" cy="1" r="0.9" fill="' + INK + '" stroke="none"/><circle cx="2.8" cy="1" r="0.9" fill="' + INK + '" stroke="none"/>';
    if (kind === "bram") {
      s += head + '<path d="M-3.4 5.2 Q-1.7 4 0 5 Q1.7 4 3.4 5.2 Q1.7 6.4 0 5.6 Q-1.7 6.4 -3.4 5.2Z" fill="#6b4a2b"/>' +
        '<rect x="-6" y="-7.5" width="12" height="3.2" fill="#fff"/><circle cx="-4" cy="-9" r="3.2" fill="#fff"/><circle cx="0" cy="-10.6" r="3.6" fill="#fff"/><circle cx="4" cy="-9" r="3.2" fill="#fff"/>';
    } else if (kind === "jam") {
      s += '<circle cx="0" cy="-8.4" r="3.4" fill="#b8434e"/>' + head + '<path d="M-7.6 0 Q-7 -6.4 0 -6.4 Q7 -6.4 7.6 0 Q5 -3.4 0 -3.6 Q-5 -3.4 -7.6 0Z" fill="#b8434e"/>' +
        '<path d="M-2.4 5 Q0 6.8 2.4 5" fill="none"/>';
    } else if (kind === "kruimel") {
      s += head + '<path d="M-7.4 3 Q-6 11.4 0 11.4 Q6 11.4 7.4 3 Q4.4 6 0 6 Q-4.4 6 -7.4 3Z" fill="#8a5a33"/>' +
        '<ellipse cx="2.8" cy="1" rx="2.1" ry="1.7" fill="' + INK + '"/><path d="M-7.6 -1.8 L7.6 1.8" fill="none"/>' +
        '<path d="M-8.8 -5.2 L8.8 -5.2 L6.8 -7.6 L-6.8 -7.6Z" fill="' + INK + '"/><path d="M-6.2 -7.6 Q0 -13.4 6.2 -7.6Z" fill="#2e3a6e"/><circle cx="0" cy="-9" r="1.2" fill="#ffd23f"/>';
    } else {
      s += '<circle cx="-6" cy="-4.6" r="2.4" fill="#d9d9e3"/><circle cx="-2.6" cy="-7" r="2.6" fill="#d9d9e3"/><circle cx="1.2" cy="-7.4" r="2.6" fill="#d9d9e3"/><circle cx="4.8" cy="-5.6" r="2.4" fill="#d9d9e3"/><circle cx="6.8" cy="-2.4" r="2" fill="#d9d9e3"/><circle cx="-7.4" cy="-1.4" r="1.9" fill="#d9d9e3"/>' +
        head + '<circle cx="-2.8" cy="1" r="2.1" fill="none"/><circle cx="2.8" cy="1" r="2.1" fill="none"/><path d="M-0.7 1 L0.7 1" fill="none"/><path d="M-2.2 5 Q0 6.6 2.2 5" fill="none"/>';
    }
    return s + "</g>";
  }

  function sheet1() {
    var suspects = [
      { kind: "bram", name: "Bakker Bram", nr: "418", type: "loop", scar: false },
      { kind: "jam", name: "Juffrouw Jam", nr: "562", type: "arch", scar: false },
      { kind: "kruimel", name: "Kapitein Kruimel", nr: "734", type: "whorl", scar: true },
      { kind: "olijfje", name: "Oma Olijfje", nr: "209", type: "whorl", scar: false }
    ];
    var inner =
      '<rect x="16" y="66" width="178" height="66" rx="3" fill="#fff7e0" stroke="' + INK + '" stroke-width="0.5"/>' +
      fingerprint(52, 99, 40, 52, "whorl", true) +
      txt(84, 84, "GEVONDEN OP HET TAARTBORD", 6, { font: F_DISPLAY, fill: RED }) +
      lines(84, 94, ["Deze vingerafdruk zat op het bord", "waar de taart op stond.", "Bekijk elk lijntje goed!"], 4.6, 6.2) +
      txt(84, 122, "Code = dossiernummer van de dader", 4.4, { font: F_TYPE, fill: SOFT });
    suspects.forEach(function (sp, i) {
      var x = 16 + (i % 2) * 91, y = 142 + Math.floor(i / 2) * 68;
      inner += '<rect x="' + x + '" y="' + y + '" width="87" height="62" rx="3" fill="none" stroke="' + INK + '" stroke-width="0.5"/>' +
        face(sp.kind, x + 16, y + 24) +
        txt(x + 5, y + 46, sp.name, 4.6, { weight: 800 }) +
        txt(x + 5, y + 53, "Dossiernr. " + sp.nr, 4.2, { font: F_TYPE, fill: SOFT }) +
        fingerprint(x + 63, y + 30, 30, 40, sp.type, sp.scar);
    });
    return frame(1, "Wie heeft de taart gepakt?", ["Vergelijk de vingerafdruk van het taartbord met die van de vier verdachten.", "Wie heeft precies dezelfde? Zijn of haar dossiernummer is de code."], inner);
  }

  // pigpen cipher
  function glyph(ch, x, y, s) {
    var c = ch.charCodeAt(0) - 65, out = "", dot = false, w = 0.85;
    function L(x1, y1, x2, y2) { out += '<path d="M' + (x + x1 * s).toFixed(2) + " " + (y + y1 * s).toFixed(2) + " L" + (x + x2 * s).toFixed(2) + " " + (y + y2 * s).toFixed(2) + '"/>'; }
    if (c < 18) {
      if (c >= 9) { dot = true; c -= 9; }
      var r = Math.floor(c / 3), col = c % 3;
      if (r > 0) L(0, 0, 1, 0);
      if (r < 2) L(0, 1, 1, 1);
      if (col > 0) L(0, 0, 0, 1);
      if (col < 2) L(1, 0, 1, 1);
      if (dot) out += '<circle cx="' + (x + s / 2) + '" cy="' + (y + s / 2) + '" r="' + (s * 0.11) + '" fill="' + INK + '" stroke="none"/>';
    } else {
      var k = c - 18; if (k >= 4) { dot = true; k -= 4; }
      var pts = [[[0, 0], [0.5, 1], [1, 0]], [[0, 0], [1, 0.5], [0, 1]], [[1, 0], [0, 0.5], [1, 1]], [[0, 1], [0.5, 0], [1, 1]]][k];
      L(pts[0][0], pts[0][1], pts[1][0], pts[1][1]); L(pts[1][0], pts[1][1], pts[2][0], pts[2][1]);
      var dpos = [[0.5, 0.32], [0.32, 0.5], [0.68, 0.5], [0.5, 0.68]][k];
      if (dot) out += '<circle cx="' + (x + dpos[0] * s) + '" cy="' + (y + dpos[1] * s) + '" r="' + (s * 0.11) + '" fill="' + INK + '" stroke="none"/>';
    }
    return '<g fill="none" stroke="' + INK + '" stroke-width="' + w + '" stroke-linecap="round">' + out + "</g>";
  }
  function keyGrid(x, y, letters, dots) {
    var s = 13, o = '<g fill="none" stroke="' + INK + '" stroke-width="0.8">' +
      '<path d="M' + (x + s) + " " + y + " V" + (y + 3 * s) + " M" + (x + 2 * s) + " " + y + " V" + (y + 3 * s) + " M" + x + " " + (y + s) + " H" + (x + 3 * s) + " M" + x + " " + (y + 2 * s) + " H" + (x + 3 * s) + '"/></g>';
    for (var i = 0; i < 9; i++) {
      var cx = x + (i % 3) * s + s / 2, cy = y + Math.floor(i / 3) * s + s / 2;
      o += txt(cx, cy + (dots ? 0.6 : 1.8), letters[i], 5.2, { font: F_TYPE, anchor: "middle" });
      if (dots) o += '<circle cx="' + cx + '" cy="' + (cy + 3.6) + '" r="0.9" fill="' + INK + '"/>';
    }
    return o;
  }
  function keyX(x, y, letters, dots) {
    var s = 39, o = '<g fill="none" stroke="' + INK + '" stroke-width="0.8"><path d="M' + x + " " + y + " L" + (x + s) + " " + (y + s) + " M" + (x + s) + " " + y + " L" + x + " " + (y + s) + '"/></g>';
    var pos = [[0.5, 0.2], [0.2, 0.5], [0.8, 0.5], [0.5, 0.8]];
    for (var i = 0; i < 4; i++) {
      var cx = x + pos[i][0] * s, cy = y + pos[i][1] * s;
      o += txt(cx, cy + (dots ? 0.6 : 1.8), letters[i], 5.2, { font: F_TYPE, anchor: "middle" });
      if (dots) o += '<circle cx="' + cx + '" cy="' + (cy + 3.6) + '" r="0.9" fill="' + INK + '"/>';
    }
    return o;
  }
  function sheet2() {
    var rows = [["HAHA", "DE", "CODE", "IS"], ["SLAGROOM"]], gs = 8.6, adv = 12, inner = "";
    inner += '<g transform="rotate(-1.5 105 104)"><rect x="18" y="66" width="174" height="80" rx="2" fill="#fffdf6" stroke="' + INK + '" stroke-width="0.5"/>' +
      '<path d="M18 74 H192" stroke="#f0c9cd" stroke-width="0.4"/>';
    rows.forEach(function (words, ri) {
      var total = words.reduce(function (a, w) { return a + w.length * adv; }, 0) + (words.length - 1) * 7, x = 105 - total / 2 + 1.7, y = 84 + ri * 30;
      words.forEach(function (w) {
        for (var k = 0; k < w.length; k++) {
          inner += glyph(w[k], x, y, gs) + '<path d="M' + (x - 0.5) + " " + (y + 18) + " H" + (x + gs + 0.5) + '" stroke="' + SOFT + '" stroke-width="0.4"/>';
          x += adv;
        }
        x += 7;
      });
    });
    inner += txt(186, 141, "K.K.", 5.4, { font: F_TYPE, anchor: "end" }) + "</g>";
    inner += txt(16, 162, "DE SLEUTEL", 7, { font: F_DISPLAY, fill: RED });
    inner += keyGrid(16, 170, "ABCDEFGHI", false) + keyGrid(62, 170, "JKLMNOPQR", true) + keyX(108, 170, "STUV", false) + keyX(153, 170, "WXYZ", true);
    inner += lines(16, 224, ["Voorbeeld: het teken voor E is een vierkantje, want E zit in het", "middelste hokje. Een teken met een stip zoek je op in een rooster met stippen."], 4.2, 5.8);
    inner += '<rect x="16" y="240" width="178" height="30" rx="3" fill="#fff7e0" stroke="' + INK + '" stroke-width="0.5"/>' +
      txt(22, 250, "De code is het laatste woord:", 4.6, { weight: 800 });
    for (var b = 0; b < 8; b++) inner += '<rect x="' + (22 + b * 13) + '" y="254" width="11" height="12" rx="1.5" fill="#fff" stroke="' + INK + '" stroke-width="0.5"/>';
    return frame(2, "Het geheime briefje", ["De dader liet dit briefje achter in geheimschrift. Zoek elk teken op", "in de sleutel en schrijf de letter op het streepje eronder."], inner);
  }

  // sprinkles on a cake, seeded so every print is the same
  var rng = S.rng;
  function shape(kind, x, y, r, rot) {
    var g = '<g transform="translate(' + x.toFixed(2) + " " + y.toFixed(2) + ") rotate(" + rot.toFixed(1) + ')" stroke="' + INK + '" stroke-width="0.55" stroke-linejoin="round">';
    if (kind === "star") {
      var pts = [];
      for (var i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; pts.push((Math.cos(a) * rr).toFixed(2) + "," + (Math.sin(a) * rr).toFixed(2)); }
      g += '<polygon points="' + pts.join(" ") + '" fill="#ffd23f"/>';
    } else if (kind === "dot") g += '<circle r="' + (r * 0.7) + '" fill="#ff7a85"/>';
    else if (kind === "tri") g += '<polygon points="0,' + (-r * 0.85) + " " + (r * 0.8) + "," + (r * 0.6) + " " + (-r * 0.8) + "," + (r * 0.6) + '" fill="#7aa7ff"/>';
    else g += '<rect x="' + (-r * 0.62) + '" y="' + (-r * 0.62) + '" width="' + (r * 1.24) + '" height="' + (r * 1.24) + '" fill="#7fe0b0"/>';
    return g + "</g>";
  }
  function sheet3() {
    var cx = 105, cy = 182, R = 64, inner = "";
    inner += '<rect x="16" y="64" width="178" height="30" rx="3" fill="#fff7e0" stroke="' + INK + '" stroke-width="0.5"/>' +
      txt(22, 74, "Zet de aantallen in deze volgorde:", 4.6, { weight: 800 });
    ["star", "dot", "tri", "sq"].forEach(function (k, i) {
      var x = 30 + i * 40;
      inner += shape(k, x, 84, 4.2, 0) + '<rect x="' + (x + 7) + '" y="78" width="12" height="12" rx="1.5" fill="#fff" stroke="' + INK + '" stroke-width="0.5"/>';
      if (i < 3) inner += txt(x + 27, 86.5, "→", 5, { fill: SOFT, anchor: "middle" });
    });
    inner += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (R + 6) + '" fill="#f6d7a7" stroke="' + INK + '" stroke-width="0.6"/>';
    var wave = [];
    for (var a = 0; a <= 360; a += 5) { var rr = R + Math.sin(a * Math.PI / 15) * 1.6, t = a * Math.PI / 180; wave.push((cx + Math.cos(t) * rr).toFixed(2) + "," + (cy + Math.sin(t) * rr).toFixed(2)); }
    inner += '<polygon points="' + wave.join(" ") + '" fill="#fff4f7" stroke="' + INK + '" stroke-width="0.6"/>';
    var cherries = [];
    [45, 135, 225, 315].forEach(function (deg) {
      var t = deg * Math.PI / 180, x = cx + Math.cos(t) * 44, y = cy + Math.sin(t) * 44;
      cherries.push([x, y]);
      inner += '<path d="M' + x + " " + (y - 3.6) + " q2 -5 6 -6" + '" fill="none" stroke="#3d7a3a" stroke-width="0.8"/><circle cx="' + x + '" cy="' + y + '" r="4.2" fill="#c8102e" stroke="' + INK + '" stroke-width="0.6"/><circle cx="' + (x - 1.4) + '" cy="' + (y - 1.4) + '" r="1" fill="#fff" opacity=".7"/>';
    });
    var counts = { star: 3, dot: 5, tri: 8, sq: 2 }, rand = rng(20261108), placed = [];
    Object.keys(counts).forEach(function (k) {
      var n = 0, guard = 0;
      while (n < counts[k] && guard++ < 5000) {
        var ang = rand() * Math.PI * 2, rad = Math.sqrt(rand()) * (R - 9), x = cx + Math.cos(ang) * rad, y = cy + Math.sin(ang) * rad;
        var ok = placed.every(function (p) { return Math.hypot(p[0] - x, p[1] - y) > 13; }) && cherries.every(function (c) { return Math.hypot(c[0] - x, c[1] - y) > 13; });
        if (!ok) continue;
        placed.push([x, y]); inner += shape(k, x, y, 4.6, rand() * 360); n++;
      }
    });
    inner += txt(105, 264, "Let op: kersen tellen niet mee!", 5, { font: F_DISPLAY, fill: RED, anchor: "middle" });
    return frame(3, "Hagelslag tellen", ["Kapitein Kruimel heeft de hagelslag op de taart geteld. Jullie ook?", "Tel elke soort apart: sterretjes, rondjes, driehoekjes en vierkantjes."], inner);
  }

  // the torn note: one drawing, cut into six strips that are shuffled on the sheet
  function noteArt() {
    var o = '<rect x="0" y="0" width="156" height="92" fill="#fffdf6"/>';
    for (var y = 12; y < 92; y += 9) o += '<path d="M0 ' + y + ' H156" stroke="#dde3f3" stroke-width="0.4"/>';
    o += '<path d="M14 0 V92" stroke="#f0c9cd" stroke-width="0.5"/>';
    o += txt(78, 16, "DE CODE VAN", 8, { font: F_DISPLAY, anchor: "middle" });
    o += txt(78, 27, "DE KLUIS IS", 8, { font: F_DISPLAY, anchor: "middle" });
    [["6", 26], ["2", 52], ["9", 104], ["1", 130]].forEach(function (d) { o += txt(d[1], 58, d[0], 28, { font: F_DISPLAY, fill: RED, anchor: "middle" }); });
    o += '<path d="M6 72 Q19 64 32 72 T58 72 T84 72 T110 72 T136 72 T152 70" fill="none" stroke="' + INK + '" stroke-width="0.9"/>';
    o += '<g transform="translate(78 80)" stroke="' + INK + '" stroke-width="0.7"><rect x="-22" y="-6" width="44" height="12" rx="2" fill="#f6d7a7"/><rect x="-22" y="-9" width="44" height="5" rx="2" fill="#fff4f7"/>' +
      '<path d="M-14 -9 V-14 M0 -9 V-15 M14 -9 V-14" fill="none"/><path d="M-14 -16 q1 -2 0 -3 M0 -17 q1 -2 0 -3 M14 -16 q1 -2 0 -3" fill="none" stroke="#e8902a"/></g>';
    o += txt(150, 88, "K.K.", 5, { font: F_TYPE, anchor: "end" });
    return o;
  }
  function sheet4() {
    var order = [3, 0, 5, 1, 4, 2], rot = [-2.2, 1.4, -1, 2, -1.6, 1.1], sw = 26, inner = "";
    var art = noteArt();
    order.forEach(function (src, k) {
      var x = 17 + k * 30, y = 66, cxs = x + sw / 2, cys = y + 46;
      inner += '<g transform="rotate(' + rot[k] + " " + cxs + " " + cys + ')">' +
        '<svg x="' + x + '" y="' + y + '" width="' + sw + '" height="92" viewBox="' + (src * sw) + ' 0 ' + sw + ' 92">' + art + "</svg>" +
        '<rect x="' + (x - 1.4) + '" y="' + (y - 1.4) + '" width="' + (sw + 2.8) + '" height="94.8" fill="none" stroke="' + SOFT + '" stroke-width="0.4" stroke-dasharray="1.6 1.2"/></g>';
    });
    inner += '<g transform="translate(15 162)" fill="none" stroke="' + INK + '" stroke-width="0.6"><circle cx="0" cy="-2" r="1.8"/><circle cx="0" cy="2" r="1.8"/><path d="M1.5 -1 L8 2 M1.5 1 L8 -2"/></g>' +
      txt(27, 163.5, "Knip langs de stippellijnen.", 4.2, { fill: SOFT });
    inner += '<rect x="27" y="176" width="156" height="92" rx="1" fill="none" stroke="' + INK + '" stroke-width="0.5" stroke-dasharray="3 2"/>' +
      txt(105, 224, "Leg de stroken hier in de goede volgorde", 5, { fill: SOFT, anchor: "middle" });
    return frame(4, "Het verscheurde briefje", ["Kapitein Kruimel heeft zijn briefje in zes stroken gescheurd.", "Knip ze los en leg ze in de goede volgorde. Dan zie je de code van de kluis."], inner);
  }


  Missie.start({
    key: "taartrover",
    answers: ["734", "SLAGROOM", "3582", "6291"],
    steps: [
      {
        title: "Wie heeft de taart gepakt?",
        text: "Open envelop 1. Op het taartbord zat een vingerafdruk. Vergelijk hem met die van de vier verdachten. Het dossiernummer van de dader is de code.",
        mode: "numeric",
        hints: [
          "Kijk naar het patroon in het midden van elke vingerafdruk: een bergje, een lusje of rondjes?",
          "De vingerafdruk van het taartbord heeft rondjes én een wit streepje erdoorheen. Wie heeft dat streepje ook?"
        ],
        why: "De vingerafdruk op het taartbord heeft rondjes en een wit streepje. Alleen Kapitein Kruimel heeft dat streepje. Oma Olijfje heeft ook rondjes, maar geen streepje."
      },
      {
        title: "Het geheime briefje",
        text: "Open envelop 2. De dader liet een briefje achter in geheimschrift. Zoek elk teken op in de sleutel en schrijf de letter eronder. Het laatste woord is de code.",
        mode: "text",
        hints: [
          "Elk teken hoort bij één hokje in de sleutel. Een stip in het teken betekent: kijk in het rooster met de stippen.",
          "Het briefje begint met HAHA. Het laatste woord heeft 8 letters en is wit, zoet en zit op taart."
        ],
        why: "Het briefje zegt: HAHA DE CODE IS SLAGROOM."
      },
      {
        title: "Hagelslag tellen",
        text: "Open envelop 3. Tel de hagelslag op de taart. Kersen tellen niet mee. Zet de aantallen in de volgorde die bovenaan het vel staat.",
        mode: "numeric",
        hints: [
          "Tel één soort tegelijk en zet een streepje op elke vorm die je al hebt geteld.",
          "Er zijn 3 sterretjes. De rest tellen jullie zelf."
        ],
        why: "3 sterretjes, 5 rondjes, 8 driehoekjes en 2 vierkantjes. De 4 kersen tellen niet mee."
      },
      {
        title: "Het verscheurde briefje",
        text: "Open envelop 4. De dader heeft een briefje verscheurd. Knip de stroken los en leg ze in de goede volgorde. Dan zie je de code van de kluis.",
        mode: "numeric",
        hints: [
          "Kijk naar de taart en de golflijn onderaan het briefje. Die moeten weer heel worden.",
          "Bovenaan staat: DE CODE VAN DE KLUIS IS. Leg de stroken zo dat je dat kunt lezen."
        ],
        why: "Op het briefje staat: DE CODE VAN DE KLUIS IS 6 2 9 1."
      }
    ],
    defaults: { name: "Sam", minutes: 45, place2: "onder de bank", place3: "in de koelkast", place4: "in de boekenkast", cake: "in de wasmand" },
    fields: [
      { key: "place2", label: "Waar verstop je envelop 2?", ph: "bijv. onder de bank" },
      { key: "place3", label: "Waar verstop je envelop 3?", ph: "bijv. in de koelkast" },
      { key: "place4", label: "Waar verstop je envelop 4?", ph: "bijv. in de boekenkast" },
      { key: "cake", label: "Waar verstop je de taart?", ph: "bijv. in de wasmand" }
    ],
    intro: {
      stamp: "Streng geheim",
      eyebrow: "Dossier 7-B · Taartbureau",
      title: "De<br>Taartrover",
      body: function (setup, esc) {
        return '<p class="lead">Alarm! De verjaardagstaart van <strong>' + esc(setup.name) + '</strong> is verdwenen. Op het taartbord zit een vingerafdruk en in huis liggen geheime enveloppen.</p>' +
          "<p>Jullie zijn de beste detectives van het Taartbureau. Los vier raadsels op en open de kluis. Jullie hebben " + esc(setup.minutes) + " minuten, daarna smelt de slagroom.</p>";
      },
      needs: "Jullie hebben nodig: envelop 1 (die krijgen jullie van de spelleider), een pen en een schaar."
    },
    timeUp: { title: "De slagroom smelt!", text: "Snel, detectives." },
    found: "Goed zo, detectives!",
    done: {
      title: "Kluis open!",
      lead: function (setup, esc) { return 'De taart staat <strong class="place">' + esc(setup.cake) + "</strong>."; },
      small: "Kapitein Kruimel heeft er gelukkig nog niet van gegeten."
    },
    diploma: {
      eyebrow: "Taartbureau · Diploma",
      title: "Officiële Taartdetectives",
      line: function (setup, esc) { return 'Op het feest van <span class="d-name">' + esc(setup.name) + "</span><br>hebben deze detectives de taartrover ontmaskerd."; },
      seal: "Echt<br>knap"
    },
    parent: {
      title: "Zo zet je De Taartrover klaar",
      intro: "Een escaperoom voor een kinderfeestje thuis. De kinderen lossen vier raadsels op papier op en vullen de codes in op deze pagina. Na elke goede code vertelt de pagina waar de volgende envelop ligt. Na de laatste code vinden ze de taart.",
      formTitle: "Jullie feest",
      nameLabel: "Naam van de jarige",
      prep: [
        "Print de vier puzzelvellen hieronder, op A4. Kleur mag, zwart-wit kan ook.",
        "Stop elk vel in een eigen envelop en zet het nummer erop."
      ],
      finalPrep: "De taart (of de traktatie) verstop je",
      lastPrep: "Leg pennen en een schaar klaar. Geef de kinderen envelop 1 en deze telefoon op Spelen.",
      tip: "Tip: houd de telefoon zelf bij je als de kinderen klein zijn. Lees de raadsels dan samen voor."
    },
    sheets: function () {
      return [
        ["Envelop 1 · vingerafdrukken", sheet1()],
        ["Envelop 2 · geheimschrift", sheet2()],
        ["Envelop 3 · hagelslag tellen", sheet3()],
        ["Envelop 4 · verscheurd briefje", sheet4()]
      ];
    }
  });
})();
