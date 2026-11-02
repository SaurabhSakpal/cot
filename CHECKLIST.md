# Chain of Thoughts — Phase 2A

## Repository and architecture

- [x] Inspect configuration, dependencies, source, and AGENTS.md.
- [x] Consult current Astro docs; preserve MDX, TypeScript, and Tailwind configuration.
- [x] Define three collections with Content Layer glob loaders and Zod schemas.
- [x] Support nested `index.md` and `index.mdx` with colocated assets.
- [x] Require explicit stable slugs and use content entry IDs for routes.
- [x] Reject invalid/reserved slugs; fail on duplicate IDs and route conflicts.
- [x] Use one experiments collection with status-based listings.
- [x] Exclude drafts from listings and generated article routes.

## Pages and content

- [x] Add BaseLayout and ArticleLayout with metadata, navigation, footer, and readable formatting.
- [x] Add home, blog, experiments (all/current/past), adventures, and resume pages.
- [x] Add three static dynamic templates using getStaticPaths().
- [x] Publish Hello World with a labeled local placeholder diagram.
- [x] Keep experiments and adventures empty with useful listing states.
- [x] Leave resume content unpublished until real details are provided.
- [x] Preserve Markdown + local images + Git workflow without new dependencies.
- [x] Extend AGENTS.md and document authoring and publishing in README.md.

## Verification

- [x] Run initial `npm run build` successfully with empty collections.
- [x] Confirm eight initial static HTML pages, navigation, and local image output.
- [x] Verify Markdown/MDX, covers, draft exclusion, and adventure rendering using temporary entries.
- [x] Verify experiment status filtering and stable URLs after a directory move.
- [x] Verify schema failures and duplicate slug protection.
- [x] Remove temporary entries and run the final production build with empty collections.
- [x] Verify all eight routes and the local image return HTTP 200 through the background dev server.
- [x] Render and visually inspect the generated placeholder SVG.
- [x] Review final diff without committing.

## Later phases

- [ ] Implement full visual identity.
- [ ] Add actual experiments, adventures, and photographs when available.
- [ ] Add a real resume when provided.
- [ ] Plan deployment, hosting, domains, and CI separately.
- [ ] Replace or remove the temporary diagram when appropriate.
