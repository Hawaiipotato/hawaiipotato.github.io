import assert from 'node:assert/strict';
import test from 'node:test';
import { cleanLegacyPage, countWords, dateLabel, parseDate, posts, read, render } from './content.ts';

test('content dates are parsed as Shanghai time, regardless of host timezone', () => {
  assert.equal(parseDate('2026-02-11 10:00:00').toISOString(), '2026-02-11T02:00:00.000Z');
  assert.equal(parseDate('2026-02-11').toISOString(), '2026-02-10T16:00:00.000Z');
  assert.equal(dateLabel(parseDate('2026-02-10T16:00:00Z')), '2026-02-11');
  assert.throws(() => parseDate('not a date'), /Invalid content date/);
});

test('article examples containing script and style tags survive Markdown rendering', async () => {
  const result = await render('```html\n<script>alert(1)</script>\n<style>p { color: red }</style>\n```');
  assert.match(result.code, /alert/);
  assert.match(result.code, /color/);
  assert.doesNotMatch(result.code, /<script>/);
});

test('only legacy standalone pages remove embedded behavior and adapt contact cards', () => {
  const source = '<style>body{}</style><script>legacy()</script><div class="skill-card contact-action" role="link" tabindex="0" data-href="mailto:test@example.com"><h4>邮箱</h4></div>';
  const cleaned = cleanLegacyPage(source);
  assert.doesNotMatch(cleaned, /<script|<style|data-href/);
  assert.match(cleaned, /<a class="skill-card contact-action" href="mailto:test@example.com"><h4>邮箱<\/h4><\/a>/);
});

test('duplicate headings receive distinct matching anchor IDs', async () => {
  const result = await render('## 安装\n\n## 安装');
  const ids = result.metadata.headings.map(heading => heading.slug);
  assert.equal(new Set(ids).size, 2);
  for (const id of ids) assert.ok(result.code.includes(`id="${id}"`));
});

test('word counts ignore link targets and image markup', () => {
  assert.equal(countWords('你好 [Astro](https://example.com/long/path) ![说明](image.jpg)'), 3);
});

test('existing posts have stable unique paths and no filesystem-derived update dates', () => {
  assert.equal(new Set(posts.map(post => post.url)).size, posts.length);
  for (const post of posts) {
    assert.ok(post.url.endsWith(`/${post.slug}/`));
    const explicit = read(`source/_posts/${post.slug}.md`).data.updated;
    assert.equal(post.updated?.toISOString() ?? null, explicit ? parseDate(explicit).toISOString() : null);
  }
});
