# Chain of Thoughts

A personal static website for software engineering thoughts, technical experiments, landscape photography, and exploration. Content is authored locally, with a shared dark theme and a reading layout for blog posts and experiments.

Built with Astro 7.4.4, strict TypeScript, MDX, and Tailwind CSS 4. Content lives in Git as Markdown and local assets. No CMS or database is needed.

For copyable examples of headings, quotes, references, code, links, images, wide images, and tables, keep the [Author Guide](AUTHOR_GUIDE.md) open while writing.

## Development

Use Node.js satisfying `package.json` (at least 22.23.4; see `.nvmrc`) and install the locked dependencies with `npm ci`.

| Command | Purpose |
| --- | --- |
| `npm run dev -- --background` | Start the Astro background server, normally at `http://localhost:4321` |
| `npm run astro -- dev status` | Check background server status |
| `npm run astro -- dev logs` | Read server logs |
| `npm run astro -- dev stop` | Stop the background server |
| `npm run build` | Validate content and generate the static site in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run astro -- --help` | See Astro CLI help |

`npm run dev` remains the standard Astro development command. Use its `--background` option for this repository's background-server workflow, equivalent to `astro dev --background`. See [AGENTS.md](AGENTS.md) for contributor rules.

## Repository structure

```text
src/
├── content.config.ts
├── content/
│   ├── blog/
│   │   └── 001-hello-world/
│   │       ├── index.md
│   │       └── images/learning-loop.svg
│   ├── experiments/
│   │   ├── current/              # <entry>/index.md or index.mdx + images/
│   │   └── past/                 # <entry>/index.md or index.mdx + images/
│   └── adventures/               # <entry>/index.md or index.mdx + images/
├── components/                   # Shared entry and experiment listings
├── layouts/                      # BaseLayout.astro and ArticleLayout.astro
├── lib/content.ts                # Date formatting and chronological sorting
├── pages/                        # File-based routes
└── styles/global.css
public/                          # Unprocessed static assets
```

## Create a blog article

1. Create a directory such as `src/content/blog/002-your-topic/` with an `images/` subdirectory. Numbering is optional and only organizes local files.
2. Write `index.md` (or `index.mdx` when you need MDX components):

   ```md
   ---
   title: "Your article title"
   description: "A short description of the article."
   pubDate: 2026-11-01
   slug: your-topic
   version: 1
   revisionDate: 2026-11-01
   revisionSummary: "Initial version."
   tags: []
   draft: false
   ---

   Your opening paragraph.

   ## First section

   Article text goes here.
   ```

3. Add images to that entry's `images/` directory and reference actual files with descriptive alt text:

   ```md
   ![A description of what the image shows](./images/example.jpg)
   ```

4. Run `npm run dev -- --background` and open `http://localhost:4321/blog/your-topic/`. ArticleLayout supplies the title and metadata; use `##` for body sections.
5. Run `npm run build`, inspect the generated page and image, and optionally run `npm run preview` to review production output.
6. Review `git diff` and `git status`, then stage, commit, and push the intended content yourself. Hosting is deferred; pushing stores source in Git and does not deploy the website.

Required blog metadata: `title`, `description`, `pubDate`, `slug`, `version`, `revisionDate`, and `revisionSummary`. Optional: `updatedDate`, `tags`, `draft`, and `cover`. Tags default to `[]`; draft defaults to `false`. Use ISO dates (`YYYY-MM-DD`).

An optional cover includes a local image and its alt text:

```yaml
cover:
  image: ./images/cover.jpg
  alt: "A meaningful description of the cover image."
```

The cover renders above the body. Body images work without a cover. The introductory article's SVG is a labeled temporary diagram, not a real photograph.

### Formatting articles

See the permanent [Author Guide](AUTHOR_GUIDE.md) for copyable examples of every supported article element, including attributed quote cards, numbered references, wide images, and fenced code blocks. The guide also covers draft previewing and the generated table of contents.

### Saved article versions

Keep `index.md` (or `index.mdx`) as the latest version, with an explicit integer `version` even for the first version. Before revising it, save its complete content and frontmatter as `index_v1.md`, `index_v2.md`, and so on in the same article folder, matching its existing version number. Then increment the latest file's `version`, set `revisionDate`, and describe the change in `revisionSummary`.

All versions share the article's slug and original `pubDate`; titles, descriptions, covers, and body content may evolve. Revision dates must be on/after `pubDate` and follow version order. Keep assets referenced by older snapshots. Version numbers may have gaps but must be unique; `index.md` must have the highest number. For example, latest v3 can coexist with `index_v1.md` and `index_v2.md`, but not `index_v3.md`. MDX snapshots use the same rules.

The article stays at `/blog/your-topic/`. Each saved version also has a stable `/blog/your-topic/revisions/1/` URL, including a numbered URL for the current version. The revision timeline highlights the version being read and offers navigation between versions. Only the latest appears in homepage/blog listings. Archived pages include a link back to the latest.

Duplicate versions, duplicate latest files, filename/version mismatches, orphan snapshots, mixed slugs, and invalid version/date metadata fail the build. These checks include drafts. Run `npm run test:revisions` for validation tests and `npm run test:revisions:build` for route, draft, collision, and asset checks with disposable entries. Stop the dev server with `npm run astro -- dev stop` before the integration builds so its watcher cannot rewrite the shared content cache, then restart it with `npm run dev -- --background` afterward.

### Shared styling

`src/styles/global.css` owns the shared UI font, colors, layout, article width, and media radius. `src/styles/article.css` defines article typography: Newsreader for titles, Source Serif 4 Regular for body text, and Cormorant Garamond for headings and quotations. Table headers and cells explicitly use Inter at the original compact size and line spacing; navigation, metadata, and captions also use Inter. Code retains its monospace font. All five font families are self-hosted under `public/fonts/` with their SIL Open Font Licenses. Blog/experiment article details live in `ArticleLayout`, `TableOfContents`, and the small `src/scripts/article.ts` enhancement script; no UI framework is required. The shared header links Travel to the existing `/adventures/` routes and About to `/about/`.

### Homepage

The homepage uses a dotted near-black `#0a0a0b` background, a large Newsreader title, and a stacked introduction. The welcome greeting has dark text on a lime inline highlight that follows wrapped lines. Its three paragraphs use Source Serif 4 and the full introduction width. Latest writing comes from published blog entries, with stable content IDs and UTC dates.

A custom HTML canvas mesh provides the decoration without a graphics library. Its 642 vertices and 1,920 edges form a slowly turning, breathing globe with pointer deformation. Nearby front-facing nodes reveal up to three neutral-grey keywords from 120 single-word computer science and finance terms. Labels avoid the introduction and other labels, then fade when the pointer leaves. Reduced motion keeps the globe static while allowing immediate keyword reveals; animation pauses in hidden tabs and when offscreen. The decoration does not capture clicks or text selection, and the complete page remains usable if canvas is unavailable.

`src/styles/home.css` defines the homepage layout. `ThoughtMesh.astro`, `src/scripts/thought-mesh.ts`, `src/lib/mesh.ts`, and `src/lib/mesh-keywords.ts` implement the mesh. The shared header uses an uppercase Space Grotesk identity, lime dot and hover/active states, and an outlined About link on every page. Space Grotesk is self-hosted with its SIL Open Font License alongside the existing fonts. Colors and typography tokens live in `global.css`; article headings and quotations retain Cormorant Garamond, and UI/table text retains Inter.

### Drafts

Set `draft: true` to exclude an entry from every listing and generated article route in both development and production. A draft latest blog entry hides its whole article history; a draft snapshot hides only that version from timelines and routes. Keep the latest published file in place until a new iteration is ready. To preview a draft, temporarily set it to `false` locally, then restore `true` before committing if it should remain unpublished. Drafts still need valid metadata because the loader validates every entry.

### Stable slugs

Every article requires an explicit, unique slug within its collection: lowercase letters and digits separated by single hyphens, such as `hello-world`. Saved versions of the same blog article share that slug. Do not include slashes, `.md`, numbering copied from a folder prefix, or `index`. `current` and `past` are reserved experiment slugs.

The glob loader uses frontmatter `slug` as the latest entry's `id`; archived blog snapshots have internal `<slug>/v<N>` IDs. Public revision URLs use the latest entry's ID plus its version number. Directory names and nesting never form the public URL. Keep a published slug unchanged when renaming or moving source files. Slugs reused across different articles fail the build. A deliberate future slug change will need a URL migration.

## Experiments

Create `src/content/experiments/current/<entry>/index.md` or `index.mdx` and keep supporting assets in its `images/` directory. Frontmatter shape:

```yaml
title: "Your experiment title"
description: "What you are investigating."
slug: your-experiment
startDate: 2026-11-01
status: current
tags: []
draft: true
# completedDate: YYYY-MM-DD  # optional, when applicable
```

There is **one** experiments collection across both directories. `status: current` selects `/experiments/current/`; `status: completed` selects `/experiments/past/`. `/experiments/` lists both. Folder placement does not control listings.

When an experiment finishes, change its status to `completed`, optionally add `completedDate`, and optionally move its whole directory into `past/`. Keep its slug. Its article stays at `/experiments/your-experiment/` through either change. Add only actual work you want to share; the collection starts empty.

## Adventures

Create `src/content/adventures/<entry>/index.md` or `index.mdx` with `images/` for your photographs. Frontmatter shape:

```yaml
title: "Your adventure title"
description: "A short description."
slug: your-adventure
date: 2026-11-01
location: "The actual location"
draft: true
```

Use the same `![alt](./images/filename.jpg)` syntax for local photographs. The public URL is `/adventures/your-adventure/`. Adventures start empty; no fictional stories or photographs are included.

## Routes and verification

| Route | Behavior |
| --- | --- |
| `/` | Home |
| `/blog/` | Blog entries, newest first |
| `/blog/[slug]/` | Published blog entry |
| `/experiments/` | All published experiments, newest start date first |
| `/experiments/current/` | Entries with status `current` |
| `/experiments/past/` | Entries with status `completed` |
| `/experiments/[slug]/` | Experiment at its stable slug |
| `/adventures/` | Adventures, newest first |
| `/adventures/[slug]/` | Published adventure |
| `/about/` | About information, unpublished until supplied |
| `/resume/` | Compatibility redirect to `/about/` (HTML redirect in static output) |

The build is explicitly static with trailing-slash URLs and directory output. Dynamic templates use `getStaticPaths()` and render content at build time. Empty collections display useful empty states; their detail templates generate zero pages until entries exist.

After changing content or code:

- Run `npm run build` and fix schema or compilation errors. The build validates content schemas; it is not a full TypeScript/Astro diagnostic check.
- Verify the core HTML files: `dist/index.html`, `dist/blog/index.html`, `dist/blog/hello-world/index.html`, `dist/experiments/index.html`, `dist/experiments/current/index.html`, `dist/experiments/past/index.html`, `dist/adventures/index.html`, `dist/about/index.html`, and the redirect at `dist/resume/index.html`.
- Preview `/blog/hello-world/`, confirm the placeholder image and alt text, and check that the generated image exists under `dist/_astro/`.
- Check navigation, empty states, and draft exclusion. When changing collection logic, check MDX, status filtering, and stable URLs after moving experiments.
- Expect harmless Astro warnings while experiments/adventures are intentionally empty.

See [CHECKLIST.md](CHECKLIST.md) for milestones. Cloudflare, GitHub Actions, domains, and deployment are deferred.

## Astro references

- [Content collections](https://docs.astro.build/en/guides/content-collections/)
- [Routing](https://docs.astro.build/en/guides/routing/)
- [Components and layouts](https://docs.astro.build/en/basics/astro-components/)
- [Markdown and content collection images](https://docs.astro.build/en/guides/images/)
- [Styles and CSS](https://docs.astro.build/en/guides/styling/)
