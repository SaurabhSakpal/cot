import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

if (fs.existsSync('.astro/dev.json')) {
  const server = JSON.parse(fs.readFileSync('.astro/dev.json', 'utf8'));
  let running = false;
  try { process.kill(server.pid, 0); running = true; } catch { /* Stale server metadata. */ }
  assert.ok(!running, 'Stop astro dev before integration builds; its watcher shares the content cache. Restart it after the checks.');
}

const original = 'src/content/blog/zz-revision-validation';
const renamed = 'src/content/blog/zz-revision-validation-renamed';
const duplicate = 'src/content/blog/zz-revision-validation-duplicate';
const slug = 'zz-revision-validation';
for (const directory of [original, renamed, duplicate]) {
  assert.ok(!fs.existsSync(directory), `Refusing to replace existing content: ${directory}`);
}
let directory = original;
const page = (suffix = '') => `dist/blog/${slug}/${suffix}index.html`;
const readPage = (suffix = '') => fs.readFileSync(page(suffix), 'utf8');

function build(expectedFailure) {
  try {
    execFileSync('npm', ['run', 'build'], { encoding: 'utf8', stdio: 'pipe' });
  } catch (error) {
    if (!expectedFailure) throw error;
    assert.match(String(error.stdout) + String(error.stderr), expectedFailure);
    return;
  }
  assert.ok(!expectedFailure, `Build should have failed: ${expectedFailure}`);
}

function source(version, { draft = false, articleSlug = slug } = {}) {
  return `---
title: "Revision validation v${version}"
description: "Disposable build-validation article."
pubDate: 2026-11-01
slug: ${articleSlug}
version: ${version}
revisionDate: 2026-11-${String(version + 1).padStart(2, '0')}
revisionSummary: "Validation summary v${version}."
draft: ${draft}
cover:
  image: ./images/diagram.svg
  alt: "Validation diagram cover."
---

## Version ${version} body

Distinct saved content for validation version ${version}.

![Validation diagram in the article body.](./images/diagram.svg)
`;
}

function reset() {
  fs.rmSync(directory, { recursive: true, force: true });
  fs.mkdirSync(directory + '/images', { recursive: true });
  fs.copyFileSync('src/content/blog/001-hello-world/images/image_5.svg', directory + '/images/diagram.svg');
  fs.writeFileSync(directory + '/index.md', source(3));
  fs.writeFileSync(directory + '/index_v1.mdx', source(1));
  fs.writeFileSync(directory + '/index_v2.md', source(2, { draft: true }));
}

function assertPublished() {
  const latest = readPage();
  const older = readPage('revisions/1/');
  assert.match(latest, /Distinct saved content for validation version 3/);
  assert.doesNotMatch(latest, /Distinct saved content for validation version 1/);
  assert.match(older, /Distinct saved content for validation version 1/);
  assert.match(older, /You’re reading version 1/);
  assert.match(older, new RegExp(`href="/blog/${slug}/">Read the latest version`));
  assert.match(older, new RegExp(`href="/blog/${slug}/revisions/1/" aria-current="page"`));
  assert.match(latest, new RegExp(`href="/blog/${slug}/revisions/3/" aria-current="page"`));
  assert.doesNotMatch(latest, /revisions\/2\//);
  assert.doesNotMatch(latest, /Validation summary v2/);
  assert.ok(!fs.existsSync(page('revisions/2/')));
  assert.ok(fs.existsSync(page('revisions/3/')));
  for (const file of ['dist/index.html', 'dist/blog/index.html']) {
    const listing = fs.readFileSync(file, 'utf8');
    assert.equal(listing.split(`href="/blog/${slug}/"`).length - 1, 1);
    assert.doesNotMatch(listing, new RegExp(`/blog/${slug}/revisions/`));
  }
  for (const match of older.matchAll(/<img\b[^>]*>/g)) {
    const src = match[0].match(/src="([^"]+)"/)[1];
    assert.ok(fs.existsSync(path.join('dist', src)));
    assert.match(match[0], /alt="Validation diagram/);
  }
}

try {
  reset();
  build();
  assertPublished();
  console.log('PASS: distinct Markdown/MDX bodies, latest-only listings, active timeline, return links, relative images, and hidden draft snapshots.');

  fs.renameSync(directory, renamed);
  directory = renamed;
  build();
  assertPublished();
  console.log('PASS: renaming the source folder preserves article and revision URLs.');

  fs.renameSync(directory + '/index.md', directory + '/index_v3.md');
  fs.writeFileSync(directory + '/index.md', source(4));
  build();
  assert.match(readPage(), /Distinct saved content for validation version 4/);
  assert.match(readPage('revisions/3/'), /Distinct saved content for validation version 3/);
  console.log('PASS: rotating the latest file to a saved snapshot preserves its numbered URL and content.');

  reset();
  fs.writeFileSync(directory + '/index.md', source(3, { draft: true }));
  build();
  assert.ok(!fs.existsSync(`dist/blog/${slug}`));
  for (const file of ['dist/index.html', 'dist/blog/index.html']) assert.doesNotMatch(fs.readFileSync(file, 'utf8'), new RegExp(slug));
  console.log('PASS: a draft latest entry suppresses its entire public history.');

  for (const [label, change, expected] of [
    ['latest/snapshot version collision', () => fs.writeFileSync(directory + '/index_v3.md', source(3)), /duplicate version v3/],
    ['identical latest MD/MDX files', () => fs.copyFileSync(directory + '/index.md', directory + '/index.mdx'), /Duplicate blog entry\/version/],
    ['identical snapshot MD/MDX files', () => fs.copyFileSync(directory + '/index_v1.mdx', directory + '/index_v1.md'), /Duplicate blog entry\/version/],
    ['filename/version mismatch', () => fs.writeFileSync(directory + '/index_v1.mdx', source(2)), /filename version v1 does not match/],
    ['missing explicit version', () => fs.writeFileSync(directory + '/index.md', source(3).replace('version: 3\n', '')), /explicit positive safe integer/],
    ['orphaned snapshots', () => fs.unlinkSync(directory + '/index.md'), /exactly one latest/],
    ['mixed article slugs', () => fs.writeFileSync(directory + '/index_v1.mdx', source(1, { articleSlug: 'zz-another-topic' })), /same slug/],
  ]) {
    reset();
    change();
    build(expected);
    console.log('PASS: build rejects ' + label + '.');
  }

  reset();
  fs.mkdirSync(duplicate + '/images', { recursive: true });
  fs.copyFileSync(directory + '/images/diagram.svg', duplicate + '/images/diagram.svg');
  fs.copyFileSync(directory + '/index.md', duplicate + '/index.md');
  build(/Duplicate blog entry\/version/);
  console.log('PASS: build rejects an article slug reused in another folder.');
} finally {
  for (const owned of [original, renamed, duplicate]) fs.rmSync(owned, { recursive: true, force: true });
  console.log('Removed disposable validation entries; rebuilding the actual site.');
  build();
}
