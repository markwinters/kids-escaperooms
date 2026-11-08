# Een missie toevoegen

Elke missie is een map met drie bestanden, plus één regel in `missies.js`. De spelmotor doet de rest: de timer, het codeslot, de hints, de verstopplekken, het diploma, de pagina voor ouders en het printen.

```
missies.js            de lijst met alle missies (homepage, filters, leeftijd, speeltijd)
kerstdief/
  index.html          de pagina; hoef je niet aan te passen
  missie.js           het verhaal, de codes, de hints en de puzzelvellen
  icoon.svg           het plaatje op de kaart op de homepage (110 bij 100)
```

## In zes stappen

**1. Maak de map aan**

```sh
node tools/nieuwe-missie.js kerstdief "De Kerstdief" Kerst
```

Dit kopieert `_sjabloon/` naar `kerstdief/` en zet de missie in `missies.js`. Hij staat op `zichtbaar: false`, dus hij komt nog niet op de homepage. Via `/kerstdief/` kun je hem wel al openen en testen.

**2. Bedenk de raadsels**

Elk raadsel geeft een code: cijfers, of een woord in hoofdletters (`mode: "text"`). Zet de codes in `answers` en de raadsels in `steps`. Per raadsel heb je dit nodig:

- `title` en `text`: wat de kinderen op de telefoon zien
- `hints`: twee hints, eerst een kleine duw en dan een grotere
- `why`: de uitleg voor ouders
- `solved` (mag je weglaten): een stukje verhaal als het slot opengaat

Vier raadsels is de standaard, maar drie of vijf mag ook. Zorg wel dat er dan evenveel `fields` (verstopplekken) en puzzelvellen zijn.

**3. Teken de puzzelvellen**

In `sheet1()` tot en met `sheet4()` teken je elk A4-vel als SVG, in millimeters (210 bij 297). `S.frame` tekent de kop, het nummer en de voettekst. Jij vult de ruimte tussen y = 62 en y = 275. Handige hulpjes uit de motor:

| Hulpje | Wat het doet |
|---|---|
| `S.txt(x, y, tekst, grootte, { font, fill, anchor, weight })` | één regel tekst |
| `S.lines(x, y, [regels], grootte, afstand)` | meerdere regels |
| `S.answerBox(y, aantal, "label", { x, under })` | een vak met hokjes voor de code |
| `S.rng(getal)` | willekeurige getallen die bij elke print hetzelfde zijn |
| `S.INK`, `S.SOFT`, `S.F_DISPLAY`, `S.F_BODY`, `S.F_TYPE` | standaardkleuren en lettertypes |

Zoek voorbeelden in de bestaande missies: een doolhof (`mijter`), een sudoku (`paasei`), een geheimschrift met knipstroken (`spookslot`) en vingerafdrukken (`taartrover`).

**4. Kies de kleuren en vul de kaart in**

- In `missie.js` zet je bij `kleuren` de kleuren van de pagina. De namen staan bovenaan `assets/missie.css`: `night`, `card`, `line`, `cream`, `muted`, `red`, `yellow`, `mint`, `onYellow`, `glow`, `btnShadow`, `diplomaRand`, `diplomaLijn`, `diplomaTitel` en `zegel`.
- In `missies.js` vul je de leeftijd, het aantal kinderen, de speeltijd, de korte tekst en de twee kaartkleuren in.
- Teken een eigen `icoon.svg`.

**5. Controleer en speel**

```sh
node tools/controleer.js        # snel, zonder browser: klopt alles?
node tools/speeltest.js kerstdief   # speelt de missie echt uit (Playwright nodig)
python3 -m http.server 8000     # en open http://localhost:8000/kerstdief/
```

Klopt er iets niet, dan toont de spelpagina zelf ook een lijst met wat er mis is.

Print de vellen bij "Voor ouders" en controleer of alles op het papier staat. Speel de missie daarna met echte kinderen.

**6. Zet hem online**

Zet `zichtbaar: true` in `missies.js` en push naar `main`. Wil je een label "Nieuw" op de kaart? Zet dan ook `nieuw: true`.

## Goed om te weten

- **De mapnaam is de sleutel.** De naam van de map, de `id` in `missies.js` en de `key` in `missie.js` moeten precies hetzelfde zijn. De browser bewaart de voortgang en de instellingen per sleutel. Verander de sleutel dus niet meer als een missie al online staat.
- **Thema's maken zichzelf.** Gebruik je een nieuw thema, bijvoorbeeld "Kerst"? Dan komt daar vanzelf een filter voor op de homepage. Schrijf het thema wel elke keer precies hetzelfde.
- **Volgorde.** De missies staan op de homepage in dezelfde volgorde als in `missies.js`.
- **De spelmotor is gedeeld.** Pas je iets aan in `assets/missie.js` of `assets/missie.css`, dan verandert dat voor alle missies. Draai daarna `node tools/speeltest.js` om ze allemaal opnieuw te testen.
