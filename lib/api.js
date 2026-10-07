import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content', 'insights');

export function getPostSlugs(locale) {
  const langDir = path.join(contentDirectory, locale);
  if (!fs.existsSync(langDir)) return [];
  return fs.readdirSync(langDir).filter(file => file.endsWith('.md'));
}

export function getPostBySlug(slug, locale) {
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = path.join(contentDirectory, locale, `${realSlug}.md`);
  if (!fs.existsSync(fullPath)) return null;
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  return { slug: realSlug, meta: data, content };
}

export function getAllPosts(locale) {
  const slugs = getPostSlugs(locale);
  const posts = slugs
    .map((slug) => getPostBySlug(slug, locale))
    .sort((post1, post2) => (post1.meta.date > post2.meta.date ? -1 : 1));
  return posts;
}
