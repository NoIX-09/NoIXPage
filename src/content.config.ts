import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 相关链接的地址：常常链回站内文章，所以站内路径（以 / 开头）也要放行，
// 不能一律用 z.string().url() —— 那样 `/zh-CN/blog/xxx` 会直接校验不通过
const linkUrl = z
  .string()
  .refine(
    (v) => /^https?:\/\//i.test(v) || v.startsWith('/'),
    '需要是 http(s) 绝对地址，或以 / 开头的站内路径'
  );

// 相关链接条目：作品详情页与文章详情页共用同一套（渲染见 components/PageLinks.astro）。
// icon 是 ph 图标名，astro.config 里 include 了整套 ph，写哪个都能用
const linkItem = z.object({
  label: z.string(),
  url: linkUrl,
  icon: z.string().default('ph:link-duotone'),
});

// 作品集合：src/content/works/*.md（frontmatter + 项目自述正文）
const works = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/works' }),
  schema: z.object({
    name: z.string(),
    desc: z.string().default(''),
    // 作品列表卡片上的图标（ph 图标名），每件作品挑一个贴题的
    icon: z.string().default('ph:palette-duotone'),
    // 列表排序，小的在前；不写则排在最后
    order: z.number().default(Number.MAX_SAFE_INTEGER),
    github: z.string().url().optional(),
    release: z.string().url().optional(),
    // 自定义相关链接，与 github / release 渲染在同一排按钮里
    links: z.array(linkItem).default([]),
    // 详情页顶部是否摆一座 Live2D 展示台（模型文件固定在 public/live2d 那套）
    live2d: z.boolean().default(false),
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
    // 可选：本篇文章的自定义 CSS（注入为全局样式，作用于 .post-body）。留空则用默认样式。
    style: z.string().default(''),
    // 相关链接，与作品详情页同一套
    links: z.array(linkItem).default([]),
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

export const collections = { works, friends, blog, skills, activity };
