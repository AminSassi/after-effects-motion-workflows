// prints GLB structure: nodes, meshes (tri counts, bbox), materials
import fs from 'fs';
const buf = fs.readFileSync(process.argv[2]);
const jl = buf.readUInt32LE(12); const J = JSON.parse(buf.slice(20, 20 + jl).toString());
const bin = buf.slice(20 + jl + 8);
console.log('nodes', J.nodes.length, 'meshes', J.meshes.length, 'materials', (J.materials || []).length, 'textures', (J.textures || []).length, 'images', (J.images || []).length);
(J.materials || []).forEach((m, i) => console.log('mat', i, m.name, JSON.stringify(m.pbrMetallicRoughness || {}).slice(0, 160), m.emissiveTexture ? 'emissiveTex' : '', m.alphaMode || ''));
J.meshes.forEach((m, i) => m.primitives.forEach((p, j) => { const pos = J.accessors[p.attributes.POSITION]; const n = p.indices != null ? J.accessors[p.indices].count / 3 : pos.count / 3; console.log('mesh', i, m.name, 'prim', j, 'mat', p.material, 'tris', n, 'min', pos.min?.map(v => v.toFixed(3)).join(','), 'max', pos.max?.map(v => v.toFixed(3)).join(','), 'uv', p.attributes.TEXCOORD_0 != null); }));
J.nodes.forEach((n, i) => console.log('node', i, n.name, 'mesh', n.mesh, 'children', (n.children || []).join(','), n.matrix ? 'M' : '', n.translation ? 'T' + n.translation.map(v => v.toFixed(3)) : '', n.rotation ? 'R' + n.rotation.map(v => v.toFixed(3)) : '', n.scale ? 'S' + n.scale.map(v => v.toFixed(3)) : ''));
console.log('scene roots', J.scenes[J.scene || 0].nodes);
