# Feestmissie

Escaperooms voor kinderfeestjes, die ouders zelf printen. De ouders printen de puzzels en verstoppen ze in huis. De kinderen spelen de missie op een telefoonpagina met een timer, hints en een digitaal codeslot.

## Pagina's

- `index.html`: de homepage. Hier staat hoe het werkt, wat je krijgt, de missies, de prijs en de vragen van ouders.
- `taartrover/index.html`: **De Taartrover**, een missie die je helemaal kunt spelen (7 tot 10 jaar, 45 minuten).
  - **Spelen**: de timer, het codeslot, twee hints per puzzel, de verstopplek van de volgende envelop en aan het eind een diploma.
  - **Voor ouders** (`#ouders`): de naam van de jarige en de verstopplekken, de voorbereiding, de antwoorden en de vier puzzelvellen. Met de printknop krijg je één A4-vel per pagina.

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
- De missies Spookslot, Verdwenen Mijter en Paasei-alarm maken.
