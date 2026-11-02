import type { CollectionEntry } from 'astro:content';

export type ArticleEntry = CollectionEntry<'blog' | 'experiments' | 'adventures'>;

export function entryDate(entry: ArticleEntry): Date {
  switch (entry.collection) {
    case 'blog': return entry.data.pubDate;
    case 'experiments': return entry.data.startDate;
    case 'adventures': return entry.data.date;
  }
}

export function newestFirst(a: ArticleEntry, b: ArticleEntry): number {
  return entryDate(b).getTime() - entryDate(a).getTime() || a.id.localeCompare(b.id);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en', {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
  }).format(date);
}
