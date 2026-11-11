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
- The initial dark theme is shared across pages. Keep layouts readable and accessible. Do not invent projects, travel, photographs, or resume details.
- Hosting, domains, CI, analytics, authentication, comments, and likes are outside Phase 2A.

## Repository structure

```text
src/
  content.config.ts              # Content Layer glob loaders and Zod schemas
  content/
    blog/<article>/index.md      # latest; or index.mdx; numbering is local only
    blog/<article>/index_vN.md   # optional saved versions; or .mdx
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

- Define all three collections in `src/content.config.ts` using `defineCollection()`, `glob()` from `astro/loaders`, and Zod schemas. Blog matches `**/index*.{md,mdx}` and validates filenames; other collections match `**/index.{md,mdx}`.
- Keep each entry's supporting files beside its `index.md` or `index.mdx`, normally in `images/`. Use one latest entry file per directory; only blog permits additional `index_vN.md`/`.mdx` snapshots in that same directory.
- All entries require nonempty `title`, `description`, and explicit `slug`. `draft` defaults to `false`; `tags` defaults to `[]` where supported.
- Blog requires `pubDate`, an explicit positive integer `version`, `revisionDate`, and nonempty `revisionSummary`; supports `updatedDate`, `tags`, `draft`, and optional `cover: { image, alt }`. Cover paths are relative to the entry and validated using the schema's `image()` helper. Cover alt text is required.
- Blog `index.md`/`.mdx` must have the highest version. Snapshot suffixes must match frontmatter versions. All versions share a folder, slug, and original `pubDate`; revision dates must follow version order. Duplicate versions (including latest versus snapshot or identical MD/MDX files), orphan snapshots, and conflicting slugs must fail the build, including for drafts.
- Experiments require `startDate` and `status: current | completed`; support `completedDate`, `tags`, and `draft`. One collection spans both source directories. Listings use `status`, never folder placement. `/experiments/past/` displays `completed` entries.
- Adventures require `date` and `location`; support `draft`. Photographs use the same relative-image convention as other entries.
- Write dates as `YYYY-MM-DD`. Display dates in UTC to avoid shifting date-only metadata.
- ArticleLayout supplies the page's `h1`; start body sections with `##`.
- Drafts are excluded from listings, timelines, and article routes in development and production. A draft latest blog entry hides its entire article history; a draft snapshot hides only that snapshot. To preview a draft, temporarily set `draft: false` locally, then restore it before committing if it should remain unpublished.

## Stable slugs and URLs

- Require unique article slugs within each collection: lowercase letters, digits, and single hyphens. Blog versions of one article intentionally share that article's slug. Slashes, extensions, spaces, and `index` are invalid; `current` and `past` are additionally reserved in experiments.
- Latest blog entries and other collections use frontmatter `slug` as Content Layer `entry.id`. Blog snapshot internal IDs are `<slug>/v<N>`; use the validated history's latest ID and `revisionUrl()` for public snapshot links. Never use legacy `entry.slug` or source filenames for public links.
- Use `getPublishedBlogEntries()` for homepage/blog listings so each article appears once. Canonical `/blog/<slug>/` serves the latest; `/blog/<slug>/revisions/<N>/` serves a specific version, including the current one. Keep these URLs stable when rotating index.md into a snapshot or renaming its folder.
- Never derive public URLs from directory numbers, `index.md`, or status. Keep the slug when renaming, renumbering, nesting, or moving an experiment from `current/` to `past/`.
- Do not change published slugs without a deliberate URL migration. Duplicate slugs and prerendered route conflicts must fail the build (`prerenderConflictBehavior: 'error'`).

## Markdown images

```md
![Descriptive alt text](./images/example.jpg)
```

Use standard Markdown syntax with paths relative to the entry for colocated assets under `src/content/`. Astro resolves and processes these at build time. Do not use raw `<img src="./images/...">` for images under `src/`. MDX can import `Image` from `astro:assets` for extra controls. The Hello World SVG is explicitly a temporary diagram, not a photograph.

## Article styling and authoring

- Shared UI fonts, dark colors, layout, and image/code radius are in `src/styles/global.css`. Article font roles and sizes are in `src/styles/article.css`: Newsreader titles, Source Serif 4 Regular body, and Cormorant Garamond headings/quotations. Keep table typography explicitly Inter, independent of the article body font.
- Blog and experiments share the reading layout with a left table of contents and numbered right-margin notes on wide screens. Narrow screens show notes at the article end.
- Blog revision timelines share the TOC's gray UI typography/icons and purple current-item accent. On wide screens, timelines occupy the right column beside the header/cover, above the margin notes; on phones they are inline disclosures. Archived pages link back to the latest article.
- Use Markdown footnotes (`[^name]` and `[^name]: text`) for supporting notes/references. Use a `figure.quote-card` for labeled quotes and a `figure.wide-media` around a standard Markdown image for wider diagrams. Keep blank lines around Markdown inside HTML wrappers. See AUTHOR_GUIDE.md for complete examples.
- The shared menu uses Travel for `/adventures/` and About for `/about/`. `/resume/` is a compatibility redirect, not a second content page.
- Keep article headings and sticky navigation clear of the persistent header using the shared header-height offset.

## Static generation and verification

- Keep `output: 'static'`, directory build output, and trailing-slash URLs. All `[slug].astro` templates must use `getStaticPaths()` and exclude drafts before generating paths. Render with `render(entry)` from `astro:content`.
- Run `npm run build` after content, schema, routing, layout, or configuration changes; fix failures before handing off. The build validates collection data but does not replace a full TypeScript/Astro diagnostic check.
- Verify `dist/index.html`, `dist/blog/index.html`, `dist/blog/hello-world/index.html`, all three experiment listing pages, `dist/adventures/index.html`, `dist/about/index.html`, and the compatibility redirect at `dist/resume/index.html`.
- Verify images referenced in generated HTML exist in `dist/`, retain alt text, and render. Check navigation and empty states. Empty collections emit expected Astro warnings but must build successfully; do not add fake entries to silence warnings.
- For publishing-rule changes, verify drafts have no listing links or production article routes and that status changes and directory moves preserve experiment URLs. Remove temporary validation entries before the final build.
- For blog revision changes, run `npm run test:revisions` and `npm run test:revisions:build`; verify collisions fail builds, old pages render distinct content/assets, drafts are absent from timelines/routes, and listings include latest versions only. Stop the background dev server before integration builds to avoid competing writes to Astro's content cache, then restart it afterward. Keep the user's local playground separate from disposable validation fixtures.
- Keep `CHECKLIST.md` current. Do not commit automatically; the user reviews first.
