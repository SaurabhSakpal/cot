## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Chain of Thoughts: technology and scope

- Astro 7 with strict TypeScript, the existing MDX integration, and Tailwind CSS 4 through its Vite plugin. Preserve dependency versions and working integrations. Import Zod 4 from `astro/zod`.
- This is a static, local-file-authored personal website. No CMS, database, client router, or UI framework is required.
- Visual identity is deferred. Keep layouts readable and accessible. Do not invent projects, travel, photographs, or resume details.
- Hosting, domains, CI, analytics, authentication, comments, and likes are outside Phase 2A.

## Repository structure

```text
src/
  content.config.ts              # Content Layer glob loaders and Zod schemas
  content/
    blog/<article>/index.md      # or index.mdx; optional numbering is local only
    blog/<article>/images/
    experiments/current/<entry>/index.md
    experiments/past/<entry>/index.md
    adventures/<entry>/index.md
  components/                   # Shared listing markup
  layouts/                      # BaseLayout and ArticleLayout
  lib/content.ts                # Typed entry dates and sorting
  pages/                        # Static routes and getStaticPaths templates
  styles/global.css             # Tailwind and basic readable styles
public/                         # Assets copied without processing
```

Empty content directories are tracked with `.gitkeep`; these are not collection entries.

## Content conventions

- Define all three collections in `src/content.config.ts` using `defineCollection()`, `glob()` from `astro/loaders`, and Zod schemas. Match `**/index.{md,mdx}` for nested entries.
- Keep each entry's supporting files beside its `index.md` or `index.mdx`, normally in `images/`. Use one entry file per directory.
- All entries require nonempty `title`, `description`, and explicit `slug`. `draft` defaults to `false`; `tags` defaults to `[]` where supported.
- Blog requires `pubDate`; supports `updatedDate`, `tags`, `draft`, and optional `cover: { image, alt }`. Cover paths are relative to the entry and validated using the schema's `image()` helper. Cover alt text is required.
- Experiments require `startDate` and `status: current | completed`; support `completedDate`, `tags`, and `draft`. One collection spans both source directories. Listings use `status`, never folder placement. `/experiments/past/` displays `completed` entries.
- Adventures require `date` and `location`; support `draft`. Photographs use the same relative-image convention as other entries.
- Write dates as `YYYY-MM-DD`. Display dates in UTC to avoid shifting date-only metadata.
- ArticleLayout supplies the page's `h1`; start body sections with `##`.
- Drafts are excluded from listings and article routes in development and production. To preview a draft, temporarily set `draft: false` locally, then restore it before committing if it should remain unpublished.

## Stable slugs and URLs

- Require unique slugs within each collection: lowercase letters, digits, and single hyphens. Slashes, extensions, spaces, and `index` are invalid; `current` and `past` are additionally reserved in experiments.
- Astro's glob loader uses frontmatter `slug` as the current Content Layer `entry.id`. Generate links and dynamic route params from `entry.id`, not legacy `entry.slug` or source filenames.
- Never derive public URLs from directory numbers, `index.md`, or status. Keep the slug when renaming, renumbering, nesting, or moving an experiment from `current/` to `past/`.
- Do not change published slugs without a deliberate URL migration. Duplicate slugs and prerendered route conflicts must fail the build (`prerenderConflictBehavior: 'error'`).

## Markdown images

```md
![Descriptive alt text](./images/example.jpg)
```

Use standard Markdown syntax with paths relative to the entry for colocated assets under `src/content/`. Astro resolves and processes these at build time. Do not use raw `<img src="./images/...">` for images under `src/`. MDX can import `Image` from `astro:assets` for extra controls. The Hello World SVG is explicitly a temporary diagram, not a photograph.

## Static generation and verification

- Keep `output: 'static'`, directory build output, and trailing-slash URLs. All `[slug].astro` templates must use `getStaticPaths()` and exclude drafts before generating paths. Render with `render(entry)` from `astro:content`.
- Run `npm run build` after content, schema, routing, layout, or configuration changes; fix failures before handing off. The build validates collection data but does not replace a full TypeScript/Astro diagnostic check.
- Verify `dist/index.html`, `dist/blog/index.html`, `dist/blog/hello-world/index.html`, all three experiment listing pages, `dist/adventures/index.html`, and `dist/resume/index.html`.
- Verify images referenced in generated HTML exist in `dist/`, retain alt text, and render. Check navigation and empty states. Empty collections emit expected Astro warnings but must build successfully; do not add fake entries to silence warnings.
- For publishing-rule changes, verify drafts have no listing links or production article routes and that status changes and directory moves preserve experiment URLs. Remove temporary validation entries before the final build.
- Keep `CHECKLIST.md` current. Do not commit automatically; the user reviews first.
