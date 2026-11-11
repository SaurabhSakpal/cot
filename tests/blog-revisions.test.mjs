import assert from 'node:assert/strict';
import test from 'node:test';
import { blogEntryId, publishedBlogHistories, revisionUrl, validateBlogVersions } from '../src/lib/blog-revisions.ts';

function entry(version, { latest = false, folder = '001-topic', slug = 'topic', draft = false, ...data } = {}) {
  return {
    id: latest ? slug : `${slug}/v${version}`,
    filePath: `src/content/blog/${folder}/${latest ? 'index' : `index_v${version}`}.md`,
    data: {
      slug, version, draft,
      pubDate: new Date('2026-11-01'),
      revisionDate: new Date(`2026-11-${String(version + 1).padStart(2, '0')}`),
      revisionSummary: 'Saved iteration.',
      ...data,
    },
  };
}

test('stable article and version URLs survive a directory rename', () => {
  const a = entry(3, { latest: true });
  assert.equal(blogEntryId('99-renamed/index.md', a.data), 'topic');
  assert.equal(blogEntryId('nested/99-renamed/index_v2.mdx', entry(2).data), 'topic/v2');
  assert.equal(revisionUrl('topic', 2), '/blog/topic/revisions/2/');
});

test('groups versions newest first and retains the latest entry for listings', () => {
  const latest = entry(3, { latest: true });
  const [history] = validateBlogVersions([entry(1), latest, entry(2)]);
  assert.equal(history.latest, latest);
  assert.deepEqual(history.versions.map(({ data }) => data.version), [3, 2, 1]);
});

test('rejects a version shared by index.md and an archived snapshot, even when draft', () => {
  assert.throws(() => validateBlogVersions([entry(2, { latest: true }), entry(2, { draft: true })]), /duplicate version v2/);
});

test('requires explicit positive safe integer versions and matching filenames', () => {
  for (const version of [undefined, 0, -1, 1.5, '2', Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(() => blogEntryId('topic/index.md', { slug: 'topic', version }), /positive safe integer/);
  }
  for (const filename of ['index_v0.md', 'index_v01.md', 'index_v-1.md', 'index_notes.md']) {
    assert.throws(() => blogEntryId(`topic/${filename}`, entry(2).data), /use index/);
  }
  assert.throws(() => blogEntryId('topic/index_v1.md', entry(2).data), /does not match/);
});

test('rejects archived versions without a latest file or newer than the latest', () => {
  assert.throws(() => validateBlogVersions([entry(1)]), /exactly one latest/);
  assert.throws(() => validateBlogVersions([entry(1, { latest: true }), entry(2)]), /highest version/);
});

test('rejects duplicate article slugs across folders and mixed slugs in one folder', () => {
  assert.throws(() => validateBlogVersions([entry(2, { latest: true }), entry(1, { folder: 'another-folder' })]), /multiple article folders/);
  assert.throws(() => validateBlogVersions([entry(2, { latest: true }), entry(1, { slug: 'other-topic' })]), /same slug/);
});

test('requires a consistent publication date and chronological revision dates', () => {
  assert.throws(() => validateBlogVersions([entry(2, { latest: true }), entry(1, { pubDate: new Date('2026-10-01') })]), /pubDate must stay/);
  assert.throws(() => validateBlogVersions([entry(1, { latest: true, revisionDate: new Date('2026-10-31') })]), /cannot precede/);
  assert.throws(() => validateBlogVersions([entry(2, { latest: true }), entry(1, { revisionDate: new Date('2026-11-10') })]), /follow version order/);
});

test('hides draft snapshots and suppresses all routes/history when the latest is draft', () => {
  const visible = validateBlogVersions([entry(3, { latest: true }), entry(2, { draft: true }), entry(1)]);
  assert.deepEqual(publishedBlogHistories(visible)[0].versions.map(({ data }) => data.version), [3, 1]);
  assert.equal(visible[0].versions.length, 3, 'Filtering must not mutate the validated history');
  assert.deepEqual(publishedBlogHistories(validateBlogVersions([entry(2, { latest: true, draft: true }), entry(1)])), []);
});

test('allows version gaps and same-day revisions', () => {
  const revisionDate = new Date('2026-11-10');
  assert.doesNotThrow(() => validateBlogVersions([entry(5, { latest: true, revisionDate }), entry(1, { revisionDate })]));
});
