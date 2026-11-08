#!/usr/bin/env node
/*
 * Maakt een nieuwe missie uit het sjabloon.
 *
 *   node tools/nieuwe-missie.js <map> "<Titel>" [Thema]
 *   node tools/nieuwe-missie.js kerstdief "De Kerstdief" Kerst
 *
 * Dit maakt de map <map>/ met index.html, missie.js en icoon.svg, en zet de missie in missies.js.
 * De missie staat op zichtbaar: false, dus nog niet op de homepage. Zet dat op true als hij klaar is.
 */
"use strict";
var fs = require("fs"), path = require("path");

var root = path.join(__dirname, "..");
var id = process.argv[2], titel = process.argv[3], thema = process.argv[4] || "Verjaardag";

function stop(msg) { console.error("Fout: " + msg); process.exit(1); }
if (!id || !titel) stop('gebruik: node tools/nieuwe-missie.js <map> "<Titel>" [Thema]');
if (!/^[a-z0-9-]+$/.test(id)) stop("de mapnaam mag alleen kleine letters, cijfers en streepjes hebben, bijvoorbeeld kerstdief");
if (["assets", "tools", "_sjabloon"].indexOf(id) >= 0) stop("die mapnaam is al in gebruik door de website zelf");
var dir = path.join(root, id);
if (fs.existsSync(dir)) stop("de map " + id + "/ bestaat al");

var catalogFile = path.join(root, "missies.js"), catalog = fs.readFileSync(catalogFile, "utf8");
if (new RegExp('id:\\s*"' + id + '"').test(catalog)) stop(id + " staat al in missies.js");

// 1. copy the template folder and fill in the name
fs.mkdirSync(dir);
fs.readdirSync(path.join(root, "_sjabloon")).forEach(function (f) {
  var text = fs.readFileSync(path.join(root, "_sjabloon", f), "utf8");
  text = text.split("SJABLOON_ID").join(id).split("SJABLOON_TITEL").join(titel);
  fs.writeFileSync(path.join(dir, f), text);
});

// 2. add it to the catalog, just above the marker line
var marker = "  // NIEUWE MISSIES HIERBOVEN";
if (catalog.indexOf(marker) < 0) stop("kan de regel '" + marker.trim() + "' niet vinden in missies.js");
var entry =
  "  {\n" +
  '    id: "' + id + '",\n' +
  "    titel: " + JSON.stringify(titel) + ",\n" +
  "    thema: " + JSON.stringify(thema) + ",\n" +
  "    leeftijd: [7, 10],\n" +
  "    kinderen: [3, 8],\n" +
  "    minuten: 45,\n" +
  "    klaarzetten: 15,\n" +
  '    kort: "Schrijf hier in één of twee zinnen waar de missie over gaat.",\n' +
  '    kaart: ["#7aa7ff", "#3a357c"],\n' +
  "    zichtbaar: false\n" +
  "  }\n";
// the entry before the marker needs a comma after its closing brace
catalog = catalog.replace(/\}\s*\n(\s*\/\/ NIEUWE MISSIES HIERBOVEN)/, "},\n" + entry + "$1");
fs.writeFileSync(catalogFile, catalog);

console.log("Klaar: " + id + "/ is gemaakt en staat in missies.js (nog verborgen).\n");
console.log("Volgende stappen:");
console.log("  1. Schrijf het verhaal, de codes en de puzzels in " + id + "/missie.js");
console.log("  2. Pas de kaart aan in missies.js: leeftijd, kort, kaartkleuren");
console.log("  3. Teken een eigen icoon in " + id + "/icoon.svg (110 bij 100)");
console.log("  4. Controleer:  node tools/controleer.js");
console.log("  5. Speel hem:   python3 -m http.server 8000  en open http://localhost:8000/" + id + "/");
console.log("  6. Klaar? Zet zichtbaar: true in missies.js");
