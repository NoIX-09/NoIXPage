import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 作品集合：src/content/works/*.json
const works = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/works' }),
  schema: z.object({
    name: z.string(),
    desc: z.string().default(''),
    url: z.string().url(),
  }),
});

// 友链集合：src/content/friends/*.json
const friends = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/friends' }),
  schema: z.object({
    name: z.string(),
    desc: z.string().default(''),
    url: z.string().url(),
    avatar: z.string().default(''),
  }),
});

// 文章集合：src/content/blog/*.md
const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    desc: z.string().default(''),
    date: z.string(),
  }),
});

// 技术栈集合：src/content/skills/*.json
const skills = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/skills' }),
  schema: z.object({
    name: z.string(),
    icon: z.string().default(''),
  }),
});

// 最近动态集合：src/content/activity/*.json
const activity = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/activity' }),
  schema: z.object({
    date: z.string(),
    text: z.string(),
  }),
});

// 图集集合：src/content/gallery/*.json
const gallery = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/gallery' }),
  schema: z.object({
    src: z.string(),
    alt: z.string().default(''),
    caption: z.string().default(''),
  }),
});

export const collections = { works, friends, blog, skills, activity, gallery };
