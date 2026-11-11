import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { blogEntryId, validateBlogVersions, type BlogRevisionEntry } from './lib/blog-revisions';

const text = z.string().trim().min(1);
const slug = z.string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use a single lowercase, hyphen-separated URL segment.')
  .refine((value) => value !== 'index', 'The slug "index" is reserved.');

const shared = {
  title: text,
  description: text,
  slug,
  draft: z.boolean().default(false),
};

// Latest blog IDs retain the slug; archived snapshots get distinct internal IDs.
const blogFileIds = new Map<string, string>();
const blogGlob = glob({
  base: './src/content/blog',
  pattern: '**/index*.{md,mdx}',
  generateId: ({ entry, base, data }) => {
    const id = blogEntryId(entry, data);
    const filePath = decodeURIComponent(new URL(`./${entry.split('/').map(encodeURIComponent).join('/')}`, base).pathname)
      .replace(/^\/([A-Za-z]:\/)/, '$1');
    // Check source files before glob's digest cache can hide identical duplicates.
    for (const [file, otherId] of blogFileIds) {
      if (file !== filePath && otherId === id) {
        throw new Error(`Duplicate blog entry/version "${id}": ${file} and ${filePath}.`);
      }
    }
    blogFileIds.set(filePath, id);
    return id;
  },
});

const blog = defineCollection({
  loader: {
    ...blogGlob,
    name: 'versioned-blog-glob',
    async load(context) {
      blogFileIds.clear();
      context.watcher?.on('unlink', (file) => blogFileIds.delete(file.replaceAll('\\', '/')));
      // Reparse on sync so folder moves refresh relative asset/module importer paths.
      context.store.clear();
      await blogGlob.load(context);
      // The glob loader has already parsed these entries through the schema below.
      validateBlogVersions(context.store.values() as Iterable<BlogRevisionEntry>);
    },
  },
  schema: ({ image }) => z.object({
    ...shared,
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    version: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
    revisionDate: z.coerce.date(),
    revisionSummary: text,
    tags: z.array(text).default([]),
    cover: z.object({ image: image(), alt: text }).optional(),
  }),
});

const experiments = defineCollection({
  loader: glob({ base: './src/content/experiments', pattern: '**/index.{md,mdx}' }),
  schema: z.object({
    ...shared,
    slug: slug.refine(
      (value) => !['current', 'past'].includes(value),
      'The slugs "current" and "past" are reserved for experiment listings.',
    ),
    startDate: z.coerce.date(),
    completedDate: z.coerce.date().optional(),
    status: z.enum(['current', 'completed']),
    tags: z.array(text).default([]),
  }),
});

const adventures = defineCollection({
  loader: glob({ base: './src/content/adventures', pattern: '**/index.{md,mdx}' }),
  schema: z.object({
    ...shared,
    date: z.coerce.date(),
    location: text,
  }),
});

export const collections = { blog, experiments, adventures };
