// @ts-check
import { defineConfig } from 'astro/config';
import icon from 'astro-icon';

// 加载项目根目录的 .env（若存在），使 SITE_URL 可用
try {
  process.loadEnvFile('.env');
} catch {}

// https://astro.build/config
export default defineConfig({
  // 站点完整网址，从 .env 的 SITE_URL 读取（用于生成规范的绝对链接）
  site: process.env.SITE_URL || 'http://localhost:4321',
  integrations: [icon({
    include: { ph: ['*'] },
  })],
  // 让 <Image> 与 markdown 正文里的图片按显示宽度生成 srcset。
  // 注意 sizes 由 Astro 按「图片固有宽度 vs 视口」推出（getSizesAttribute），没有配置项
  // 能覆盖：constrained 会编成 `(min-width: <固有宽>px) <固有宽>px, 100vw`。固有宽度比
  // 真实展示宽度大多少，浏览器就可能多拉多少倍的图 —— 所以素材按展示宽度存放、母版另放
  // assets-src/（gitignore），正文大图就是这么从 2480px 降到 880px 的。
  image: {
    layout: 'constrained',
    responsiveStyles: true,
  },
  i18n: {
    defaultLocale: 'zh-CN',
    locales: ['zh-CN', 'zh-TW', 'en', 'ja'],
    routing: { prefixDefaultLocale: true },
  },
  markdown: {
    shikiConfig: {
      theme: 'css-variables',
    },
  },
});
