function basename(file: string): string {
  return file.replaceAll('\\', '/').split('/').at(-1)!;
}

function dirname(file: string): string {
  const normalized = file.replaceAll('\\', '/');
  const separator = normalized.lastIndexOf('/');
  return separator < 0 ? '.' : normalized.slice(0, separator) || '/';
}

export interface BlogRevisionData {
  slug: string;
  version: number;
  revisionDate: Date;
  revisionSummary: string;
  pubDate: Date;
  draft: boolean;
}

export interface BlogRevisionEntry {
  id: string;
  filePath?: string;
  data: BlogRevisionData;
}

export interface BlogHistory<T extends BlogRevisionEntry = BlogRevisionEntry> {
  latest: T;
  versions: T[];
}

/** Keep the latest ID equal to its public slug; give snapshots distinct internal IDs. */
export function blogEntryId(entry: string, data: { slug?: unknown; version?: unknown }): string {
  const match = /^index(?:_v([1-9]\d*))?\.(md|mdx)$/.exec(basename(entry));
  if (!match) throw new Error(`${entry}: use index.md/index.mdx or index_vN.md/index_vN.mdx with a positive version number.`);
  if (!Number.isSafeInteger(data.version) || Number(data.version) < 1) {
    throw new Error(`${entry}: version must be an explicit positive safe integer, including in index.md.`);
  }
  if (match[1] && Number(match[1]) !== data.version) {
    throw new Error(`${entry}: filename version v${match[1]} does not match frontmatter version ${data.version}.`);
  }
  return match[1] ? `${data.slug}/v${data.version}` : String(data.slug);
}

/** Validate every file, including drafts, before deciding which versions are public. */
export function validateBlogVersions<T extends BlogRevisionEntry>(entries: Iterable<T>): BlogHistory<T>[] {
  const groups = new Map<string, T[]>();
  const folderSlugs = new Map<string, string>();
  for (const entry of entries) {
    if (!entry.filePath) throw new Error(`${entry.id}: blog revisions require a local source file.`);
    const expectedId = blogEntryId(entry.filePath, entry.data);
    if (entry.id !== expectedId) throw new Error(`${entry.filePath}: unexpected revision ID ${entry.id}.`);
    const folder = dirname(entry.filePath);
    const existingSlug = folderSlugs.get(folder);
    if (existingSlug && existingSlug !== entry.data.slug) {
      throw new Error(`${folder}: all versions of an article must use the same slug (${existingSlug}).`);
    }
    folderSlugs.set(folder, entry.data.slug);
    const group = groups.get(entry.data.slug) ?? [];
    group.push(entry);
    groups.set(entry.data.slug, group);
  }

  return Array.from(groups, ([slug, versions]) => {
    const files = versions.map((entry) => entry.filePath!);
    if (new Set(files.map(dirname)).size !== 1) {
      throw new Error(`Blog slug "${slug}" is used in multiple article folders: ${files.join(', ')}.`);
    }
    const latestFiles = versions.filter((entry) => /^index\.(md|mdx)$/.test(basename(entry.filePath!)));
    if (latestFiles.length !== 1) throw new Error(`Article "${slug}" must have exactly one latest index.md or index.mdx.`);
    const latest = latestFiles[0]!;
    const seen = new Set<number>();
    for (const entry of versions) {
      if (seen.has(entry.data.version)) {
        throw new Error(`Article "${slug}" has duplicate version v${entry.data.version}. Each version, including the latest, must be unique.`);
      }
      seen.add(entry.data.version);
      if (entry.data.pubDate.getTime() !== latest.data.pubDate.getTime()) {
        throw new Error(`${entry.filePath}: pubDate must stay the same across versions of "${slug}".`);
      }
      if (entry.data.revisionDate < entry.data.pubDate) {
        throw new Error(`${entry.filePath}: revisionDate cannot precede pubDate.`);
      }
    }
    versions.sort((a, b) => b.data.version - a.data.version);
    if (versions[0] !== latest) throw new Error(`Article "${slug}": index.md/index.mdx must have the highest version number.`);
    for (let index = 1; index < versions.length; index++) {
      if (versions[index]!.data.revisionDate > versions[index - 1]!.data.revisionDate) {
        throw new Error(`Article "${slug}": revision dates must follow version order.`);
      }
    }
    return { latest, versions };
  });
}

export function revisionUrl(slug: string, version: number): string {
  return `/blog/${slug}/revisions/${version}/`;
}

export function publishedBlogHistories<T extends BlogRevisionEntry>(histories: BlogHistory<T>[]): BlogHistory<T>[] {
  return histories.filter(({ latest }) => !latest.data.draft).map(({ latest, versions }) => ({
    latest,
    versions: versions.filter(({ data }) => !data.draft),
  }));
}
