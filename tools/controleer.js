#!/usr/bin/env node
/*
 * Controleert alle missies, zonder browser.
 *
 *   node tools/controleer.js
 *
 * Per missie: staan de bestanden er, klopt de lijst in missies.js, heeft elk raadsel
 * een code, hints en uitleg, zijn er evenveel verstopplekken als raadsels,
 * en tekenen de puzzelvellen zonder fouten?
 */
"use strict";
var fs = require("fs"), path = require("path"), vm = require("vm");

var root = path.join(__dirname, "..");
var errors = 0, warnings = 0;
function bad(id, msg) { errors++; console.log("  FOUT  " + id + ": " + msg); }
function warn(id, msg) { warnings++; console.log("  LET OP " + id + ": " + msg); }

// load the catalog and the engine in a small sandbox that looks like a browser window
var sandbox = { console: console };
sandbox.window = sandbox;
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(root, "missies.js"), "utf8"), sandbox, { filename: "missies.js" });
vm.runInContext(fs.readFileSync(path.join(root, "assets/missie.js"), "utf8"), sandbox, { filename: "assets/missie.js" });
var catalog = sandbox.MISSIES || [], Missie = sandbox.Missie;

var ids = {};
catalog.forEach(function (m) {
  if (ids[m.id]) bad(m.id, "staat twee keer in missies.js");
  ids[m.id] = true;
  ["id", "titel", "thema", "leeftijd", "kinderen", "minuten", "klaarzetten", "kort", "kaart"].forEach(function (k) {
    if (m[k] === undefined || m[k] === "") bad(m.id, "missies.js mist '" + k + "'");
  });
});

// every folder with a missie.js is a mission
var folders = fs.readdirSync(root).filter(function (d) {
  return ["_sjabloon", "assets", "tools"].indexOf(d) < 0 && fs.existsSync(path.join(root, d, "missie.js"));
});
folders.forEach(function (d) { if (!ids[d]) warn(d, "heeft een missie.js maar staat niet in missies.js, dus niemand vindt hem"); });

catalog.forEach(function (m) {
  var dir = path.join(root, m.id);
  console.log((m.zichtbaar === false ? "[verborgen] " : "") + m.titel + " (" + m.id + "/)");
  ["index.html", "missie.js", "icoon.svg"].forEach(function (f) { if (!fs.existsSync(path.join(dir, f))) bad(m.id, f + " ontbreekt"); });
  if (!fs.existsSync(path.join(dir, "missie.js"))) return;

  var html = fs.existsSync(path.join(dir, "index.html")) ? fs.readFileSync(path.join(dir, "index.html"), "utf8") : "";
  if (html && html.indexOf("<title>" + m.titel) < 0) warn(m.id, "de <title> in index.html begint niet met '" + m.titel + "'");
  if (/SJABLOON_/.test(html)) bad(m.id, "index.html bevat nog SJABLOON_");

  // run the mission file and catch the config it passes to Missie.start
  var config = null;
  sandbox.Missie = { svg: Missie.svg, check: Missie.check, start: function (c) { config = c; } };
  try {
    vm.runInContext(fs.readFileSync(path.join(dir, "missie.js"), "utf8"), sandbox, { filename: m.id + "/missie.js" });
  } catch (e) { bad(m.id, "missie.js geeft een fout: " + e.message); return; }
  if (!config) { bad(m.id, "missie.js roept Missie.start(...) niet aan"); return; }
  if (config.key !== m.id) bad(m.id, "key in missie.js is '" + config.key + "', maar de map heet '" + m.id + "'");
  Missie.check(config).forEach(function (p) { bad(m.id, p); });

  var sheets = [];
  try { sheets = config.sheets(); } catch (e) { bad(m.id, "de puzzelvellen geven een fout: " + e.message); }
  if (sheets.length !== (config.steps || []).length) bad(m.id, sheets.length + " puzzelvellen voor " + (config.steps || []).length + " raadsels");
  sheets.forEach(function (sh, i) {
    if (!/^<svg[\s\S]*<\/svg>$/.test(sh[1] || "")) bad(m.id, "puzzelvel " + (i + 1) + " is geen geldige <svg>");
    if (/NaN|undefined/.test(sh[1] || "")) bad(m.id, "puzzelvel " + (i + 1) + " bevat NaN of undefined: een getal of tekst klopt niet");
  });
  var codes = config.answers || [];
  if (codes.join("|") === "1234|WOORD|5678|9012") warn(m.id, "gebruikt nog de voorbeeldcodes van het sjabloon");
  if (/Hier komt puzzel/.test(sheets.map(function (s) { return s[1]; }).join(""))) warn(m.id, "heeft nog lege puzzelvellen van het sjabloon");
});

console.log("\n" + catalog.length + " missies, " + errors + " fouten, " + warnings + " keer let op.");
process.exit(errors ? 1 : 0);
