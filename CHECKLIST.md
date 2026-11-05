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

## Blog and experiment styling

- [x] Add shared dark colors, self-hosted Inter, readable heading levels, and one image/code corner radius.
- [x] Finalize Newsreader titles, Source Serif 4 Regular body, Cormorant Garamond headings/quotes, and original Inter table typography.
- [x] Archive temporary typography comparison routes/styles/fonts outside the repository; retain chosen fonts with licenses.
- [x] Add persistent glass header with Blog, Experiments, Travel, and About navigation.
- [x] Rename Resume to About and retain a compatibility redirect for the old URL.
- [x] Add article table of contents with desktop sticky placement and mobile disclosure.
- [x] Add quote cards, wider Markdown images, responsive notes, code line numbers, and copy controls.
- [x] Add permanent AUTHOR_GUIDE.md with copyable Markdown/HTML examples and link it from README.md.
- [x] Build successfully; verify core HTML, local images, anchor targets, About redirect, MDX, and draft exclusion.
- [x] Pass full Astro diagnostics with zero errors/warnings/hints, strictly check the article script, and test TOC/note/copy behavior in a DOM harness.
- [x] Complete desktop design feedback and final typography selection.
- [ ] Complete visual review on a mobile browser; simulated DOM checks passed, but no browser was available during implementation.
- [x] Remove inventoried temporary preview artifacts, preserve user test images outside the repository, and audit the final merge diff.

## Later phases

- [ ] Implement full visual identity.
- [ ] Add actual experiments, adventures, and photographs when available.
- [ ] Add a real resume when provided.
- [ ] Plan deployment, hosting, domains, and CI separately.
- [ ] Replace or remove the temporary diagram when appropriate.
