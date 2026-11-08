#!/usr/bin/env node
/*
 * Speelt elke missie van begin tot eind in een echte browser.
 *
 *   node tools/speeltest.js            alle missies
 *   node tools/speeltest.js kerstdief  alleen deze
 *
 * Nodig: Playwright met Chromium (npm install playwright, daarna npx playwright install chromium).
 *
 * Per missie: een foute code wordt geweigerd, alle goede codes openen het slot,
 * het diploma verschijnt, en de pagina voor ouders toont evenveel puzzelvellen als raadsels.
 */
"use strict";
var http = require("http"), fs = require("fs"), path = require("path");
var chromium;
try { chromium = require("playwright").chromium; }
catch (e) { console.error("Playwright is niet geïnstalleerd. Doe eerst: npm install playwright && npx playwright install chromium"); process.exit(1); }

var root = path.join(__dirname, "..");
var TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml" };

// a tiny static file server for the website folder
var server = http.createServer(function (req, res) {
  var p = decodeURIComponent(req.url.split("?")[0]);
  if (p.endsWith("/")) p += "index.html";
  var file = path.join(root, path.normalize(p).replace(/^(\.\.[/\\])+/, ""));
  fs.readFile(file, function (err, data) {
    if (err) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
    res.end(data);
  });
});

server.listen(0, async function () {
  var base = "http://localhost:" + server.address().port + "/";
  var sandbox = {}; sandbox.window = sandbox;
  require("vm").runInNewContext(fs.readFileSync(path.join(root, "missies.js"), "utf8"), sandbox);
  var only = process.argv[2];
  var missions = sandbox.MISSIES.filter(function (m) { return !only || m.id === only; });
  var browser = await chromium.launch(), failed = 0;

  for (var m of missions) {
    var page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    var errors = [];
    page.on("pageerror", function (e) { errors.push(e.message); });
    try {
      await page.goto(base + m.id + "/");
      var broken = await page.evaluate(function () { var p = document.querySelector("pre"); return p ? p.textContent : ""; });
      if (broken) throw new Error(broken.replace(/\n/g, " "));
      var config = await page.evaluate(function () { return { answers: window.Missie.config.answers, steps: window.Missie.config.steps.length }; });
      await page.click("#start");
      // a wrong code must be refused
      var wrong = config.answers[0].replace(/[0-9]/g, function (d) { return String((+d + 1) % 10); }).replace(/[A-Z]/g, function (c) { return c === "Z" ? "A" : String.fromCharCode(c.charCodeAt(0) + 1); });
      await page.fill("#code", wrong); await page.click("button[type=submit]");
      if (!/Nog niet goed/.test(await page.textContent("#fb"))) throw new Error("een foute code werd niet geweigerd");
      for (var i = 0; i < config.answers.length; i++) {
        await page.fill("#code", config.answers[i]); await page.click("button[type=submit]");
        await page.waitForTimeout(800);
        if (i < config.answers.length - 1) await page.click("#next");
      }
      if (!(await page.locator(".diploma").count())) throw new Error("geen diploma na de laatste code");
      await page.goto(base + m.id + "/#ouders"); await page.waitForTimeout(300);
      var sheets = await page.locator("svg.sheet").count();
      if (sheets !== config.steps) throw new Error(sheets + " puzzelvellen voor " + config.steps + " raadsels");
      if (errors.length) throw new Error("fout in de pagina: " + errors[0]);
      console.log("  goed  " + m.titel);
    } catch (e) {
      failed++;
      console.log("  FOUT  " + m.titel + ": " + e.message);
    }
    await page.close();
  }
  await browser.close(); server.close();
  console.log("\n" + (missions.length - failed) + " van " + missions.length + " missies helemaal uitgespeeld.");
  process.exit(failed ? 1 : 0);
});
