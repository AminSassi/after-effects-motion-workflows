// one-off: film grain textures used by lib3d.frameSVG (grain_0..2.png)
import fs from 'fs';
import { Resvg } from '@resvg/resvg-js';
for (let i = 0; i < 3; i++) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="${i * 17 + 3}" stitchTiles="stitch"/><feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1.6 -0.55"/></filter><rect width="1920" height="1080" filter="url(#n)"/></svg>`;
  fs.writeFileSync(new URL(`./grain_${i}.png`, import.meta.url), new Resvg(svg).render().asPng());
}
console.log('grain ok');
