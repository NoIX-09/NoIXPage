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
  i18n: {
    defaultLocale: 'zh-CN',
    locales: ['zh-CN', 'zh-TW', 'en', 'ja'],
    routing: { prefixDefaultLocale: true },
  },
});
