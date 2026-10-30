const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

function files(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry =>
    entry.isDirectory() ? files(path.join(dir, entry.name)) : [path.join(dir, entry.name)]);
}
const output = path.resolve('dist');
const allFiles = files(output);
const pages = allFiles.filter(file => file.endsWith('.html'));
const ids = new Map();
for (const file of pages) {
  const matches = [...fs.readFileSync(file, 'utf8').matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(new Set(matches).size, matches.length, `Duplicate ID in ${file}`);
  ids.set(file, new Set(matches));
}
let checked = 0;
for (const file of pages) {
  const route = '/' + path.relative(output, file).split(path.sep).join('/').replace(/index\.html$/, '');
  const text = fs.readFileSync(file, 'utf8');
  for (const match of text.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const url = new URL(match[1].replaceAll('&amp;', '&'), `https://local.test${route}`);
    if (url.origin !== 'https://local.test') continue;
    let target = path.join(output, decodeURIComponent(url.pathname));
    if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
    assert(fs.existsSync(target), `${route}: missing ${match[1]}`);
    if (url.hash && ids.has(target)) {
      assert(ids.get(target).has(decodeURIComponent(url.hash.slice(1))), `${route}: broken anchor ${match[1]}`);
    }
    checked++;
  }
}
for (const file of fs.readdirSync('source/_posts').filter(file => file.endsWith('.md'))) {
  const slug = file.replace(/\.md$/, '');
  assert(pages.some(file => file.includes(`${path.sep}${slug}${path.sep}`)), `Missing article: ${slug}`);
}
const home = fs.readFileSync(path.join(output, 'index.html'), 'utf8');
const homeTitle = home.match(/<title>([\s\S]*?)<\/title>/)?.[1].replace(/&#(?:39|x27);/gi, "'");
assert.equal(homeTitle, "Potato's Blog · 诗酒趁年华");
assert(!home.includes('class="hero"'), 'Removed hero must not return');
assert(!allFiles.some(file => /(?:Swup|APlayer|meting|highlight\.js)/i.test(file)), 'Legacy runtime shipped in dist');
console.log(`${pages.length} pages, ${checked} local links/assets/anchors verified`);
