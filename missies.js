/*
 * DE LIJST MET ALLE MISSIES
 *
 * Elke missie staat hier één keer. De homepage maakt hiermee de kaarten en de filters,
 * en de spelpagina haalt hier de leeftijd, het aantal kinderen en de speeltijd vandaan.
 *
 * Een nieuwe missie toevoegen? Gebruik:  node tools/nieuwe-missie.js <map> "<Titel>"
 * Dat maakt de map en zet hier een regel bij. Zie MISSIE-TOEVOEGEN.md.
 *
 * Velden:
 *   id          naam van de map, bijvoorbeeld "taartrover" (kleine letters, geen spaties)
 *   titel       de naam van de missie
 *   thema       waar het filter op de homepage op werkt: Verjaardag, Halloween, Sinterklaas, Pasen, Kerst, ...
 *   leeftijd    [van, tot] in jaren
 *   kinderen    [van, tot]
 *   minuten     speeltijd
 *   klaarzetten minuten voorbereiden voor de ouders
 *   kort        één of twee zinnen voor op de kaart
 *   kaart       twee kleuren voor de achtergrond van de kaart [licht, donker]
 *   zichtbaar   false = staat online, maar niet op de homepage (handig als je nog test)
 *   nieuw       true = krijgt het label "Nieuw" op de homepage
 */
window.MISSIES = [
  {
    id: "taartrover",
    titel: "De Taartrover",
    thema: "Verjaardag",
    leeftijd: [7, 10],
    kinderen: [3, 8],
    minuten: 45,
    klaarzetten: 15,
    kort: "Wie heeft de verjaardagstaart gestolen? Vind de dader voordat de slagroom smelt.",
    kaart: ["#ff7a85", "#d43b4a"],
    zichtbaar: true
  },
  {
    id: "spookslot",
    titel: "Het Spookslot",
    thema: "Halloween",
    leeftijd: [8, 12],
    kinderen: [3, 8],
    minuten: 60,
    klaarzetten: 15,
    kort: "Spook Wiebe zit al honderd jaar opgesloten. Kraak het geheimschrift en breek de vloek voor middernacht.",
    kaart: ["#4b3a8f", "#221f52"],
    zichtbaar: true
  },
  {
    id: "mijter",
    titel: "De Verdwenen Mijter",
    thema: "Sinterklaas",
    leeftijd: [5, 9],
    kinderen: [2, 8],
    minuten: 45,
    klaarzetten: 15,
    kort: "De mijter van de Sint is weg. Volg het pepernotenspoor en vind hem voor pakjesavond.",
    kaart: ["#c8102e", "#7a0f22"],
    zichtbaar: true
  },
  {
    id: "paasei",
    titel: "Het Paasei-alarm",
    thema: "Pasen",
    leeftijd: [6, 10],
    kinderen: [2, 8],
    minuten: 45,
    klaarzetten: 15,
    kort: "Het gouden paasei is gestolen uit de eierfabriek. Volg het spoor van gele donsveertjes.",
    kaart: ["#7fe0b0", "#3a9a72"],
    zichtbaar: true
  }
  // NIEUWE MISSIES HIERBOVEN (tools/nieuwe-missie.js zet ze hier automatisch neer)
];
