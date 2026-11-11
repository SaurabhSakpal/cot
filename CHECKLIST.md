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

## Approved homepage

- [x] Adopt the user-approved mesh homepage with a stacked introduction, revised three-paragraph copy, and lime welcome highlight.
- [x] Share serif font roles, the near-black background, and the consistent lime-accented header across pages.
- [x] Self-host the brand font with its license; preserve dependency versions, integrations, content, and publishing rules.
- [x] Render published writing from Content Layer entries with stable IDs and UTC dates.
- [x] Add the 642-vertex, 1,920-edge globe and 120 single-word CS/finance terms, revealing up to three neutral-grey labels on hover.
- [x] Retain reduced-motion support, hidden/offscreen suspension, canvas fallback, protected text, and the capped pixel ratio.
- [x] Pass the final build, full Astro diagnostics, route/link/image checks, and mesh interaction/lifecycle verification.
- [x] Preserve the V7 alternative on `feature/homepage-v7`.
- [x] Use the supplied COT SVG as the shared browser favicon, with a matching multi-size ICO fallback replacing the Astro icon.

## Temporary article playground

- [x] Add `/blog/article-playground/` with all documented article elements, heading levels H2–H6, and copied Hello World assets.
- [x] Label the entry as temporary and document that `draft: false` makes it visible in both local preview and production builds.
- [x] Leave revisions for a later discussion; preserve existing content, schemas, layouts, and dependencies.
- [x] Run `npm run build`; verify all ten generated pages, navigation, local links, image files/alt text, footnote anchors, empty states, and the resume redirect.
- [x] Show notes in the right margin from 768px up, reserve a responsive notes column below the full desktop layout, and retain endnotes on phones.
- [x] Rebuild and verify note positioning, wide-image avoidance, and resize cleanup in a DOM harness at 390, 767, 768, 1024, 1366, 1440, and 1920px.
- [x] Visually review the user-supplied desktop and phone screenshots of the playground.
- [x] Remove the playground entry and its copied assets after screenshot review; retain the guide examples and documentation screenshots.
- [x] Rebuild after removal; verify all nine remaining pages, Hello World assets, empty states, screenshot links, and absence of playground routes/listing links.

## Illustrated author guide

- [x] Use playground examples throughout AUTHOR_GUIDE.md with screenshot references immediately following the source examples.
- [x] Embed screenshot links named `ag_img_01.png` through `ag_img_16.png` and add a capture checklist for `docs/images/author-guide/`.
- [x] Match every article source example to the playground verbatim, including full heading text, reference paragraphs, endnote definitions, output examples, and table rows.
- [x] Confirm all sixteen user-captured PNGs are in `docs/images/author-guide/` and every embedded screenshot link resolves.
- [x] Visually inspect all sixteen images against the playground examples and record crop adjustments in AUTHOR_GUIDE.md.
- [x] Recheck updated captures `ag_img_01.png`, `ag_img_02.png`, `ag_img_04.png`, and `ag_img_14.png`; they now demonstrate their intended examples.
- [x] Verify the corrected `ag_img_12.png` shows phone-width plain output and long JSON; all sixteen screenshot examples now pass visual review.

## Supporting accent palette

- [x] Keep the near-black background and lime `#C8F04A` homepage highlights, writing numbers, links/arrows, and shared header active/hover/focus states on every page.
- [x] Use pink `#FF91D2` for blog article links (including footnotes), quote left borders, and quote-card labels; keep quote text neutral. Use purple `#BD93F9` for the active/focused TOC section; keep its icon, label, and inactive links/lines muted gray in both collapsed and expanded views.
- [x] Retain the supporting blue links outside the homepage/blog, lavender experiment status labels/empty-state borders, and translucent lavender text selection.
- [x] Preserve content, routes, fonts, the neutral mesh, dependencies, and publishing rules.
- [x] Run the production build and verify all nine generated pages and preview routes, 50 local links, the article image/alt text, empty states, and the resume redirect.
- [x] Rebuild after screenshot feedback; verify all nine generated routes, 50 local links, article image/alt text, blog-specific color scopes, TOC markup, empty states, and the resume redirect.
- [x] Check lime, pink, and purple exceed 4.5:1 text contrast against both the page background and surface; confirm the existing background dev server serves the revised palette at `http://localhost:4323`.
- [x] Incorporate screenshot feedback and keep the temporary playground and its related guide edits local, outside the palette commit.
- [ ] Complete dedicated desktop/mobile browser QA; screenshot feedback informed the changes, but no browser surface is available in this session.

## Shared writing list

- [x] Share the homepage writing rows with blog and experiment listings: lime two-digit numbers, UTC dates above neutral titles, descriptions below, lime right arrows, and full-row links with keyboard focus styling.
- [x] Keep the existing Blog H1 size and page width; use H2 entry titles on Blog and H3 entry titles beneath Latest writing on the homepage.
- [x] Share desktop/mobile grid styles, including a flexible title/description column and smaller gaps on narrow screens; keep article and travel layouts unchanged.
- [x] Apply shared rows to all/current/past experiment listings; retain lavender Current/Completed labels, start dates, status filtering, stable experiment URLs, draft exclusion, and existing empty-state copy.
- [x] Verify current/completed rows and hidden drafts using temporary entries; remove every validation entry and run the final production build with empty experiments.
- [x] Run the build; verify all ten local routes, 106 links/anchors, four images/alt texts, numbering, heading levels, date placement, and the live Blog response.
- [ ] Complete desktop/mobile visual review; no browser surface is available in this session.

## Blog revision history

- [x] Keep index.md/index.mdx as the latest article, with explicit version, revisionDate, and revisionSummary metadata; support colocated index_vN.md/MDX snapshots and shared relative assets.
- [x] Validate filenames, positive integer versions, unique versions/latest files, one slug/folder/publication date per article, latest-highest numbering, and ordered revision dates, including drafts.
- [x] Keep canonical article URLs stable; render individual versions at `/blog/<slug>/revisions/<N>/`, with a return-to-latest link on archived pages and latest-only homepage/blog listings.
- [x] Add the layered revision icon and responsive timeline with the TOC's gray UI typography/icons and purple active marker; position it beside the header/cover above margin notes, with an inline disclosure on phones.
- [x] Include the shared purple “Why revisions?” link to `/blog/hello-world/#core-principles` below every revision timeline; retain the heading's existing typography and header-aware anchor offset.
- [x] Add explicit v1 metadata to The First Commit without inventing older versions; demonstrate v1/v2/v3 in a temporary playground, removed after screenshot review.
- [x] Document the authoring/rotation workflow, drafts, stable URLs, collision rules, and the need to pause the dev watcher before integration builds; preserve project dependencies and integrations.
- [x] Pass nine revision-validation tests and integration builds covering MD/MDX bodies/assets, draft snapshots/articles, folder renames, version rotation, latest-only listings, and expected failures for collisions/malformed metadata. Remove all disposable validation entries before the final build.
- [x] Pass full Astro diagnostics with zero errors, warnings, or hints; verify existing responsive note behavior at 390, 767, 768, 1024, 1366, 1440, and 1920px.
- [x] Verify the final fourteen generated pages, 198 local links/anchors, eight rendered images with alt text, timeline ordering/selection, latest-only listings, empty states, and compatibility redirect; restart the background server on port 4323 and verify the live latest/v1/v2 playground pages.
- [x] Prepare the temporary TCP/IP screenshot example: v1 explains the stack (March 2024), v2 explores kernel implementation (January 2025), and v3 revisits reliability/flow/congestion (September 2026). Label the copy/dates as illustrative; verify the live preview and rebuilt fourteen pages, 134 links/anchors, and two rendered images.
- [x] Remove the screenshot playground and its copied assets after user capture; update the author guide to describe preserved examples rather than a live preview route.
- [x] Pass the final build, revision unit/integration suites, Astro diagnostics, and responsive note checks after removal; verify ten pages, 75 links/anchors, four images with alt text, and no playground or validation routes.
- [x] Preserve the user's Hello World screenshot reference and include its `img_7.png` asset; leave the unreferenced `img_08.png` local.
- [ ] Complete desktop/mobile visual review of the revision timeline; no browser surface is available in this session.

## Later phases

- [ ] Implement full visual identity.
- [ ] Add actual experiments, adventures, and photographs when available.
- [ ] Add a real resume when provided.
- [ ] Plan deployment, hosting, domains, and CI separately.
- [ ] Replace or remove the temporary diagram when appropriate.
