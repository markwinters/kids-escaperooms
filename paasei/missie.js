/* Het Paasei-alarm: Pasen, 6 tot 10 jaar. Draait op de spelmotor in ../assets/missie.js. */
(function () {
  "use strict";
  var S = Missie.svg, txt = S.txt, lines = S.lines;
  var INK = S.INK, SOFT = S.SOFT, F_DISPLAY = S.F_DISPLAY, F_BODY = S.F_BODY;
  var PINK = "#e8457a", CREAM = "#fff7e0", GOLD = "#f5c542";
  var STYLE = { header: "EIERFABRIEK · ALARMDOSSIER", footer: "Het Paasei-alarm", accent: PINK };
  function frame(n, title, intro, inner) { return S.frame(STYLE, n, title, intro, inner); }

  // ------------------------------------------------------------------ eggs with patterns
  var PATTERNS = [
    { name: "stippen", digit: "6", fill: "#ffd9e6" },
    { name: "strepen", digit: "2", fill: "#cfe3ff" },
    { name: "zigzag", digit: "8", fill: "#d6f5d0" },
    { name: "hartjes", digit: "5", fill: "#fff1b8" }
  ];
  var eggId = 0;
  function eggPath(h) {
    var w = h * 0.78;
    return "M0 " + (-h) + " C" + w + " " + (-h) + " " + w + " " + (h * 0.92) + " 0 " + h + " C" + (-w) + " " + (h * 0.92) + " " + (-w) + " " + (-h) + " 0 " + (-h) + "Z";
  }
  function heart(x, y, s) {
    return '<path d="M' + x + " " + (y + s * 0.9) + " C" + (x - s * 1.6) + " " + (y - s * 0.2) + " " + (x - s * 0.7) + " " + (y - s * 1.3) + " " + x + " " + (y - s * 0.4) +
      " C" + (x + s * 0.7) + " " + (y - s * 1.3) + " " + (x + s * 1.6) + " " + (y - s * 0.2) + " " + x + " " + (y + s * 0.9) + 'Z" fill="' + PINK + '" stroke="none"/>';
  }
  // pattern: index into PATTERNS, or -1 for an empty egg the children decorate themselves
  function egg(x, y, h, pattern) {
    var id = "egg" + (++eggId), d = eggPath(h), body = "";
    if (pattern >= 0) {
      var p = PATTERNS[pattern];
      body += '<rect x="' + (-h) + '" y="' + (-h) + '" width="' + (2 * h) + '" height="' + (2 * h) + '" fill="' + p.fill + '"/>';
      if (p.name === "stippen") {
        for (var r = -3; r <= 3; r++) for (var c = -3; c <= 3; c++) body += '<circle cx="' + (c * h * 0.3 + (r % 2 ? h * 0.15 : 0)).toFixed(2) + '" cy="' + (r * h * 0.3).toFixed(2) + '" r="' + (h * 0.075).toFixed(2) + '" fill="' + INK + '"/>';
      } else if (p.name === "strepen") {
        for (var k = -4; k <= 4; k++) body += '<rect x="' + (-h) + '" y="' + (k * h * 0.26 - h * 0.05).toFixed(2) + '" width="' + (2 * h) + '" height="' + (h * 0.1).toFixed(2) + '" fill="' + INK + '"/>';
      } else if (p.name === "zigzag") {
        for (var z = -2; z <= 2; z++) {
          var pts = [];
          for (var q = -5; q <= 5; q++) pts.push((q * h * 0.2).toFixed(2) + "," + (z * h * 0.42 + (q % 2 ? h * 0.12 : -h * 0.12)).toFixed(2));
          body += '<polyline points="' + pts.join(" ") + '" fill="none" stroke="' + INK + '" stroke-width="' + (h * 0.07).toFixed(2) + '"/>';
        }
      } else {
        [[-0.3, -0.5], [0.3, -0.2], [-0.3, 0.15], [0.3, 0.5], [0, 0.8], [0, -0.85], [-0.55, 0.45], [0.55, -0.5]].forEach(function (pt) { body += heart(pt[0] * h, pt[1] * h, h * 0.13); });
      }
    } else {
      body += '<rect x="' + (-h) + '" y="' + (-h) + '" width="' + (2 * h) + '" height="' + (2 * h) + '" fill="#fff"/>';
    }
    return '<g transform="translate(' + x + " " + y + ')"><defs><clipPath id="' + id + '"><path d="' + d + '"/></clipPath></defs>' +
      '<g clip-path="url(#' + id + ')">' + body + "</g>" +
      '<path d="' + d + '" fill="none" stroke="' + INK + '" stroke-width="0.6"' + (pattern < 0 ? ' stroke-dasharray="1.6 1.2"' : "") + "/></g>";
  }

  // ------------------------------------------------------------------ envelope 1: egg sudoku
  // solution (pattern index per cell); givens are shown, A, B and C are the cells that make the code
  var SOL = [[0, 1, 2, 3], [2, 3, 0, 1], [1, 0, 3, 2], [3, 2, 1, 0]];
  var GIVEN = { "0,2": 1, "1,0": 1, "1,3": 1, "2,1": 1, "3,0": 1, "3,2": 1 };
  var MARK = { "0,1": "A", "2,2": "B", "3,3": "C" };
  function sheet1() {
    var cs = 30, x0 = 45, y0 = 64, inner = "";
    for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++) {
      var x = x0 + c * cs, y = y0 + r * cs, key = r + "," + c;
      inner += '<rect x="' + x + '" y="' + y + '" width="' + cs + '" height="' + cs + '" fill="#fff" stroke="' + INK + '" stroke-width="0.4"/>';
      inner += egg(x + cs / 2, y + cs / 2, 11, GIVEN[key] ? SOL[r][c] : -1);
      if (MARK[key]) inner += '<circle cx="' + (x + 5) + '" cy="' + (y + 5) + '" r="3.8" fill="' + PINK + '"/>' + txt(x + 5, y + 6.7, MARK[key], 4.6, { font: F_DISPLAY, fill: "#fff", anchor: "middle" });
    }
    inner += '<path d="M' + (x0 + 2 * cs) + " " + y0 + " V" + (y0 + 4 * cs) + " M" + x0 + " " + (y0 + 2 * cs) + " H" + (x0 + 4 * cs) + '" stroke="' + INK + '" stroke-width="1.6"/>' +
      '<rect x="' + x0 + '" y="' + y0 + '" width="' + (4 * cs) + '" height="' + (4 * cs) + '" fill="none" stroke="' + INK + '" stroke-width="1.6"/>';
    inner += txt(16, 196, "DE SLEUTEL", 7, { font: F_DISPLAY, fill: PINK });
    PATTERNS.forEach(function (p, k) {
      var x = 30 + k * 44;
      inner += egg(x, 216, 10, k) + txt(x + 14, 214, p.name, 4.2, { weight: 800 }) + txt(x + 14, 222, "= " + p.digit, 5.4, { font: F_DISPLAY, fill: PINK });
    });
    inner += S.answerBox(250, 3, "Code: welk ei hoort bij A, B en C?", { x: 128, under: ["A", "B", "C"] });
    return frame(1, "De eieren-sudoku", ["Elke soort ei komt in elke rij, elke kolom en elk vak van vier precies één keer voor.", "Teken de ontbrekende eieren. Kijk dan in de sleutel welk cijfer bij A, B en C hoort."], inner);
  }

  // ------------------------------------------------------------------ envelope 2: the mirror letter
  function sheet2() {
    var inner = '<rect x="20" y="66" width="170" height="128" rx="3" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="0.5"/>';
    for (var y = 78; y < 190; y += 12) inner += '<path d="M26 ' + y + ' H184" stroke="#e7dcc0" stroke-width="0.4"/>';
    var msg = ["HALLO SPEURDERS!", "IK HEB HET GOUDEN EI.", "IK HOUD HET LEKKER WARM", "TOT HET UITKOMT.", "DE CODE IS PIEP"];
    var mirrored = "";
    msg.forEach(function (l, k) { mirrored += txt(105, 88 + k * 18, l, 8.2, { font: F_DISPLAY, anchor: "middle" }); });
    mirrored += txt(105, 184, "groetjes, piep piep", 5.2, { anchor: "middle", fill: SOFT });
    inner += '<g transform="translate(210 0) scale(-1 1)">' + mirrored + "</g>";
    // tiny yellow feathers next to the letter
    [[22, 206, -20], [32, 211, 15], [188, 207, 30]].forEach(function (f) {
      inner += '<g transform="translate(' + f[0] + " " + f[1] + ") rotate(" + f[2] + ')"><path d="M0 -6 C3 -3 3 3 0 6 C-3 3 -3 -3 0 -6Z" fill="' + GOLD + '" stroke="' + INK + '" stroke-width="0.4"/></g>';
    });
    inner += txt(105, 210, "Dit briefje lag in het lege eierdoosje, met gele donsveertjes.", 4.4, { anchor: "middle", fill: SOFT });
    inner += '<rect x="16" y="220" width="178" height="18" rx="3" fill="none" stroke="' + INK + '" stroke-width="0.5" stroke-dasharray="2 1.5"/>' +
      txt(105, 231, "Tip: houd het vel voor een spiegel, of tegen het raam.", 4.6, { anchor: "middle", weight: 800 });
    inner += S.answerBox(258, 4, "Het laatste woord is de code:", { x: 120 });
    return frame(2, "De spiegelbrief", ["De dief schreef een briefje in spiegelschrift. Lees het met een spiegel,", "of houd het vel tegen het raam en lees het van de achterkant."], inner);
  }

  // ------------------------------------------------------------------ envelope 3: picture sums
  var PICS = {
    ei: function (x, y) { return egg(x, y, 7, 3); },
    haas: function (x, y) {
      return '<g transform="translate(' + x + " " + y + ')" stroke="' + INK + '" stroke-width="0.6" stroke-linejoin="round">' +
        '<ellipse cx="-3" cy="-9" rx="2.2" ry="6" fill="#d9c7b0" transform="rotate(-12 -3 -9)"/><ellipse cx="3" cy="-9" rx="2.2" ry="6" fill="#d9c7b0" transform="rotate(12 3 -9)"/>' +
        '<ellipse cx="0" cy="5" rx="7" ry="5" fill="#d9c7b0"/><circle cx="0" cy="-1" r="5" fill="#d9c7b0"/>' +
        '<circle cx="-1.8" cy="-2" r="0.8" fill="' + INK + '" stroke="none"/><circle cx="1.8" cy="-2" r="0.8" fill="' + INK + '" stroke="none"/><circle cx="0" cy="0.4" r="0.9" fill="' + PINK + '" stroke="none"/></g>';
    },
    kuiken: function (x, y) {
      return '<g transform="translate(' + x + " " + y + ')" stroke="' + INK + '" stroke-width="0.6" stroke-linejoin="round">' +
        '<ellipse cx="0" cy="3" rx="7" ry="6" fill="' + GOLD + '"/><circle cx="0" cy="-4.5" r="4.4" fill="' + GOLD + '"/>' +
        '<path d="M3.8 -4.6 L7 -3.6 L3.8 -2.6 Z" fill="#f08a24"/><circle cx="1.4" cy="-5.4" r="0.8" fill="' + INK + '" stroke="none"/>' +
        '<path d="M-3 2 Q-5.5 4 -3 6" fill="none"/></g>';
    }
  };
  function sheet3() {
    var inner = "", rows = [[["ei", "ei"], "4"], [["haas", "ei"], "7"], [["haas", "kuiken", "kuiken"], "11"]];
    rows.forEach(function (row, k) {
      var y = 84 + k * 36, x = 34;
      inner += '<rect x="16" y="' + (y - 15) + '" width="178" height="30" rx="3" fill="#fff" stroke="' + INK + '" stroke-width="0.5"/>';
      row[0].forEach(function (p, i) {
        if (i) { inner += txt(x - 11, y + 3, "+", 9, { font: F_DISPLAY, anchor: "middle" }); }
        inner += PICS[p](x, y); x += 34;
      });
      inner += txt(x - 11, y + 3, "=", 9, { font: F_DISPLAY, anchor: "middle" }) + txt(x + 6, y + 4, row[1], 11, { font: F_DISPLAY, fill: PINK, anchor: "middle" });
    });
    inner += lines(16, 196, ["Hetzelfde plaatje is altijd hetzelfde getal.", "Begin bij de bovenste som. Die is het makkelijkst!"], 4.6, 6.4);
    inner += '<rect x="16" y="214" width="178" height="56" rx="3" fill="' + CREAM + '" stroke="' + INK + '" stroke-width="0.5"/>' +
      txt(22, 224, "De code van de eierfabriek:", 4.6, { weight: 800 });
    ["haas", "ei", "kuiken"].forEach(function (p, i) {
      var x = 70 + i * 40;
      inner += PICS[p](x, 243) +
        '<rect x="' + (x + 9) + '" y="236" width="12" height="13" rx="1.5" fill="#fff" stroke="' + INK + '" stroke-width="0.5"/>';
    });
    return frame(3, "De weegschaal van de fabriek", ["De deur van de eierfabriek zit op slot. De code zit in deze plaatjessommen.", "Reken uit hoeveel elk plaatje waard is."], inner);
  }

  // ------------------------------------------------------------------ envelope 4: the garden map
  var COLS = "ABCDEF";
  var FIXED = { "C2": "8", "F5": "1", "A4": "4", "D1": "6" };
  function sheet4() {
    var cs = 21, x0 = 50, y0 = 70, inner = "", rand = S.rng(4042027);
    inner += '<rect x="' + x0 + '" y="' + y0 + '" width="' + (6 * cs) + '" height="' + (6 * cs) + '" fill="#e7f6dc" stroke="' + INK + '" stroke-width="0.8"/>';
    for (var c = 0; c < 6; c++) inner += txt(x0 + c * cs + cs / 2, y0 - 3, COLS[c], 6, { font: F_DISPLAY, anchor: "middle" });
    for (var r = 0; r < 6; r++) inner += txt(x0 - 6, y0 + r * cs + cs / 2 + 2.2, String(r + 1), 6, { font: F_DISPLAY, anchor: "middle" });
    for (var rr = 0; rr < 6; rr++) for (var cc = 0; cc < 6; cc++) {
      var x = x0 + cc * cs, y = y0 + rr * cs, key = COLS[cc] + (rr + 1);
      var digit = FIXED[key] || String(Math.floor(rand() * 10));
      inner += '<rect x="' + x + '" y="' + y + '" width="' + cs + '" height="' + cs + '" fill="none" stroke="#9cc79a" stroke-width="0.4"/>';
      inner += '<g transform="translate(' + (x + cs / 2) + " " + (y + cs / 2) + ') rotate(' + Math.floor(rand() * 30 - 15) + ')"><path d="' + eggPath(7.5) + '" fill="#fff" stroke="' + INK + '" stroke-width="0.5"/></g>' +
        txt(x + cs / 2, y + cs / 2 + 2.6, digit, 7, { font: F_DISPLAY, fill: PINK, anchor: "middle" });
    }
    // the chick's note with the coordinates
    inner += '<g transform="rotate(-2 105 222)"><rect x="34" y="208" width="142" height="26" rx="2" fill="#fffdf6" stroke="' + INK + '" stroke-width="0.5"/>' +
      txt(40, 217, "Mijn verstopte eieren:", 4.4, { weight: 800 }) +
      txt(105, 229, "D1   C2   A4   F5", 8, { font: F_DISPLAY, anchor: "middle" }) + "</g>";
    inner += lines(16, 244, ["Voorbeeld: B3 betekent: kolom B, en dan rij 3."], 4.2, 5.8);
    inner += S.answerBox(260, 4, "Het cijfer op elk ei, op volgorde:", { x: 122 });
    return frame(4, "De kaart van de tuin", ["Het kuiken tekende waar het zijn eieren verstopt. Zoek elk vakje op", "de kaart op en schrijf het cijfer op dat erop staat."], inner);
  }

  Missie.start({
    key: "paasei",
    answers: ["256", "PIEP", "523", "6841"],
    steps: [
      {
        title: "De eieren-sudoku",
        text: "Open envelop 1. In elke rij, elke kolom en elk vak van vier hoort elke soort ei één keer. Zoek uit welk ei bij A, B en C hoort. De sleutel zegt welk cijfer dat is.",
        mode: "numeric",
        hints: [
          "Begin bij een rij of kolom waar al drie eieren in staan of bijna. Welk ei mist daar nog?",
          "Ei A heeft strepen, dus het eerste cijfer is een 2. Zoek B en C nu zelf."
        ],
        solved: "In het lege eierdoosje liggen gele donsveertjes. En een briefje...",
        why: "A heeft strepen (2), B heeft hartjes (5) en C heeft stippen (6)."
      },
      {
        title: "De spiegelbrief",
        text: "Open envelop 2. De dief schreef een briefje in spiegelschrift. Houd het vel voor een spiegel of tegen het raam. Het laatste woord is de code.",
        mode: "text",
        hints: [
          "Heb je geen spiegel? Houd het vel tegen het raam en lees het van de achterkant.",
          "Het briefje is ondertekend met een geluid dat een heel klein vogeltje maakt."
        ],
        solved: "PIEP! De dief is een kuiken. Het wil het gouden ei warm houden tot het uitkomt!",
        why: "Het briefje zegt: HALLO SPEURDERS! IK HEB HET GOUDEN EI. IK HOUD HET LEKKER WARM TOT HET UITKOMT. DE CODE IS PIEP."
      },
      {
        title: "De weegschaal van de fabriek",
        text: "Open envelop 3. Reken uit hoeveel elk plaatje waard is. Vul de code in: eerst de haas, dan het ei, dan het kuiken.",
        mode: "numeric",
        hints: [
          "Begin bij de bovenste som. Twee eieren samen zijn 4. Hoeveel is één ei?",
          "Een ei is 2, dus de haas is 5. Twee kuikens en de haas samen zijn 11."
        ],
        solved: "De deur van de fabriek gaat open. Op de grond ligt een kaart van de tuin.",
        why: "Ei = 2 (2 + 2 = 4). Haas = 5 (5 + 2 = 7). Kuiken = 3 (5 + 3 + 3 = 11). De code is haas, ei, kuiken: 5 2 3."
      },
      {
        title: "De kaart van de tuin",
        text: "Open envelop 4. Het kuiken schreef op waar het zijn eieren verstopt. Zoek elk vakje op de kaart op en schrijf de cijfers op, in dezelfde volgorde als op het briefje.",
        mode: "numeric",
        hints: [
          "De letter zegt welke kolom, het cijfer zegt welke rij. Ga met je ene vinger naar de letter en met je andere naar het cijfer.",
          "Op D1 staat een 6. Zoek C2, A4 en F5 nu zelf."
        ],
        why: "D1 = 6, C2 = 8, A4 = 4 en F5 = 1."
      }
    ],
    defaults: { name: "Lotte", minutes: 45, place2: "bij de plantenbak", place3: "onder de deurmat", place4: "in de broodtrommel", ei: "in de wasmand" },
    fields: [
      { key: "place2", label: "Waar verstop je envelop 2?", ph: "bijv. bij de plantenbak" },
      { key: "place3", label: "Waar verstop je envelop 3?", ph: "bijv. onder de deurmat" },
      { key: "place4", label: "Waar verstop je envelop 4?", ph: "bijv. in de broodtrommel" },
      { key: "ei", label: "Waar verstop je het gouden ei (of de paaseitjes)?", ph: "bijv. in de wasmand" }
    ],
    intro: {
      stamp: "Alarm",
      eyebrow: "Eierfabriek van de Paashaas",
      title: "Het<br>Paasei-<br>alarm",
      body: function (setup, esc) {
        return '<p class="lead">Tuut tuut! In de eierfabriek is het gouden paasei verdwenen. En dat ei is voor het paasfeest van <strong>' + esc(setup.name) + "</strong>!</p>" +
          "<p>De Paashaas heeft jullie hulp nodig. Los vier raadsels op, vind de dief en breng het gouden ei terug. Jullie hebben " + esc(setup.minutes) + " minuten, dan begint de paaseierenjacht.</p>";
      },
      needs: "Jullie hebben nodig: envelop 1 (die krijgen jullie van de spelleider), een pen en een spiegel. Een raam werkt ook."
    },
    timeUp: { title: "De Paashaas wordt ongeduldig!", text: "Snel, eierspeurders." },
    found: "Goed zo, eierspeurders!",
    done: {
      title: "Ei gevonden!",
      lead: function (setup, esc) { return 'Het gouden ei ligt <strong class="place">' + esc(setup.ei) + "</strong>."; },
      small: "Het kuiken zat er de hele tijd op te broeden. Het dacht dat het zijn eigen ei was! De Paashaas is weer blij."
    },
    diploma: {
      eyebrow: "Eierfabriek · Diploma",
      title: "Officiële Eierspeurders",
      line: function (setup, esc) { return 'Op het paasfeest van <span class="d-name">' + esc(setup.name) + "</span><br>hebben deze speurders het gouden paasei teruggevonden."; },
      seal: "Goed<br>gedaan"
    },
    parent: {
      title: "Zo zet je Het Paasei-alarm klaar",
      intro: "Een escaperoom voor Pasen, thuis of in de tuin. De kinderen lossen vier raadsels op papier op en vullen de codes in op deze pagina. Na elke goede code vertelt de pagina waar de volgende envelop ligt. Na de laatste code vinden ze het gouden ei.",
      facts: ["6 tot 10 jaar", "2 tot 8 kinderen", "ongeveer 45 minuten", "15 minuten voorbereiden"],
      formTitle: "Jullie paasfeest",
      nameLabel: "Voor wie is het feest?",
      prep: [
        "Print de vier puzzelvellen hieronder, op A4. Kleur is het mooist, want dan zie je de eieren beter.",
        "Stop elk vel in een eigen envelop en zet het nummer erop.",
        "Het gouden ei: een groot chocolade-ei in goudpapier, of een plastic ei vol paaseitjes."
      ],
      finalPrep: "Het gouden ei verstop je",
      lastPrep: "Leg pennen en een spiegel klaar. Geef de kinderen envelop 1 en deze telefoon op Spelen.",
      tip: "Tip: de sudoku is voor zesjarigen lastig. Help ze dan met de eerste rij: welk ei mist daar nog? Bij mooi weer kun je de enveloppen ook in de tuin verstoppen."
    },
    sheets: function () {
      return [
        ["Envelop 1 · eieren-sudoku", sheet1()],
        ["Envelop 2 · spiegelbrief", sheet2()],
        ["Envelop 3 · plaatjessommen", sheet3()],
        ["Envelop 4 · kaart van de tuin", sheet4()]
      ];
    }
  });
})();
