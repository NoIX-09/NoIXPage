# CLAUDE.md

NoIX Page — 基于 Astro 7 的个人站点，支持多语言（`zh-CN` / `zh-TW` / `en` / `ja`），Docker 部署。

## 开发命令

```bash
# 启动开发服务器（后台运行）
astro dev --background

# 管理后台服务器
astro dev stop      # 停止
astro dev status    # 查看状态
astro dev logs      # 查看日志
```

## 项目结构

```
NoIXPage/
├── src/
│   ├── pages/[locale]/      # 页面：home、blog、works、friends、search
│   ├── components/          # Astro 组件
│   │   ├── Layout.astro       # 根布局：内联主题/FX 初始化脚本，派发 fx-init 事件
│   │   ├── Navbar.astro       # 顶栏：品牌标识、导航链接、语言切换、搜索、汉堡菜单
│   │   ├── Profile.astro      # 个人信息卡片（头像、简介、社交链接）
│   │   ├── NoIXCard.astro     # 机器人/友链卡片
│   │   ├── SearchCard.astro   # 搜索结果卡片
│   │   ├── Status.astro       # 音乐/游戏状态挂件
│   │   ├── TechStack.astro    # 首页技术栈卡片
│   │   ├── Activity.astro     # 首页最近动态卡片
│   │   ├── Gallery.astro      # 首页图集卡片
│   │   ├── BackToTop.astro    # 回到顶部按钮
│   │   ├── RainFX.astro       # Canvas 雨滴特效（fx-rain）
│   │   ├── FireflyFX.astro    # Canvas 萤火虫特效（fx-firefly）
│   │   └── SakuraFX.astro     # Canvas 樱花特效（fx-sakura）
│   ├── layouts/Layout.astro
│   ├── styles/global.css
│   ├── i18n/translations.ts   # 多语言文案
│   ├── site.config.ts         # 站点配置（env 驱动）
│   ├── content.config.ts      # 内容集合 schema（works / friends / blog / skills / activity / gallery）
│   └── content/               # 内容集合
│       ├── works/*.json         # 作品：name / desc / url
│       ├── friends/*.json       # 友链：name / desc / url / avatar
│       ├── blog/*.md            # 文章：title / desc / date + 正文
│       ├── skills/*.json        # 技术栈：name / icon（ph 图标名）
│       ├── activity/*.json      # 最近动态：date / text
│       └── gallery/*.json       # 图集：src / alt / caption
├── nginx.conf
└── docker-compose.yml
```

## 架构约定

### FX 特效组件

- 每个 FX 画布默认隐藏（`display:none`）
- `Layout.astro` 内联脚本从 localStorage 读取偏好，给 `<body>` 设置对应 class（如 `fx-sakura`、`fx-firefly`），然后派发 `fx-init` 自定义事件
- FX 组件通过 `MutationObserver`（监听 class 变化）和 `fx-init` 事件（Layout 延迟初始化）双重机制控制启停，由 `running` 标志位防止重复执行

### 样式规范

- **暗色模式**：每个组件的 `<style>` 内定义 `body.dark` 覆盖样式，`global.css` 提供兜底
- **移动端汉堡菜单**：使用 `translateZ(0)` GPU 加速修复渲染问题

### i18n

- 支持 `zh-CN`、`zh-TW`、`en`、`ja`
- 页面按 `src/pages/[locale]/` 组织

## 外部文档

完整文档：https://docs.astro.build

涉及以下任务时先查阅对应指南：

- [添加页面、动态路由或中间件](https://docs.astro.build/en/guides/routing/)
- [编写 Astro 组件](https://docs.astro.build/en/basics/astro-components/)
- [使用 React/Vue/Svelte 等框架组件](https://docs.astro.build/en/guides/framework-components/)
- [添加或管理内容集合](https://docs.astro.build/en/guides/content-collections/)
- [添加样式或使用 Tailwind](https://docs.astro.build/en/guides/styling/)
- [多语言支持](https://docs.astro.build/en/guides/internationalization/)
