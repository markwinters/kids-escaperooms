# Feestmissie

Escaperooms voor kinderfeestjes, die ouders zelf printen. De ouders printen de puzzels en verstoppen ze in huis. De kinderen spelen de missie op een telefoonpagina met een timer, hints en een digitaal codeslot.

## Pagina's

- `index.html`: de homepage. Hier staat hoe het werkt, wat je krijgt, de missies en de vragen van ouders. Alles is gratis.
- `taartrover/index.html`: **De Taartrover**, een missie die je helemaal kunt spelen (7 tot 10 jaar, 45 minuten).
  - **Spelen**: de timer, het codeslot, twee hints per puzzel, de verstopplek van de volgende envelop en aan het eind een diploma.
  - **Voor ouders** (`#ouders`): de naam van de jarige en de verstopplekken, de voorbereiding, de antwoorden en de vier puzzelvellen. Met de printknop krijg je één A4-vel per pagina.
- `mijter/index.html`: **De Verdwenen Mijter**, de Sinterklaasmissie (5 tot 9 jaar, 45 minuten). De mijter van de Sint is weg, en een ekster blijkt de dief.
  1. Het pepernotenspoor: een doolhof. De cijfers op de route zijn de code `528`.
  2. Kleur de pepernoten: wie de goede hokjes inkleurt, ziet de code `631`.
  3. Het rijmpje van de Sint: kies bij elk gat het plaatje dat rijmt. Dat geeft de code `GOUD`.
  4. De pakjes van de ekster: knip de pakjes uit en zet ze van laag naar hoog. Dat geeft de code `4172`.
- `paasei/index.html`: **Het Paasei-alarm**, de paasmissie (6 tot 10 jaar, 45 minuten). Het gouden ei is weg uit de eierfabriek. De dief blijkt een kuiken dat erop wil broeden.
  1. De eieren-sudoku: een sudoku van 4 bij 4 met eieren. Met de sleutel geeft dat de code `256`.
  2. De spiegelbrief: een brief in spiegelschrift. De code is `PIEP`.
  3. De weegschaal van de fabriek: plaatjessommen, met als code `523`.
  4. De kaart van de tuin: coördinaten op een kaart, met als code `6841`.
- `spookslot/index.html`: **Het Spookslot**, de Halloweenmissie (8 tot 12 jaar, 60 minuten). Spook Wiebe zit opgesloten door een vloek.
  1. Het geheimschrift in de hal: een schuifalfabet om uit te knippen. De code is `KAARS`.
  2. Vier spoken, vier kamers: een logicapuzzel met een rooster, met als code `7539`.
  3. Het toverkerkhof: een magisch vierkant, met als code `396`.
  4. Het klopalfabet: morsecode, met als code `VRIJ`.

## Zo is het gebouwd

- `assets/missie.js` is de spelmotor. Die doet de timer, het codeslot, de hints, de verstopplekken, het diploma, de pagina voor ouders en het printen.
- `assets/missie.css` is de gedeelde opmaak. Een missie kan de kleuren aanpassen met CSS-variabelen.
- Elke missie heeft een eigen map met een `index.html` en een `missie.js`. Daarin staan het verhaal, de codes, de hints en de puzzelvellen (SVG in millimeters, A4). Een nieuwe missie maken is dus: kopieer een map en vervang de inhoud.

Het is een statische site zonder build-stap en zonder afhankelijkheden. De instellingen en de voortgang bewaart de browser in `localStorage`.

## Lokaal bekijken

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Online zetten

Zet GitHub Pages aan voor deze repository (Settings → Pages → *Deploy from a branch*, root). Je kunt ook elke andere statische host gebruiken, zoals Netlify of Cloudflare Pages.

## Nog te doen

- De puzzelvellen ook als PDF aanbieden.
- De drie nieuwe missies testen met echte kinderen: De Verdwenen Mijter, Het Paasei-alarm en Het Spookslot.
- Meer verjaardagsmissies maken, want die kun je het hele jaar spelen.
