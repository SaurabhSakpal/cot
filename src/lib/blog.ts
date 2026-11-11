import { getCollection, type CollectionEntry } from 'astro:content';
import { publishedBlogHistories, validateBlogVersions, type BlogHistory } from './blog-revisions';

export type PublishedBlogHistory = BlogHistory<CollectionEntry<'blog'>>;

export async function getPublishedBlogHistories(): Promise<PublishedBlogHistory[]> {
  const histories = validateBlogVersions(await getCollection('blog'));
  return publishedBlogHistories(histories);
}

export async function getPublishedBlogEntries(): Promise<CollectionEntry<'blog'>[]> {
  return (await getPublishedBlogHistories()).map(({ latest }) => latest);
}
