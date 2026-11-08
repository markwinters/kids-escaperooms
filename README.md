# Feestmissie

Escaperooms voor kinderfeestjes, die ouders zelf printen. De ouders printen de puzzels en verstoppen ze in huis. De kinderen spelen de missie op een telefoonpagina met een timer, hints en een digitaal codeslot.

## Pagina's

- `index.html`: de homepage. Hier staat hoe het werkt, wat je krijgt, de missies, de prijs en de vragen van ouders.
- `taartrover/index.html`: **De Taartrover**, een missie die je helemaal kunt spelen (7 tot 10 jaar, 45 minuten).
  - **Spelen**: de timer, het codeslot, twee hints per puzzel, de verstopplek van de volgende envelop en aan het eind een diploma.
  - **Voor ouders** (`#ouders`): de naam van de jarige en de verstopplekken, de voorbereiding, de antwoorden en de vier puzzelvellen. Met de printknop krijg je één A4-vel per pagina.
- `mijter/index.html`: **De Verdwenen Mijter**, de Sinterklaasmissie (5 tot 9 jaar, 45 minuten). De mijter van de Sint is weg, en een ekster blijkt de dief.
  1. Het pepernotenspoor: een doolhof. De cijfers op de route zijn de code `528`.
  2. Kleur de pepernoten: wie de goede hokjes inkleurt, ziet de code `631`.
  3. Het rijmpje van de Sint: kies bij elk gat het plaatje dat rijmt. Dat geeft de code `GOUD`.
  4. De pakjes van de ekster: knip de pakjes uit en zet ze van laag naar hoog. Dat geeft de code `4172`.

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

- Een shop koppelen, bijvoorbeeld Lemon Squeezy, Gumroad of Shopify met digitale downloads. Nu staat er "De shop gaat binnenkort open".
- De puzzelvellen ook als PDF aanbieden.
- De missies Spookslot en Paasei-alarm maken.
- De Verdwenen Mijter testen met echte kinderen van 5 tot 9 jaar.
