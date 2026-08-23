# NoIX Page

基于 [Astro 7](https://astro.build) 的纯静态个人站点，支持国际化、暗色模式、全站搜索及 Canvas 粒子特效。

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Astro v7 (SSG) |
| 语言 | TypeScript |
| 字体 | LXGW WenKai / LXGW WenKai Mono（霞鹜文楷） |
| 图标 | Phosphor Icons |
| 部署 | Docker + Nginx |

## 功能

- **国际化**：简体中文 / 繁体中文 / English / 日本語
- **暗色模式**：浅色 / 暗色主题切换，偏好持久化到 localStorage
- **粒子特效**：雨滴 / 萤火虫 / 樱花（Canvas 实现，隐藏时零 GPU 占用）
- **全站搜索**：覆盖页面、文章、作品、友链
- **友情链接**：友链展示与交换信息
- **响应式设计**：桌面 / 平板 / 手机三端适配

> 服务器状态监控已拆分至独立的 `NoIXStatus` 项目。

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 配置

复制 `.env.example` 为 `.env`，按需修改各字段：

```ini
# 站点信息
SITE_NAME=站点名称
SITE_DOMAIN=域名
SITE_URL=站点完整网址（如 https://example.com）
SITE_EMAIL=联系邮箱
SITE_COPYRIGHT=页脚版权信息

# 主页 Hero 区
HERO_NAME=昵称
HERO_SUBTITLE=副标题
HERO_QUOTE=个性引言

# 个人信息卡片
PROFILE_NAME=昵称
PROFILE_BIO=简介
PROFILE_BILIBILI=Bilibili 空间链接
PROFILE_GITHUB=GitHub 主页链接

# 状态挂件
STATUS_PLAYING=正在玩的游戏
STATUS_MUSIC_TITLE=歌曲名 — 歌手
STATUS_MUSIC_URL=音乐链接

# 机器人/友链信息
BOT_NAME=Bot 名称
BOT_DESC=Bot 简介
MY_FRIEND_NAME=你的昵称
MY_FRIEND_DESC=站点描述
MY_FRIEND_URL=站点地址
```

## 内容管理

站点内容通过 [Astro 内容集合](https://docs.astro.build/en/guides/content-collections/) 管理，schema 定义在 `src/content.config.ts`：

| 集合 | 目录 | 字段 |
|------|------|------|
| 作品 `works` | `src/content/works/*.json` | `name` / `desc` / `url` |
| 友链 `friends` | `src/content/friends/*.json` | `name` / `desc` / `url` / `avatar` |
| 文章 `blog` | `src/content/blog/*.md` | `title` / `desc` / `date` + 正文 |
| 技术栈 `skills` | `src/content/skills/*.json` | `name` / `icon`（Phosphor 图标名） |
| 最近动态 `activity` | `src/content/activity/*.json` | `date` / `text` |
| 图集 `gallery` | `src/content/gallery/*.json` | `src` / `alt` / `caption` |

新增或修改内容只需在对应目录增删文件（图集图片放在 `public/gallery/`），无需改动代码。

## Docker 部署

确保已安装 Docker 和 Docker Compose。

```bash
# 1. 准备环境变量
cp .env.example .env
vim .env

# 2. 构建并启动
docker compose up -d --build
```

服务包含一个容器：

| 容器 | 说明 |
|------|------|
| `noix-site` | Nginx 静态站点（端口 80） |

## 目录结构

```
NoIXPage/
├── public/                # 静态资源（字体、头像、图集、纹理）
├── src/
│   ├── components/        # Astro 组件
│   ├── content/           # 内容集合（works/friends/blog/skills/activity/gallery）
│   ├── content.config.ts  # 内容集合 schema
│   ├── i18n/              # 国际化翻译字典
│   ├── layouts/           # 页面布局
│   ├── pages/
│   │   ├── [locale]/      # 按语言分组的页面路由
│   │   └── 404.astro      # 全局 404 页面
│   ├── styles/            # 全局样式
│   └── site.config.ts     # 站点配置（env 驱动）
├── Dockerfile             # Nginx 静态站点镜像
├── docker-compose.yml
├── nginx.conf
├── astro.config.mjs
└── .env.example
```

## 架构说明

### FX 特效组件

RainFX、FireflyFX、SakuraFX 三个 Canvas 特效共享同一模式：

- Canvas 初始隐藏（`display: none`），停止时完全不占用 GPU
- `Layout.astro` 内联脚本从 localStorage 读取偏好，设置 `<body>` 对应 class 后派发 `fx-init` 自定义事件
- 组件通过 `MutationObserver` + `fx-init` 事件双重监听，确保无论加载顺序如何都能正确启停

### 样式约定

- 暗色模式覆盖样式分散在各组件 `<style>` 中，通过 `body.dark` 选择器生效，`global.css` 提供兜底

## License

MIT
