import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

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

// Astro's glob loader uses frontmatter.slug as entry.id. Requiring it in
// every schema keeps public URLs independent of numbering and source paths.
const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/index.{md,mdx}' }),
  schema: ({ image }) => z.object({
    ...shared,
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
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
