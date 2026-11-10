const article = document.querySelector<HTMLElement>('.article-shell');
const prose = article?.querySelector<HTMLElement>('.prose');

if (article && prose) {
  // The native details element and ordinary anchor links work without JavaScript.
  const toc = article.querySelector<HTMLDetailsElement>('.toc');
  if (toc) {
    const desktop = window.matchMedia('(min-width: 90rem)');
    const adaptToc = () => {
      toc.open = desktop.matches;
      toc.dataset.enhanced = '';
      delete toc.dataset.expanded;
    };
    adaptToc();
    desktop.addEventListener('change', adaptToc);
    toc.querySelector('summary')?.addEventListener('click', (event) => {
      if (!desktop.matches) return;
      event.preventDefault();
      if ('expanded' in toc.dataset) delete toc.dataset.expanded;
      else toc.dataset.expanded = '';
    });
    const links = Array.from(toc.querySelectorAll<HTMLAnchorElement>('a[data-section]'));
    const sections = links.flatMap((link) => {
      const heading = document.getElementById(link.dataset.section ?? '');
      return heading ? [{ link, heading }] : [];
    });
    let queued = false;
    const updateSection = () => {
      queued = false;
      const inset = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) + 40;
      let current = sections[0];
      for (const section of sections) {
        if (section.heading.getBoundingClientRect().top <= inset) current = section;
      }
      for (const { link } of sections) {
        if (link === current?.link) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      }
    };
    window.addEventListener('scroll', () => {
      if (!queued) { queued = true; requestAnimationFrame(updateSection); }
    }, { passive: true });
    window.addEventListener('resize', updateSection);
    updateSection();
  }

  // Generated line numbers live in CSS, so copied code remains clean.
  for (const pre of prose.querySelectorAll<HTMLPreElement>('pre')) {
    const code = pre.querySelector('code');
    if (!code) continue;
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block';
    pre.before(wrapper);
    wrapper.append(pre);
    pre.tabIndex = 0;
    pre.setAttribute('aria-label', 'Code example; scroll horizontally for long lines');
    const toolbar = document.createElement('div');
    toolbar.className = 'code-toolbar';
    const language = document.createElement('span');
    language.textContent = pre.dataset.language ?? (code.className.replace('language-', '') || 'Code');
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'Copy code';
    const status = document.createElement('span');
    status.className = 'sr-only';
    status.setAttribute('role', 'status');
    toolbar.append(language, button, status);
    wrapper.prepend(toolbar);
    button.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(code.textContent ?? '');
        button.textContent = 'Copied';
        status.textContent = 'Code copied to clipboard.';
      } catch {
        button.textContent = 'Select code';
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(code);
        selection?.removeAllRanges();
        selection?.addRange(range);
        status.textContent = 'Clipboard unavailable. Code selected; use your copy shortcut.';
      }
      window.setTimeout(() => { button.textContent = 'Copy code'; status.textContent = ''; }, 2500);
    });
  }

  // Keep the same semantic footnotes and return links in both layouts.
  // From tablet width up, position them beside their first reference.
  const notes = Array.from(prose.querySelectorAll<HTMLElement>('[data-footnotes] > ol > li'));
  const media = window.matchMedia('(min-width: 48rem)');
  const positionNotes = () => {
    prose.classList.remove('margin-notes');
    prose.style.removeProperty('min-height');
    if (!media.matches || !article.classList.contains('reading-layout')) return;
    prose.classList.add('margin-notes');
    const top = prose.getBoundingClientRect().top;
    const wideImages = Array.from(prose.querySelectorAll<HTMLElement>('.wide-media'));
    let previousBottom = 0;
    for (const note of notes) {
      const ref = Array.from(prose.querySelectorAll<HTMLAnchorElement>('a[data-footnote-ref]'))
        .find((anchor) => decodeURIComponent(anchor.hash.slice(1)) === note.id);
      if (!ref) continue;
      let offset = Math.max(ref.getBoundingClientRect().top - top - 4, previousBottom);
      const height = note.getBoundingClientRect().height;
      for (const image of wideImages) {
        const imageTop = image.getBoundingClientRect().top - top;
        const imageBottom = image.getBoundingClientRect().bottom - top;
        if (offset < imageBottom && offset + height > imageTop) offset = imageBottom + 24;
      }
      note.style.top = `${offset}px`;
      previousBottom = offset + height + 24;
    }
    prose.style.minHeight = `${previousBottom}px`;
  };
  let noteFrame = 0;
  const scheduleNotes = () => {
    cancelAnimationFrame(noteFrame);
    noteFrame = requestAnimationFrame(positionNotes);
  };
  media.addEventListener('change', () => {
    if (!media.matches) prose.style.removeProperty('min-height');
    scheduleNotes();
  });
  window.addEventListener('resize', scheduleNotes);
  for (const image of prose.querySelectorAll('img')) image.addEventListener('load', scheduleNotes);
  void document.fonts.ready.then(scheduleNotes);
  scheduleNotes();
}
