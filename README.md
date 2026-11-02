# Chain of Thoughts

A personal static website for software engineering thoughts, technical experiments, landscape photography, and exploration. Phase 2A establishes content architecture with simple, accessible layouts. The full visual identity comes later.

Built with Astro 7.4.4, strict TypeScript, MDX, and Tailwind CSS 4. Content lives in Git as Markdown and local assets. No CMS or database is needed.

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

Required blog metadata: `title`, `description`, `pubDate`, `slug`. Optional: `updatedDate`, `tags`, `draft`, and `cover`. Tags default to `[]`; draft defaults to `false`. Use ISO dates (`YYYY-MM-DD`).

An optional cover includes a local image and its alt text:

```yaml
cover:
  image: ./images/cover.jpg
  alt: "A meaningful description of the cover image."
```

The cover renders above the body. Body images work without a cover. The introductory article's SVG is a labeled temporary diagram, not a real photograph.

### Drafts

Set `draft: true` to exclude an entry from every listing and generated article route in both development and production. To preview a draft, temporarily set it to `false` locally, then restore `true` before committing if it should remain unpublished. Drafts still need valid metadata because the loader validates every entry.

### Stable slugs

Every entry requires an explicit, unique slug within its collection: lowercase letters and digits separated by single hyphens, such as `hello-world`. Do not include slashes, `.md`, numbering copied from a folder prefix, or `index`. `current` and `past` are reserved experiment slugs.

The glob loader uses frontmatter `slug` as the entry's `id`; all links and generated route parameters use that `id`. Directory names and nesting never form the public URL. Keep a published slug unchanged when renaming or moving source files. Duplicate slugs fail the build. A deliberate future slug change will need a URL migration.

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
| `/resume/` | Empty state until a real resume is provided |

The build is explicitly static with trailing-slash URLs and directory output. Dynamic templates use `getStaticPaths()` and render content at build time. Empty collections display useful empty states; their detail templates generate zero pages until entries exist.

After changing content or code:

- Run `npm run build` and fix schema or compilation errors. The build validates content schemas; it is not a full TypeScript/Astro diagnostic check.
- Verify the eight initial HTML files: `dist/index.html`, `dist/blog/index.html`, `dist/blog/hello-world/index.html`, `dist/experiments/index.html`, `dist/experiments/current/index.html`, `dist/experiments/past/index.html`, `dist/adventures/index.html`, and `dist/resume/index.html`.
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
