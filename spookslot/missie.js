/* Het Spookslot: Halloween, 8 tot 12 jaar. Draait op de spelmotor in ../assets/missie.js. */
(function () {
  "use strict";
  var S = Missie.svg, txt = S.txt, lines = S.lines;
  var INK = S.INK, SOFT = S.SOFT, F_DISPLAY = S.F_DISPLAY, F_TYPE = S.F_TYPE;
  var ORANGE = "#e8701a", PURPLE = "#5b3f9e", PARCH = "#f6ecd2", GHOST = "#eef3ff";
  var STYLE = { header: "HET SPOOKSLOT · VERVLOEKT DOSSIER", footer: "Het Spookslot", accent: ORANGE, stamp: "GEVAAR" };
  function frame(n, title, intro, inner) { return S.frame(STYLE, n, title, intro, inner); }
  var ABC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  // ------------------------------------------------------------------ envelope 1: sliding alphabet cipher
  function shift(s, k) { return s.replace(/[A-Z]/g, function (c) { return ABC[(ABC.indexOf(c) + k) % 26]; }); }
  function strip(x, y, label, fill) {
    var cw = 6.5, o = txt(x, y - 2.5, label, 3.8, { font: F_TYPE, fill: SOFT });
    o += '<rect x="' + (x - 1.5) + '" y="' + (y - 0.5) + '" width="' + (26 * cw + 3) + '" height="10" fill="none" stroke="' + SOFT + '" stroke-width="0.4" stroke-dasharray="1.6 1.2"/>';
    for (var i = 0; i < 26; i++) {
      o += '<rect x="' + (x + i * cw) + '" y="' + (y + 1) + '" width="' + cw + '" height="7" fill="' + fill + '" stroke="' + INK + '" stroke-width="0.35"/>' +
        txt(x + i * cw + cw / 2, y + 6.3, ABC[i], 4.4, { font: F_TYPE, anchor: "middle" });
    }
    return o;
  }
  function sheet1() {
    var secret = shift("STEEK DE KAARS AAN", 3), sign = shift("BOE", 3), inner = "";
    inner += '<g transform="rotate(-1.2 105 100)"><rect x="22" y="64" width="166" height="62" rx="2" fill="' + PARCH + '" stroke="' + INK + '" stroke-width="0.5"/>' +
      txt(105, 80, "Een briefje, gekrast in de muur van de hal:", 4.4, { anchor: "middle", fill: SOFT }) +
      txt(105, 99, secret, 10, { font: F_DISPLAY, anchor: "middle", ls: 1.4 }) +
      txt(178, 118, sign, 7, { font: F_DISPLAY, anchor: "end", fill: ORANGE, ls: 1 }) + "</g>";
    inner += lines(16, 140, ["Het spook schrijft altijd BOE onder zijn briefjes. Maar hier staat " + sign + ".", "Elke letter is dus een paar plekken in het alfabet opgeschoven!"], 4.4, 6);
    inner += '<rect x="16" y="156" width="178" height="68" rx="3" fill="#fff" stroke="' + INK + '" stroke-width="0.5"/>' +
      txt(22, 166, "DE ONTCIJFERAAR", 6, { font: F_DISPLAY, fill: ORANGE });
    inner += strip(20.5, 176, "strook 1: geheimschrift (blijft liggen)", "#fde3c8") + strip(20.5, 197, "strook 2: gewone letters (knip uit en schuif)", "#e6dcf7");
    inner += lines(22, 216, ["Leg strook 2 onder strook 1. Schuif hem tot onder E-R-H de letters B-O-E staan."], 4, 5);
    inner += S.answerBox(244, 5, "Het laatste woord is de code:", { x: 112, fill: "#f3ecff" });
    inner += txt(105, 270, "Onder elke letter van het geheimschrift staat nu de echte letter.", 3.8, { anchor: "middle", fill: SOFT });
    return frame(1, "Het geheimschrift in de hal", ["Op de muur van de hal staat een briefje in geheimschrift.", "Knip strook 2 uit en gebruik de ontcijferaar om het te lezen."], inner);
  }

  // ------------------------------------------------------------------ envelope 2: logic grid, four ghosts in four rooms
  var GHOSTS = [["Bleke Bob", "bob"], ["Kille Kate", "kate"], ["Rammel Rik", "rik"], ["Zuchtende Zoë", "zoe"]];
  var ROOMS = [["Kelder", "3"], ["Bibliotheek", "5"], ["Toren", "7"], ["Zolder", "9"]];
  function ghost(kind, x, y, s) {
    var g = '<g transform="translate(' + x + " " + y + ") scale(" + s + ')" stroke="' + INK + '" stroke-width="0.7" stroke-linejoin="round" stroke-linecap="round">' +
      '<path d="M-8 10 V-2 A8 8 0 0 1 8 -2 V10 L5.3 7.6 L2.7 10 L0 7.6 L-2.7 10 L-5.3 7.6 Z" fill="' + GHOST + '"/>' +
      '<ellipse cx="-3" cy="-1.5" rx="1.3" ry="1.8" fill="' + INK + '" stroke="none"/><ellipse cx="3" cy="-1.5" rx="1.3" ry="1.8" fill="' + INK + '" stroke="none"/>';
    if (kind === "bob") g += '<circle cx="-3" cy="-1.5" r="2.6" fill="none"/><circle cx="3" cy="-1.5" r="2.6" fill="none"/><path d="M-0.4 -1.5 H0.4"/><path d="M-2 3.5 Q0 4.8 2 3.5" fill="none"/>';
    else if (kind === "kate") g += '<path d="M-6 -7 L-3 -13 L0 -8 L3 -13 L6 -7" fill="#bfe4ff"/><path d="M-1.6 3.5 H1.6" />';
    else if (kind === "rik") g += '<path d="M-2 3.4 Q0 2.2 2 3.4" fill="none"/><path d="M8 4 q4 0 4 3 q0 3 4 3" fill="none" stroke-dasharray="1.2 0.8" stroke-width="1"/>';
    else g += '<ellipse cx="0" cy="4" rx="1.5" ry="1.8" fill="' + INK + '" stroke="none"/><path d="M-8 -1 q-4 -2 -6 1 M-8 1 q-4 0 -5 3" fill="none" stroke-width="0.5"/>';
    return g + "</g>";
  }
  function sheet2() {
    var inner = "";
    GHOSTS.forEach(function (gh, k) {
      var x = 30 + k * 44;
      inner += ghost(gh[1], x, 76, 1) + txt(x, 95, gh[0], 4, { anchor: "middle", weight: 800 });
    });
    inner += '<rect x="16" y="102" width="178" height="58" rx="3" fill="' + PARCH + '" stroke="' + INK + '" stroke-width="0.5"/>' +
      txt(22, 112, "WAT DE OUDE BUTLER WEET", 5.4, { font: F_DISPLAY, fill: ORANGE }) +
      lines(22, 121, [
        "1. Rammel Rik sleept zijn kettingen door de kelder.",
        "2. Kille Kate spookt niet in de toren en niet op de zolder.",
        "3. Zuchtende Zoë zit niet in de toren, want daar woont een vleermuis.",
        "4. In elke kamer woont precies één spook."
      ], 4.3, 9);
    // the grid: ghosts down, rooms across
    var gx = 64, gy = 176, cw = 30, ch = 11;
    ROOMS.forEach(function (r, k) {
      inner += txt(gx + k * cw + cw / 2, gy - 6.5, r[0], 3.8, { anchor: "middle", weight: 800 }) + txt(gx + k * cw + cw / 2, gy - 1.5, "kamer " + r[1], 3.4, { anchor: "middle", fill: SOFT });
    });
    GHOSTS.forEach(function (gh, r) {
      inner += txt(gx - 3, gy + r * ch + 7.2, gh[0], 4, { anchor: "end", weight: 800 });
      for (var c = 0; c < 4; c++) inner += '<rect x="' + (gx + c * cw) + '" y="' + (gy + r * ch) + '" width="' + cw + '" height="' + ch + '" fill="#fff" stroke="' + INK + '" stroke-width="0.5"/>';
    });
    inner += txt(gx, gy + 4 * ch + 6, "Zet een X als het niet kan en een rondje als het klopt.", 3.8, { fill: SOFT });
    inner += S.answerBox(250, 4, "Kamernummers van Bob, Kate, Rik, Zoë:", { x: 124, fill: "#f3ecff", under: ["Bob", "Kate", "Rik", "Zoë"] });
    return frame(2, "Vier spoken, vier kamers", ["In het slot wonen vier spoken. Maar wie woont in welke kamer?", "Gebruik wat de butler weet en vul het rooster in."], inner);
  }

  // ------------------------------------------------------------------ envelope 3: the magic graveyard (magic square)
  var SQUARE = [[2, 7, 6], [9, 5, 1], [4, 3, 8]];
  var SHOWN = { "0,0": 1, "0,1": 1, "1,1": 1 };
  var SIGNS = { "2,1": "schedel", "1,0": "vleermuis", "0,2": "pompoen" };
  function sign(kind, x, y) {
    var o = '<g transform="translate(' + x + " " + y + ')" stroke="' + INK + '" stroke-width="0.5" stroke-linejoin="round">';
    if (kind === "schedel") o += '<path d="M-4 1 A4.4 4.4 0 1 1 4 1 V3.6 H-4 Z" fill="#fff"/><circle cx="-1.6" cy="-0.6" r="1.1" fill="' + INK + '"/><circle cx="1.6" cy="-0.6" r="1.1" fill="' + INK + '"/><path d="M-1.4 3.6 V2.4 M0 3.6 V2.4 M1.4 3.6 V2.4"/>';
    else if (kind === "vleermuis") o += '<path d="M0 -1.6 C-2 -4 -4 -3 -6.6 -3.4 C-5.4 -1.6 -5.6 0.4 -6.4 1.6 C-4.4 0.6 -3 1.4 -2 3 C-1.4 1.6 1.4 1.6 2 3 C3 1.4 4.4 0.6 6.4 1.6 C5.6 0.4 5.4 -1.6 6.6 -3.4 C4 -3 2 -4 0 -1.6 Z" fill="' + PURPLE + '"/>';
    else o += '<path d="M0 -4.6 V-6" stroke-width="1" stroke="#3d7a3a"/><ellipse cx="-2" cy="0" rx="3.4" ry="4.4" fill="' + ORANGE + '"/><ellipse cx="2" cy="0" rx="3.4" ry="4.4" fill="' + ORANGE + '"/><ellipse cx="0" cy="0" rx="2.4" ry="4.6" fill="' + ORANGE + '"/>';
    return o + "</g>";
  }
  function sheet3() {
    var inner = "", sx = 47, sy = 74, cw = 40, chh = 46;
    inner += '<path d="M16 ' + (sy + 3 * chh + 4) + ' H194" stroke="#7aa36a" stroke-width="2"/>';
    for (var r = 0; r < 3; r++) for (var c = 0; c < 3; c++) {
      var x = sx + c * cw, y = sy + r * chh, key = r + "," + c;
      inner += '<path d="M' + (x + 5) + " " + (y + 40) + " V" + (y + 14) + " A15 13 0 0 1 " + (x + 35) + " " + (y + 14) + " V" + (y + 40) + ' Z" fill="#dcd8e6" stroke="' + INK + '" stroke-width="0.6"/>' +
        '<path d="M' + (x + 2) + " " + (y + 40) + " H" + (x + 38) + '" stroke="#5f8a55" stroke-width="1.6"/>';
      if (SHOWN[key]) inner += txt(x + 20, y + 32, String(SQUARE[r][c]), 13, { font: F_DISPLAY, anchor: "middle" });
      else inner += '<rect x="' + (x + 12) + '" y="' + (y + 19) + '" width="16" height="16" rx="2" fill="#fff" stroke="' + INK + '" stroke-width="0.4" stroke-dasharray="1.4 1"/>';
      if (SIGNS[key]) inner += sign(SIGNS[key], x + 20, y + 10);
    }
    inner += '<rect x="16" y="220" width="178" height="22" rx="3" fill="' + PARCH + '" stroke="' + INK + '" stroke-width="0.5"/>' +
      lines(22, 229, ["Op het hek staat: elk getal van 1 tot en met 9 staat er één keer. Tel je een rij,", "een kolom of een schuine lijn op, dan krijg je altijd 15."], 4, 5.6);
    inner += '<rect x="16" y="248" width="178" height="28" rx="3" fill="#f3ecff" stroke="' + INK + '" stroke-width="0.5"/>' + txt(22, 258, "De code:", 4.6, { weight: 800 });
    ["schedel", "vleermuis", "pompoen"].forEach(function (k, i) {
      var x = 102 + i * 30;
      inner += sign(k, x, 262) + '<rect x="' + (x + 8) + '" y="255" width="12" height="13" rx="1.5" fill="#fff" stroke="' + INK + '" stroke-width="0.5"/>';
    });
    return frame(3, "Het toverkerkhof", ["Op het kerkhof achter het slot staan negen grafstenen. Op sommige", "ontbreekt het getal. Vul ze in. Welke getallen staan onder de tekens?"], inner);
  }

  // ------------------------------------------------------------------ envelope 4: morse code knocks
  var MORSE = { A: ".-", B: "-...", C: "-.-.", D: "-..", E: ".", F: "..-.", G: "--.", H: "....", I: "..", J: ".---", K: "-.-", L: ".-..", M: "--",
    N: "-.", O: "---", P: ".--.", Q: "--.-", R: ".-.", S: "...", T: "-", U: "..-", V: "...-", W: ".--", X: "-..-", Y: "-.--", Z: "--.." };
  function morse(code, x, y, dot, gap) {
    var o = "";
    code.split("").forEach(function (m) {
      if (m === ".") { o += '<circle cx="' + (x + dot / 2) + '" cy="' + y + '" r="' + (dot / 2) + '" fill="' + INK + '"/>'; x += dot + gap; }
      else { o += '<rect x="' + x + '" y="' + (y - dot / 2) + '" width="' + (dot * 3) + '" height="' + dot + '" rx="' + (dot / 2) + '" fill="' + INK + '"/>'; x += dot * 3 + gap; }
    });
    return o;
  }
  function sheet4() {
    var inner = '<rect x="16" y="64" width="178" height="52" rx="3" fill="' + PARCH + '" stroke="' + INK + '" stroke-width="0.5"/>' +
      txt(105, 74, "Het spook klopt op de muur. Klop-klop, kloooop...", 4.4, { anchor: "middle", fill: SOFT });
    var word = "VRIJ";
    word.split("").forEach(function (ch, k) {
      var x = 26 + k * 42;
      inner += '<rect x="' + (x - 3) + '" y="80" width="38" height="26" rx="3" fill="#fff" stroke="' + INK + '" stroke-width="0.4"/>' +
        morse(MORSE[ch], x + 0.5, 90, 2.8, 1.6) + txt(x + 16, 102, "letter " + (k + 1), 3.4, { anchor: "middle", fill: SOFT });
    });
    inner += txt(16, 128, "HET KLOPALFABET", 7, { font: F_DISPLAY, fill: ORANGE });
    inner += txt(16, 135, "Een rondje is een korte klop. Een streep is een lange klop.", 4, { fill: SOFT });
    ABC.split("").forEach(function (ch, k) {
      var col = Math.floor(k / 9), row = k % 9, x = 22 + col * 60, y = 146 + row * 10.4;
      inner += txt(x, y + 1.6, ch, 5, { font: F_DISPLAY }) + morse(MORSE[ch], x + 8, y, 2.4, 1.4);
    });
    inner += S.answerBox(252, 4, "Het woord dat de vloek breekt:", { x: 122, fill: "#f3ecff" });
    return frame(4, "Het klopalfabet", ["Het spook kan niet praten, alleen kloppen. Elke letter heeft een eigen", "klopje. Zoek elke letter op in het klopalfabet."], inner);
  }

  Missie.start({
    key: "spookslot",
    // the colours of this mission page; see the :root block in ../assets/missie.css for every name
    kleuren: { night: "#120d1f", card: "#1f1733", line: "#3d2f5f", cream: "#f4efff", muted: "#b9addb", red: "#ff5a67", yellow: "#ff9f1c", mint: "#a6f5c9", onYellow: "#120d1f", glow: "rgba(166, 245, 201, 0.10)", btnShadow: "#b35f00", diplomaRand: "#ffd29a", diplomaLijn: "#b35f00", diplomaTitel: "#5b3f9e", zegel: "#e8701a" },
    answers: ["KAARS", "7539", "396", "VRIJ"],
    steps: [
      {
        title: "Het geheimschrift in de hal",
        text: "Open envelop 1. Op de muur staat een briefje in geheimschrift. Knip strook 2 uit en schuif hem onder strook 1 tot het goed staat. Het laatste woord is de code.",
        mode: "text",
        hints: [
          "Het spook schrijft altijd BOE onder zijn briefjes. Hier staat ERH. Schuif strook 2 tot onder de E een B staat.",
          "Elke letter is 3 plekken opgeschoven: een D betekent A, een N betekent K. Het laatste woord heeft 5 letters."
        ],
        solved: "Jullie steken de kaars aan. In het flakkerende licht zien jullie vier spoken door de gang zweven...",
        why: "Het geheimschrift VWHHN GH NDDUV DDQ betekent STEEK DE KAARS AAN. Elke letter is 3 plekken opgeschoven."
      },
      {
        title: "Vier spoken, vier kamers",
        text: "Open envelop 2. Zoek uit welk spook in welke kamer woont. De code zijn de kamernummers van Bob, Kate, Rik en Zoë, in die volgorde.",
        mode: "numeric",
        hints: [
          "Rik zit in de kelder, dat is zeker. Kate kan dus maar in één kamer zitten. Welke?",
          "Kate zit in de bibliotheek (5). Zoë mag niet in de toren, dus zij zit op de zolder."
        ],
        solved: "De spoken wijzen naar de achterdeur. Die gaat open, naar het kerkhof...",
        why: "Rik zit in de kelder (3). Kate kan niet in de toren of op de zolder, dus zij zit in de bibliotheek (5). Zoë zit niet in de toren, dus op de zolder (9). Bob zit in de toren (7). Bob, Kate, Rik, Zoë: 7 5 3 9."
      },
      {
        title: "Het toverkerkhof",
        text: "Open envelop 3. Vul de grafstenen in: elk getal van 1 tot en met 9 één keer, en elke rij, kolom en schuine lijn telt op tot 15. De code is schedel, vleermuis, pompoen.",
        mode: "numeric",
        hints: [
          "De bovenste rij heeft al een 2 en een 7. Wat moet erbij om 15 te krijgen?",
          "De pompoen is 6. Kijk dan naar de schuine lijn van links boven naar rechts onder: 2 + 5 + ? = 15."
        ],
        solved: "Achter het kerkhof hoor je iets. Klop. Klop. Kloooop...",
        why: "De oplossing is 2 7 6 / 9 5 1 / 4 3 8. De schedel is 3, de vleermuis is 9 en de pompoen is 6."
      },
      {
        title: "Het klopalfabet",
        text: "Open envelop 4. Het spook klopt een woord op de muur. Zoek elk klopje op in het klopalfabet. Dat woord breekt de vloek.",
        mode: "text",
        hints: [
          "Tel bij elke letter de korte en lange klopjes, en zoek in het alfabet de letter met precies dezelfde klopjes.",
          "De eerste letter is een V (kort kort kort lang). Het woord betekent: niet meer opgesloten."
        ],
        why: "V (...-), R (.-.), I (..) en J (.---): VRIJ."
      }
    ],
    defaults: { name: "Daan", minutes: 60, place2: "achter de gordijnen", place3: "in de badkamer", place4: "onder het bed", schat: "in de kast onder de trap" },
    fields: [
      { key: "place2", label: "Waar verstop je envelop 2?", ph: "bijv. achter de gordijnen" },
      { key: "place3", label: "Waar verstop je envelop 3?", ph: "bijv. in de badkamer" },
      { key: "place4", label: "Waar verstop je envelop 4?", ph: "bijv. onder het bed" },
      { key: "schat", label: "Waar verstop je de schat (het snoep)?", ph: "bijv. in de kast onder de trap" }
    ],
    intro: {
      stamp: "Gevaar",
      eyebrow: "Vervloekt dossier · 31 oktober",
      title: "Het<br>Spookslot",
      body: function (setup, esc) {
        return '<p class="lead">In het oude slot zit Spook Wiebe al honderd jaar opgesloten door een vloek. Vannacht, op het feest van <strong>' + esc(setup.name) + "</strong>, kan de vloek gebroken worden.</p>" +
          "<p>Maar alleen door slimme spokenjagers. Los vier raadsels op en vind het woord dat de vloek breekt. Jullie hebben " + esc(setup.minutes) + " minuten, dan slaat de klok middernacht.</p>";
      },
      needs: "Jullie hebben nodig: envelop 1 (die krijgen jullie van de spelleider), een pen en een schaar. Een zaklamp is extra spannend."
    },
    timeUp: { title: "De klok slaat middernacht!", text: "Snel, spokenjagers. Spook Wiebe rekent op jullie." },
    found: "Goed zo, spokenjagers!",
    done: {
      title: "Vloek gebroken!",
      lead: function (setup, esc) { return 'Spook Wiebe is vrij! Als dank vertelt hij waar de schat van het slot ligt: <strong class="place">' + esc(setup.schat) + "</strong>."; },
      small: "Boe! Dat betekent in spokentaal: dank je wel."
    },
    diploma: {
      eyebrow: "Het Spookslot · Oorkonde",
      title: "Officiële Vloekbrekers",
      line: function (setup, esc) { return 'Op het feest van <span class="d-name">' + esc(setup.name) + "</span><br>hebben deze spokenjagers Spook Wiebe bevrijd."; },
      seal: "Boe!<br>Dank je"
    },
    parent: {
      title: "Zo zet je Het Spookslot klaar",
      intro: "Een escaperoom voor Halloween of een griezelfeestje thuis, voor wat oudere kinderen. Het is spannend, maar niet eng. De kinderen lossen vier raadsels op papier op en vullen de codes in op deze pagina. Na de laatste code is het spook vrij en vinden ze de schat.",
      formTitle: "Jullie griezelfeest",
      nameLabel: "Naam van de jarige of het feest",
      prep: [
        "Print de vier puzzelvellen hieronder, op A4. Kleur mag, zwart-wit kan ook.",
        "Stop elk vel in een eigen envelop en zet het nummer erop.",
        "Maak het huis een beetje donker: gordijnen dicht en een paar zaklampen of lichtjes. Dat maakt het spannender."
      ],
      finalPrep: "De schat (snoep of kleine cadeautjes) verstop je",
      lastPrep: "Leg pennen en een schaar klaar. Geef de kinderen envelop 1 en deze telefoon op Spelen.",
      tip: "Tip: het rooster bij envelop 2 en het kerkhof bij envelop 3 zijn echte denkpuzzels. Laat de kinderen samen overleggen en wijs ze op de hints."
    },
    sheets: function () {
      return [
        ["Envelop 1 · geheimschrift", sheet1()],
        ["Envelop 2 · vier spoken", sheet2()],
        ["Envelop 3 · toverkerkhof", sheet3()],
        ["Envelop 4 · klopalfabet", sheet4()]
      ];
    }
  });

  // for testing: the cipher and morse must say what the answers claim
  window.__spook = { secret: shift("STEEK DE KAARS AAN", 3), morse: "VRIJ".split("").map(function (c) { return MORSE[c]; }).join(" ") };
})();
