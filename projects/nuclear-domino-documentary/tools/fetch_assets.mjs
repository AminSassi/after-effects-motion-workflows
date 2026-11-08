// Downloads flags (PNG renders of Commons SVGs) + leader portraits into photos/ and logs sources.
import fs from 'fs';
const UA = { 'User-Agent': 'NDRender/1.0 (documentary graphics tool)' };
const FLAGS = { iran: 'Flag of Iran.svg', usa: 'Flag of the United States.svg', israel: 'Flag of Israel.svg', russia: 'Flag of Russia.svg', ukraine: 'Flag of Ukraine.svg', india: 'Flag of India.svg', pakistan: 'Flag of Pakistan.svg', china: "Flag of the People's Republic of China.svg", taiwan: 'Flag of the Republic of China.svg', japan: 'Flag of Japan.svg', skorea: 'Flag of South Korea.svg', nkorea: 'Flag of North Korea.svg', qatar: 'Flag of Qatar.svg', nato: 'Flag of NATO.svg', saudi: 'Flag of Saudi Arabia.svg', turkey: 'Flag of Turkey.svg', egypt: 'Flag of Egypt.svg', ussr: 'Flag of the Soviet Union.svg', uk: 'Flag of the United Kingdom.svg', france: 'Flag of France.svg', oman: 'Flag of Oman.svg', uae: 'Flag of the United Arab Emirates.svg' };
const PEOPLE = { trump: 'Official Presidential Portrait of President Donald J. Trump (2025) (3x4 close cropped).jpg', carlson: 'Tucker Carlson 2023 by Gage Skidmore.jpg', medvedev: 'Dmitry Medvedev official large photo -1.jpg', petrov: 'Stanislaw-jewgrafowitsch-petrow-2016.jpg', lbj: '37 Lyndon Johnson 3x4.jpg', eisenhower: 'Dwight D. Eisenhower, official photo portrait, May 29, 1959 (cropped).jpg', truman: 'Harry S Truman, bw half-length photo portrait, facing front, 1945 (cropped).jpg', kennedy: 'John F. Kennedy, White House color photo portrait (3x4).jpg', netanyahu: 'Benjamin Netanyahu Portrait February 2023 (3x4 cropped).jpg' };
async function info(title, width) {
  const u = `https://commons.wikimedia.org/w/api.php?action=query&format=json&titles=${encodeURIComponent('File:' + title)}&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=${width}&iiextmetadatafilter=LicenseShortName|Artist`;
  let j; for (let a = 0; a < 8; a++) { const tx = await (await fetch(u, { headers: UA })).text(); try { j = JSON.parse(tx); break; } catch { await new Promise(r => setTimeout(r, 15000 * (a + 1))); } } if (!j) throw new Error('rate limited'); const p = Object.values(j.query.pages)[0]; if (!p.imageinfo) throw new Error('missing ' + title);
  const ii = p.imageinfo[0], m = ii.extmetadata || {}; return { url: ii.thumburl || ii.url, page: ii.descriptionurl, lic: m.LicenseShortName?.value || '?', artist: (m.Artist?.value || '').replace(/<[^>]+>/g, '').trim() };
}
const log = [];
async function get(title, out, width) {
  if (fs.existsSync(out) && fs.existsSync(out + '.json')) { log.push(`(kept) ${out}`); return; }
  const i = await info(title, width); let r; for (let a = 0; a < 6; a++) { r = await fetch(i.url, { headers: UA }); if (r.ok) break; await new Promise(q => setTimeout(q, 10000 * (a + 1))); } if (!r.ok) throw new Error(r.status + ' ' + i.url);
  fs.writeFileSync(out, Buffer.from(await r.arrayBuffer())); fs.writeFileSync(out + '.json', JSON.stringify({ title, ...i }));
  log.push(`| ${out.split('/').pop()} | ${title} | ${i.lic} | ${i.artist.slice(0, 80)} | ${i.page} |`);
  await new Promise(r => setTimeout(r, 1500));
}
fs.mkdirSync('photos', { recursive: true });
for (const [k, t] of Object.entries(FLAGS)) await get(t, `photos/ND_F_${k}.png`, 960);
for (const [k, t] of Object.entries(PEOPLE)) await get(t, `photos/ND_L_${k}.jpg`, 900);
console.log(log.join('\n'));
fs.appendFileSync('photos/SOURCES_flags_leaders.md', log.filter(l => l.startsWith('|')).join('\n') + '\n');
