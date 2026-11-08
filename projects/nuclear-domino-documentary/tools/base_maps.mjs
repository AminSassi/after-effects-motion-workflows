// Generates 4 clean, label-free 4K dark-atlas geographic base maps for After Effects:
// BASE_iran.png, BASE_natanz.png, BASE_world.png, BASE_russia_ukraine.png
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { Resvg } from "@resvg/resvg-js";
import * as d3Geo from "d3-geo";
import * as topojson from "topojson-client";

const require = createRequire(import.meta.url);
const world50m = require("world-atlas/countries-50m.json");
const countries = topojson.feature(world50m, world50m.objects.countries).features;
const graticule = d3Geo.geoGraticule10();

const W = 3840, H = 2160;
const OUT = path.resolve("C:/Users/PC/Desktop/NUCLEAR_DOMINO/02_ASSETS/maps");

function renderBaseMap(filename, proj, highlights = {}) {
  const geoPath = d3Geo.geoPath(proj);
  const gratD = geoPath(graticule) || "";
  let countryPaths = "";
  for (const f of countries) {
    const d = geoPath(f);
    if (!d) continue;
    const id = String(f.id);
    const hl = highlights[id];
    const fill = hl ? hl.fill : "#101722";
    const stroke = hl ? hl.stroke : "#223046";
    const sw = hl ? 3.5 : 1.5;
    countryPaths += `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <radialGradient id="sea" cx="50%" cy="50%" r="70%">
        <stop offset="0%" stop-color="#0A101A"/>
        <stop offset="100%" stop-color="#05070B"/>
      </radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#sea)"/>
    <path d="${gratD}" fill="none" stroke="#162234" stroke-width="1" stroke-dasharray="4 8" opacity="0.65"/>
    ${countryPaths}
  </svg>`;
  const png = new Resvg(svg, { fitTo: { mode: "width", value: W } }).render().asPng();
  fs.writeFileSync(path.join(OUT, filename), png);
}

// 1. BASE_iran.png (Iran & Persian Gulf / Strait of Hormuz)
renderBaseMap(
  "BASE_iran.png",
  d3Geo.geoMercator().center([54.0, 29.5]).scale(4200).translate([W * 0.52, H * 0.52]),
  {
    "364": { fill: "#281218", stroke: "#E63946" }, // Iran
    "376": { fill: "#122238", stroke: "#4DA8DA" }, // Israel
    "634": { fill: "#182820", stroke: "#2EC4B6" }, // Qatar
  }
);

// 2. BASE_natanz.png (Central Iran / Isfahan-Natanz-Fordow corridor)
renderBaseMap(
  "BASE_natanz.png",
  d3Geo.geoMercator().center([52.5, 33.2]).scale(7800).translate([W * 0.48, H * 0.52]),
  {
    "364": { fill: "#1F1218", stroke: "#F4A261" }, // Iran
  }
);

// 3. BASE_world.png (Global Nuclear Dominoes & 1945 Taboo Map)
renderBaseMap(
  "BASE_world.png",
  d3Geo.geoNaturalEarth1().center([25, 22]).scale(720).translate([W * 0.48, H * 0.54]),
  {
    "840": { fill: "#14243B", stroke: "#4DA8DA" }, // USA
    "643": { fill: "#2D1318", stroke: "#E63946" }, // Russia
    "156": { fill: "#261A12", stroke: "#F4A261" }, // China
    "364": { fill: "#2B1419", stroke: "#E63946" }, // Iran
    "586": { fill: "#241B14", stroke: "#F4A261" }, // Pakistan
    "356": { fill: "#162336", stroke: "#4DA8DA" }, // India
    "408": { fill: "#2B1419", stroke: "#E63946" }, // DPRK
    "376": { fill: "#162336", stroke: "#4DA8DA" }, // Israel
    "826": { fill: "#14243B", stroke: "#4DA8DA" }, // UK
    "250": { fill: "#14243B", stroke: "#4DA8DA" }, // France
    "392": { fill: "#241B14", stroke: "#F4A261" }, // Japan
  }
);

// 4. BASE_russia_ukraine.png (Eastern Europe / Russia-Ukraine-Iran Theater)
renderBaseMap(
  "BASE_russia_ukraine.png",
  d3Geo.geoMercator().center([42.0, 44.5]).scale(2400).translate([W * 0.50, H * 0.55]),
  {
    "643": { fill: "#2D1318", stroke: "#E63946" }, // Russia
    "804": { fill: "#14263D", stroke: "#4DA8DA" }, // Ukraine
    "364": { fill: "#241614", stroke: "#F4A261" }, // Iran
  }
);

// 5. BASE_south_asia.png (Pakistan & India / Rawalpindi - New Delhi corridor)
renderBaseMap(
  "BASE_south_asia.png",
  d3Geo.geoMercator().center([74.5, 29.0]).scale(4200).translate([W * 0.50, H * 0.52]),
  {
    "586": { fill: "#2B1618", stroke: "#E63946" }, // Pakistan
    "356": { fill: "#14243A", stroke: "#4DA8DA" }, // India
  }
);

// 6. BASE_east_asia.png (China, Taiwan Strait, Japan, Korean Peninsula)
renderBaseMap(
  "BASE_east_asia.png",
  d3Geo.geoMercator().center([122.0, 29.5]).scale(3200).translate([W * 0.50, H * 0.52]),
  {
    "156": { fill: "#2A1418", stroke: "#E63946" }, // China
    "158": { fill: "#162A3E", stroke: "#00F0FF" }, // Taiwan
    "392": { fill: "#142238", stroke: "#4DA8DA" }, // Japan
    "410": { fill: "#142238", stroke: "#4DA8DA" }, // South Korea
    "408": { fill: "#2B1814", stroke: "#F4A261" }, // North Korea
  }
);

// 7. BASE_europe.png (NATO - Russia / Europe Plan A & Serpukhov-15 Theater)
renderBaseMap(
  "BASE_europe.png",
  d3Geo.geoMercator().center([22.0, 52.0]).scale(2800).translate([W * 0.50, H * 0.54]),
  {
    "643": { fill: "#2D1318", stroke: "#E63946" }, // Russia
    "804": { fill: "#1A2436", stroke: "#F4A261" }, // Ukraine
    "616": { fill: "#14243B", stroke: "#4DA8DA" }, // Poland
    "276": { fill: "#14243B", stroke: "#4DA8DA" }, // Germany
    "250": { fill: "#14243B", stroke: "#4DA8DA" }, // France
    "826": { fill: "#14243B", stroke: "#4DA8DA" }, // UK
  }
);

console.log("Generated 7 clean 4K base maps for After Effects.");
