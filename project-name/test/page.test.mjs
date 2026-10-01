import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import config from '../../vite.config.js';
import { presentation } from '../src/content/renderer.js';
test('project identity, layout and production subpath',async()=>{
 assert.equal(config.base,'/babylon-lite-bomberman-clone/');assert.equal(config.root,'project-name');
 const page=await readFile(new URL('../index.html',import.meta.url),'utf8');assert.match(page,/<title>Bomberman Clone<\/title>/);
 const app=await readFile(new URL('../src/App.jsx',import.meta.url),'utf8');
 for(const corner of ['corner_top_left','corner_top_right','corner_bottom_left','corner_bottom_right'])assert.ok(app.includes(corner));
 assert.ok(app.includes('SamuelAsherRivello/babylon-lite-bomberman-clone'));assert.ok(app.includes('versionText'));
});
test('pixel presentation preserves integer fit and positive fallback',()=>{
 assert.equal(presentation(640,544).scale,2);assert.equal(presentation(800,600).scale,2);
 assert.equal(presentation(160,136).scale,.5);assert.equal(presentation(640,544,1.5).unit,3);
});
