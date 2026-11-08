/*
 * SJABLOON VOOR EEN NIEUWE MISSIE
 *
 * Maak een nieuwe missie met:  node tools/nieuwe-missie.js <map> "<Titel>"
 * Dat kopieert deze map en vult de naam in. Daarna vervang je hieronder:
 *   1. de codes (answers) en de vier raadsels (steps)
 *   2. de verstopplekken (fields en defaults)
 *   3. het verhaal (intro, done, diploma)
 *   4. de puzzelvellen (sheet1 tot en met sheet4)
 * Controleer daarna met:  node tools/controleer.js
 *
 * Alles wat met S. begint, komt uit de spelmotor (../assets/missie.js):
 *   S.frame(STYLE, n, titel, [regels], inhoud)  een A4-vel met kop, nummer en voettekst
 *   S.txt(x, y, tekst, grootte, { font, fill, anchor, weight })
 *   S.lines(x, y, [regels], grootte, regelafstand)
 *   S.answerBox(y, aantal, "label", { x, under: ["A", "B"] })  een vak om de code in te schrijven
 *   S.rng(getal)  willekeurige getallen die bij elke print hetzelfde zijn
 * Een vel is 210 bij 297 (millimeter). Puzzels passen tussen y = 62 en y = 275.
 */
(function () {
  "use strict";
  var S = Missie.svg, txt = S.txt, lines = S.lines;
  var INK = S.INK, SOFT = S.SOFT, F_DISPLAY = S.F_DISPLAY;
  var ACCENT = "#d43b4a";
  var STYLE = { header: "SJABLOON_TITEL · GEHEIM DOSSIER", footer: "SJABLOON_TITEL", accent: ACCENT };
  function frame(n, title, intro, inner) { return S.frame(STYLE, n, title, intro, inner); }

  // Een leeg vel om mee te beginnen. Vervang dit door je eigen puzzel.
  function placeholder(n, title) {
    var inner = '<rect x="16" y="64" width="178" height="170" rx="3" fill="#fafafa" stroke="' + INK + '" stroke-width="0.5" stroke-dasharray="3 2"/>' +
      txt(105, 146, "Hier komt puzzel " + n, 9, { font: F_DISPLAY, anchor: "middle", fill: SOFT }) +
      txt(105, 158, "Teken hem in sheet" + n + "() in missie.js", 4.6, { anchor: "middle", fill: SOFT });
    inner += S.answerBox(252, 4, "De code is:", { x: 122 });
    return frame(n, title, ["Zet hier in één of twee regels wat de kinderen moeten doen."], inner);
  }
  function sheet1() { return placeholder(1, "Het eerste raadsel"); }
  function sheet2() { return placeholder(2, "Het tweede raadsel"); }
  function sheet3() { return placeholder(3, "Het derde raadsel"); }
  function sheet4() { return placeholder(4, "Het laatste raadsel"); }

  Missie.start({
    // moet precies de naam van de map zijn
    key: "SJABLOON_ID",
    // de kleuren van de pagina; laat weg voor de standaardkleuren (blauw en geel)
    kleuren: { night: "#17153a", card: "#221f52", line: "#3a357c", yellow: "#ffd23f" },
    // één code per raadsel; cijfers, of hoofdletters als mode: "text"
    answers: ["1234", "WOORD", "5678", "9012"],
    steps: [
      {
        title: "Het eerste raadsel",
        text: "Open envelop 1. Zeg hier wat de kinderen moeten doen en wat de code is.",
        mode: "numeric",
        hints: ["Een kleine duw in de goede richting.", "Een grotere hint, bijna het antwoord."],
        // (optioneel) wat de pagina zegt als het slot open is
        solved: "Een stukje verhaal na het eerste slot.",
        // voor ouders: waarom dit het antwoord is
        why: "Leg hier het antwoord uit."
      },
      {
        title: "Het tweede raadsel",
        text: "Open envelop 2. Deze code is een woord.",
        mode: "text",
        hints: ["Eerste hint.", "Tweede hint."],
        why: "Leg hier het antwoord uit."
      },
      {
        title: "Het derde raadsel",
        text: "Open envelop 3.",
        mode: "numeric",
        hints: ["Eerste hint.", "Tweede hint."],
        why: "Leg hier het antwoord uit."
      },
      {
        title: "Het laatste raadsel",
        text: "Open envelop 4.",
        mode: "numeric",
        hints: ["Eerste hint.", "Tweede hint."],
        why: "Leg hier het antwoord uit."
      }
    ],
    // de ouders vullen deze in; de laatste is waar de schat ligt
    defaults: { name: "Sam", minutes: 45, place2: "onder de bank", place3: "in de keuken", place4: "bij de kapstok", schat: "in de wasmand" },
    fields: [
      { key: "place2", label: "Waar verstop je envelop 2?", ph: "bijv. onder de bank" },
      { key: "place3", label: "Waar verstop je envelop 3?", ph: "bijv. in de keuken" },
      { key: "place4", label: "Waar verstop je envelop 4?", ph: "bijv. bij de kapstok" },
      { key: "schat", label: "Waar verstop je de schat?", ph: "bijv. in de wasmand" }
    ],
    intro: {
      stamp: "Geheim",
      eyebrow: "Geheim dossier",
      title: "SJABLOON_TITEL",
      body: function (setup, esc) {
        return '<p class="lead">Het verhaal begint hier, op het feest van <strong>' + esc(setup.name) + "</strong>.</p>" +
          "<p>Los vier raadsels op. Jullie hebben " + esc(setup.minutes) + " minuten.</p>";
      },
      needs: "Jullie hebben nodig: envelop 1 (die krijgen jullie van de spelleider) en een pen."
    },
    timeUp: { title: "De tijd is om!", text: "Snel, speurders." },
    found: "Goed zo, speurders!",
    done: {
      title: "Gelukt!",
      lead: function (setup, esc) { return 'De schat ligt <strong class="place">' + esc(setup.schat) + "</strong>."; },
      small: "Een laatste zinnetje uit het verhaal."
    },
    diploma: {
      eyebrow: "SJABLOON_TITEL · Diploma",
      title: "Officiële Speurders",
      line: function (setup, esc) { return 'Op het feest van <span class="d-name">' + esc(setup.name) + "</span><br>hebben deze speurders de missie opgelost."; },
      seal: "Goed<br>gedaan"
    },
    parent: {
      title: "Zo zet je SJABLOON_TITEL klaar",
      intro: "Leg in een paar zinnen uit waar de missie over gaat.",
      formTitle: "Jullie feest",
      nameLabel: "Naam van de jarige",
      prep: [
        "Print de vier puzzelvellen hieronder, op A4.",
        "Stop elk vel in een eigen envelop en zet het nummer erop."
      ],
      finalPrep: "De schat verstop je",
      lastPrep: "Leg pennen klaar. Geef de kinderen envelop 1 en deze telefoon op Spelen.",
      tip: "Een tip voor de ouders."
    },
    sheets: function () {
      return [
        ["Envelop 1 · korte naam", sheet1()],
        ["Envelop 2 · korte naam", sheet2()],
        ["Envelop 3 · korte naam", sheet3()],
        ["Envelop 4 · korte naam", sheet4()]
      ];
    }
  });
})();
