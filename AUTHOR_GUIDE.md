# Writing for Chain of Thoughts

Use this guide as a copy-and-paste reference while writing. Ordinary Markdown (`index.md`) supports everything below; use `index.mdx` only when you need imported components. Styling is automatic—you do not need to choose fonts or colors in an article.

## Start a post

Create one directory per article, keeping its images alongside it:

```text
src/content/blog/your-article/
├── index.md
└── images/
    ├── cover.jpg
    └── diagram.png
```

Copy this into `index.md` and replace the example values:

```md
---
title: "Your article title"
description: "One sentence describing the article."
pubDate: 2026-11-05
slug: your-article
tags:
  - engineering
draft: true
---

Your opening paragraph.

## First main section

Write the article here.

### A subsection

Add more detail here.
```

- `title`, `description`, `pubDate`, and `slug` are required.
- The layout supplies the title, description, date, and tags. Do not repeat the title as a `#` heading in the body.
- `slug` determines the public URL: `/blog/your-article/`. Use lowercase letters/numbers separated by single hyphens. Do not use `index`, spaces, slashes, or a file extension.
- Keep a published slug unchanged when renaming or moving the source folder.
- Use `YYYY-MM-DD` dates. Dates are displayed in UTC.
- Optional `updatedDate: 2026-11-06` adds an updated date.
- Tags are optional and default to an empty list.
- **Drafts are excluded from both local preview routes and production routes.** Temporarily set `draft: false` while previewing locally. Restore `true` before committing if the article is not ready to publish.

## Headings and the table of contents

```md
## Main section

### Subsection

#### Smaller topic

##### Smaller detail

###### Smallest detail
```

Only `##` (H2) and `###` (H3) appear in the blog/experiment table of contents. H3 links are indented. H4–H6 remain available in the article but do not clutter the navigation. Use headings in order instead of skipping levels to change their appearance.

Main H2 sections receive a decorative line automatically. You do not need to write a horizontal rule after each heading. The table of contents and its section links are generated from the headings; no manual list is required.

## Paragraphs, emphasis, and lists

Separate paragraphs with a blank line:

```md
This is the first paragraph, with **important text** and *a quieter aside*.

This is a new paragraph. Use `inline code` for identifiers or commands.
```

Use normal Markdown lists. Indent nested items beneath their parent:

```md
- First observation.
- Second observation.
  - A supporting detail.
  - Another detail.

1. First step.
2. Second step.
3. Final step.
```

## Quotations

### Simple quotation

Use `>` for each paragraph of a quotation:

```md
> Put the quoted words here.
>
> A second paragraph of the same quotation.
```

The site displays a quotation with its own border, spacing, and quotation font.

### Quote card with a label and source

Use this small HTML wrapper when a quote needs a label and attribution. Replace the placeholders with the actual quote and its source:

```html
<figure class="quote-card">
  <figcaption class="quote-label">An excerpt</figcaption>
  <blockquote>
    <p>Put the quoted words here.</p>
  </blockquote>
  <p class="quote-source">Author · <cite><a href="https://example.com/article">Source title</a></cite> · 2026</p>
</figure>
```

The label and source line are optional. Remove the whole relevant element if you do not need it. Inside this HTML card, use HTML for emphasis or links (`<em>text</em>`, `<strong>text</strong>`, `<a href="…">text</a>`), rather than Markdown stars or link syntax.

## References and supporting notes

Use a footnote marker where the extra information belongs and define it at the end of the file:

```md
This paragraph mentions something that needs more context.[^context]

This paragraph cites a source.[^source]

[^context]: Add the extra explanation here. You can use *emphasis* and links.
[^source]: Author, [Source title](https://example.com/article), 2026.
```

- Names such as `context` and `source` are local identifiers. Match the marker to its definition; use a different name for each distinct note.
- The site generates the visible numbers and return links. Do not type superscript numbers or manually maintain numbering.
- Put definitions at the end of the file to keep the article source easy to read.
- On wide screens, blog/experiment notes appear in the right margin. On smaller screens, they appear at the end of the article, before the site footer. Without JavaScript, they remain ordinary endnotes.

An ordinary source link belongs directly in the sentence when readers do not need an additional explanation. A footnote is useful for citations or supporting information that would interrupt the paragraph.

## Links

```md
Read the [source article](https://example.com/article).

Visit the [blog listing](/blog/) or [About page](/about/).

Jump to [a section in this article](#first-main-section).
```

The heading `## First main section` normally generates the anchor `#first-main-section`. For punctuation or repeated headings, check the generated table-of-contents link instead of guessing the anchor.

For a long URL used repeatedly, reference-style links can make the source easier to read:

```md
Read [the explanation][source] and revisit [the original example][source].

[source]: https://example.com/article
```

A reference-style link is simply another way to write a link; it does not create a numbered footnote.

## Code

Use backticks for code inside a sentence:

```md
Call `loadNotes()` before running `npm run build`.
```

For a block, put triple backticks on their own lines and name the language after the opening fence:

````md
```ts
const notes = ['A question', 'An observation'];

for (const note of notes) {
  console.log(note);
}
```
````

Other language names include `js`, `python`, `bash`, `json`, and `css`. Use `text` for plain output. Syntax highlighting and line numbers are automatic; a copy button is added when JavaScript is available. **Do not add line numbers to the source yourself.** Indentation is preserved, and long lines can scroll horizontally.

## Images

Keep the file in the article's own `images/` directory and use a path relative to `index.md`:

```md
![Describe what the image shows](./images/diagram.png)
```

Replace both the filename and description. Add the actual image file before building. Use meaningful alt text, especially for diagrams; explain the information the reader needs, rather than just writing “image” or “screenshot.”

Normal images stay centered within the text column, retain their proportions, and receive the site's shared border and corner radius. Small images are not automatically stretched.

Use Markdown image syntax for local content assets. Do not write `<img src="./images/diagram.png">`; Astro needs the Markdown image reference to resolve and process the file.

### Wide image with a caption

Use this for a diagram that needs more width than the reading column:

```md
<figure class="wide-media">

![Describe the diagram and its important relationship](./images/diagram.png)

<figcaption>A short explanation of the diagram.</figcaption>
</figure>
```

**Keep the blank lines around the Markdown image.** They allow Markdown processing inside the HTML figure. The `figcaption` is optional; remove its whole line if no caption is needed. Wide images fit the viewport on mobile and keep the same image border and radius.

For a standard-width image with a simple caption, you can use:

```md
![Describe what the image shows](./images/diagram.png)

*A short explanation of the image.*
```

### Cover image

Add this optional block to the frontmatter, between the `---` lines:

```yaml
cover:
  image: ./images/cover.jpg
  alt: "Describe the cover image."
```

Both `image` and nonempty `alt` are required when a cover is supplied. The cover appears after the title and metadata, before the article body. A cover is optional; ordinary body images work without one.

## Tables

```md
| Approach | Benefit | Limitation |
| :--- | :--- | :--- |
| First option | A useful benefit | A relevant tradeoff |
| Second option | Another benefit | Another tradeoff |
```

The first row becomes the table header. The separator row is required. Tables automatically use Inter for both headers and cells, independently of the article's serif body text. Wide tables can scroll horizontally on small screens.

## A break between topics

A line containing three hyphens creates a horizontal divider:

```md
The previous thought ends here.

---

The next thought starts here.
```

Use it between body paragraphs, outside the frontmatter. Most sections only need a heading and normal paragraph spacing.

## Preview and publish

From the repository root:

```bash
npm run dev -- --background
```

Use the URL printed by Astro; it is normally `http://localhost:4321`. If the article has `slug: your-article` and `draft: false`, open `/blog/your-article/` on that server.

```bash
npm run astro -- dev status
npm run astro -- dev logs
npm run build
```

Before committing an article:

- Read the article on desktop and a narrow screen; check heading levels, tables, code, and image proportions.
- Check links, numbered notes, return links, alt text, and quote attribution.
- Confirm the slug is correct and the draft setting matches whether you want the article published.
- Run `npm run build` and fix errors. A successful build validates metadata, but does not replace reading and visually reviewing the page.
- Review `git diff` and `git status`. Commit only the article and its intended assets.

Stop the background server when finished:

```bash
npm run astro -- dev stop
```

Experiments and adventures use the same Markdown elements, with different frontmatter. See [README.md](README.md#experiments) for those schemas and collection-specific routes. Experiments share the blog reading layout; Travel uses the existing adventures collection.
