// usage: node commons_find.mjs "search terms" ...   → prints top file candidates with license + size
const UA = { 'User-Agent': 'NDRender/1.0 (documentary graphics tool)' };
for (const q of process.argv.slice(2)) {
  const u = `https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrlimit=6&gsrsearch=${encodeURIComponent(q)}&prop=imageinfo&iiprop=url|size|extmetadata&iiextmetadatafilter=LicenseShortName|Artist`;
  const j = await (await fetch(u, { headers: UA })).json();
  console.log(`\n## ${q}`);
  for (const p of Object.values(j.query?.pages || {}).sort((a, b) => a.index - b.index)) {
    const ii = p.imageinfo?.[0] || {}; const m = ii.extmetadata || {};
    console.log(`${p.title} | ${ii.width}x${ii.height} | ${m.LicenseShortName?.value || '?'} | ${(m.Artist?.value || '').replace(/<[^>]+>/g, '').slice(0, 50)}`);
  }
}
