// one-off: extra Commons photos for the v3 shot fixes (logged to photos/SOURCES_flags_leaders.md)
import fs from 'fs';
const UA = { 'User-Agent': 'NDRender/1.0 (documentary graphics tool)' };
const want = { yars: 'RS-24 Yars (28051832658).jpg', yars2: '2023 Moscow Victory Day Parade 41.jpg' };
for (const [k, title] of Object.entries(want)) {
  const u = `https://commons.wikimedia.org/w/api.php?action=query&format=json&titles=${encodeURIComponent('File:' + title)}&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=1920&iiextmetadatafilter=LicenseShortName|Artist`;
  const j = await (await fetch(u, { headers: UA })).json(); const p = Object.values(j.query.pages)[0]; const ii = p.imageinfo[0], m = ii.extmetadata || {};
  const r = await fetch(ii.thumburl || ii.url, { headers: UA }); const out = `photos/ND_P_${k}.jpg`; fs.writeFileSync(out, Buffer.from(await r.arrayBuffer()));
  const lic = m.LicenseShortName?.value || '?', artist = (m.Artist?.value || '').replace(/<[^>]+>/g, '').trim();
  fs.writeFileSync(out + '.json', JSON.stringify({ title, lic, artist, page: ii.descriptionurl }));
  fs.appendFileSync('photos/SOURCES_flags_leaders.md', `| ND_P_${k}.jpg | ${title} | ${lic} | ${artist.slice(0, 80)} | ${ii.descriptionurl} |\n`);
  console.log(k, lic, '|', artist.slice(0, 60)); await new Promise(r => setTimeout(r, 1500));
}
