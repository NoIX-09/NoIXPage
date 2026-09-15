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
│   ├── layouts/Layout.astro   # 根布局：<body> 顶部内联脚本恢复偏好，见「偏好模型」
│   ├── components/          # Astro 组件
│   │   ├── Navbar.astro       # 顶栏：品牌标识、导航链接、语言切换、搜索、汉堡菜单
│   │   ├── Profile.astro      # 个人信息卡片（头像、简介、社交链接）
│   │   ├── NoIXCard.astro     # 机器人/友链卡片（含 Live2D 舞台）
│   │   ├── Live2DViewer.astro # Live2D 舞台：pixi + cubism4，空闲时才延迟加载（可多实例）
│   │   ├── PageLinks.astro    # 详情页相关链接按钮排（作品 / 文章共用）
│   │   ├── SearchCard.astro   # 搜索结果卡片
│   │   ├── Status.astro       # 音乐/游戏状态挂件
│   │   ├── TechStack.astro    # 首页技术栈卡片
│   │   ├── Activity.astro     # 首页最近动态卡片
│   │   ├── Loading.astro      # 全屏加载动画，每次跳转放映
│   │   ├── Footer.astro       # 页脚（可选看板娘插图）
│   │   ├── BackToTop.astro    # 回到顶部按钮
│   │   ├── RainFX.astro       # Canvas 粒子效果：雨滴（fx-rain）
│   │   ├── FireflyFX.astro    # Canvas 粒子效果：萤火虫（fx-firefly）
│   │   └── SakuraFX.astro     # Canvas 粒子效果：樱花（fx-sakura）
│   ├── assets/             # 构建期优化图片（头像 head.jpg 等，经 astro:assets）
│   ├── styles/global.css
│   ├── i18n/translations.ts   # 多语言文案
│   ├── site.config.ts         # 站点配置（env 驱动）
│   ├── content.config.ts      # 内容集合 schema（works / friends / blog / skills / activity）
│   └── content/               # 内容集合
│       ├── works/*.md           # 作品：name / desc / icon / github / release / links / live2d + 正文（自述）
│       ├── friends/*.json       # 友链：name / desc / url / avatar
│       ├── blog/*.md            # 文章：title / desc / date / links + 正文
│       ├── skills/*.json        # 技术栈：name / icon（ph 图标名）
│       └── activity/*.json      # 最近动态：date / text
├── scripts/                # 字体子集化管线（subset-fonts / check-fonts / font-charset / font-list）
├── fonts-src/              # 原始 TTF（gitignore，本地子集化源）
├── live2d-src/             # Live2D 贴图母版 PNG（gitignore，转 WebP 用）
├── assets-src/             # 插画高分辨率母版（gitignore，按展示宽度压过再入库）
├── nginx.conf
└── docker-compose.yml
```

入库的图片素材按**真实展示宽度**存放，不直接放母版 —— 原因见「图片的 sizes 由固有宽度决定」。

## 架构约定

### 偏好模型

三个偏好存在 localStorage，由 `Layout.astro` 在 `<body>` **最前面**的内联脚本恢复（首帧前完成，跟随系统暗色时才不会闪一下浅色）：

| 偏好 | 首次进入的默认值 | 存储键 |
| --- | --- | --- |
| 昼夜 | 跟随系统，只在加载时判定一次、之后不跟系统变 | `theme`（全站共用） |
| 粒子 | 普通页按昼夜默认（浅色樱花 / 暗色萤火虫）；详情页默认关 | `fx:normal` / `fx:detail`（**两套互不影响**） |
| 看板娘 | 显示 | `mascot`（全站共用） |

- 详情页 = 文章正文 / 作品详情，判定依据是 `<body data-page-kind="detail">`
- 详情页的「默认关」不写进 localStorage，避免把「用户没选过」坐实成「用户选了关」

### 详情页的相关链接

作品的 github / release、以及任意自定义链接，与文章的相关链接共用一套：

- 数据在 frontmatter 的 `links`（作品、文章都有），条目是 `{ label, url, icon }`，`icon` 写 ph 图标名
- 渲染统一走 `components/PageLinks.astro`，按钮样式 `.page-actions` / `.action-btn` 放 `global.css` —— 组件自己的 `<style>` 会带 Astro 作用域属性，两处调用方各写一遍不划算
- `url` 允许站内路径（以 `/` 开头）或 http(s) 绝对地址；**只有外链**才加 `target=_blank` + `rel=noopener`，站内跳转不加（schema 里的 `linkUrl` 就是这个校验）
- 作品列表卡片的图标由作品 frontmatter 的 `icon` 决定，每件挑一个贴题的，默认 `ph:palette-duotone`

### Live2D 展示台

- 作品 frontmatter 写 `live2d: true` 就在详情页正文顶部摆一座
- 做法是 **`float: right`**：正文自然绕排到左侧，写到浮动下沿之后自动续成整宽，不用手工切正文
- 正文里满宽的元素（`table` / `pre` / `img`）必须 `clear: both`。它们的 `width: 100%` 是按**整个栏宽**算的，不 clear 就会直接铺到 Live2D 底下被压住
- 浮动不计入容器高度，`.post-body::after` 要 clearfix，否则正文短时整块会溢出到返回链接上
- ≤800px 取消浮动改成上下堆叠（此时正文栏 752px，减去 348px 浮动只剩 404px，再窄就不好读了）
- 展示台带 `data-mascot`：看板娘总开关能一并收起它，而且组件因 `display:none` 连模型都不会去下载。要让它常驻删掉该属性即可

### 粒子效果组件

- 每个粒子效果画布默认隐藏（`display:none`），停止时完全不占 GPU
- 偏好 class 挂在 `<body>` 上（`fx-rain` / `fx-firefly` / `fx-sakura` / `fx-none`）
- 粒子效果组件通过 `MutationObserver`（监听 class 变化）和 `fx-init` 事件双重机制控制启停，由 `running` 标志位防止重复执行

### 样式规范

- **暗色模式**：每个组件的 `<style>` 内定义 `body.dark` 覆盖样式，`global.css` 提供兜底
- **Astro 作用域陷阱**：`<html>`/`<body>` 上的 class（`mascot-off`、`body.dark`）做后代选择器时，前缀必须写成 `html.` / `body.`。Astro 只对 `html`、`body` 这两个**元素选择器**免于加作用域属性，写成 `.mascot-off .x` 会被编成 `.mascot-off[data-astro-cid-x] .x[data-astro-cid-x]`，而 `<html>` 上并没有这个属性 —— 规则静默失效、不报错。同理，组件 `<style>` 里给 markdown 正文（`<Content />` 渲染出的元素）写的选择器也匹配不到，正文排版一律放 `global.css`
- **移动端汉堡菜单**：使用 `translateZ(0)` GPU 加速修复渲染问题；顶栏用 `order` + `margin-left: auto` 排布，`.navbar` 加 `align-self: stretch` 铺满整宽（父容器 `.content` 为 `align-items: center`）

### 图片与字体

- **图片**走 `astro:assets`：头像在 `src/assets/`，构建期由 sharp 压缩为 WebP/AVIF
- **`sizes` 由图片固有宽度决定**：Astro 用 `getSizesAttribute()` 按「固有宽度 vs 视口」推 `sizes`，**没有配置项能覆盖**。所以 `<Image>` 的 `width` 必须写 CSS 里真实的展示宽度，源图也不要超过真实展示宽度，否则浏览器会按过大的 `sizes` 去挑档（写 `width={1760}` 而实际只显示 440px，就会白拉 4 倍大的图）；CSS 固定尺寸的图（`width:240px` 之类）用 `layout="fixed"`，`sizes` 直接等于该固定值。正文大图的母版因此放 `assets-src/`
- **背景纹理**用 AVIF，`image-set()` 选档，`@supports` 里给不支持的浏览器留 WebP 兜底。注意兜底**不能**和 AVIF 写成同一规则里的两条 `background-image` —— 构建时的 CSS 压缩会把被覆盖的那条直接删掉，兜底就没了
- **字体**由 `scripts/subset-fonts.mjs` 子集化为单文件 woff2（`fontTools.subset`）→ `public/fonts/<family>/<family>.woff2`，`public/fonts/fonts.css` 统一声明 `@font-face`（`font-display:swap` 整族一次替换）；原始 TTF 在 `fonts-src/`（gitignore），重跑先 `python -m venv .venv && .venv/Scripts/python -m pip install fonttools brotli` 再 `npm run fonts`
  - **字符集见 `scripts/font-charset.mjs`**，两套：正文文楷 = 固定标点区段 + CJK 区段 + 站点实际用字（扫 `src/` 与 `.env`）；等宽 = **只要标点区段**，汉字一个不带
  - **不要并入「常用汉字表」之类的保底字符集**：早期并进 3500 常用字，实测站点只用得到其中 797 字，另外 2703 字（77%）从没出现过，却让每个字重多背约 660 KB（该文件已删，历史见 commit 63617a8）。全站字体因此从 3.6 MB 降到 549 KB
  - 等宽字体不带汉字，代码块里的中文靠**字体栈回落**：`'LXGW WenKai Mono', 'LXGW WenKai', ...`，所以改字体栈时别把文楷那一项删掉
  - 字重只有 400 / 500 两档（Light 300 已砍，原来全站只有 hero 两行用到）
  - **写完内容跑 `npm run fonts:check`**：比对站点用字与已入库子集是否一致，漏字以非零码退出。漏字不会报错，只会静默掉到系统字体，所以别只靠肉眼
- **禁缩放**：`viewport` 设 `maximum-scale=1.0, user-scalable=no` + `html { touch-action: manipulation }`

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
