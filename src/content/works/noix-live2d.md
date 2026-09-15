---
name: 琉璃 NoIX
desc: 纸上琉璃，顾盼生辉。
icon: ph:user-focus-duotone
order: 3
# 详情页顶部的 Live2D 展示台
live2d: true
links:
  - label: 设定与图鉴
    url: /zh-CN/blog/noix-mascot
    icon: ph:book-open-text-duotone
---

站点的看板娘，能在网页里实时驱动的 **Live2D 半身模型**。

现在站点里同时留着两种形态：静态立绘，和会呼吸、会看你的 Live2D，一键切换。

## 形象

- 深褐长发、猫耳，一顶带月牙坠饰的尖顶帽
- 深色洋装衬白蕾丝，身边总跟着一只小黑猫
- 同一套设定延伸出首页、页脚、404、加载动画四张静态立绘

## 模型

| 项 | 说明 |
|------|------|
| 格式 | Live2D Cubism `moc3` |
| 组成 | 模型 + 物理（`physics3`）+ 显示信息（`cdi3`），单张 2048 贴图 |
| 驱动 | 物理摆动、自动眨眼、视线跟随 |
| 还没有 | 动作库（`motion3`）与表情（`exp3`）——目前靠参数直驱，动作集还没做 |

贴图原本是 3.1MB 的 PNG，转成 WebP 后降到 425KB。转换后用 `gl.readPixels` 逐像素比对过两种格式的实际渲染输出，不透明像素数与平均色值完全一致，肉眼无差。

## 网页接入

- `pixi.js` + `pixi-live2d-display`（cubism4 运行时），Cubism Core 以全局脚本引入
- **空闲时加载**：页面其余部分先跑完，模型在 `requestIdleCallback` 里才开始拉取，不挡首屏
- **视线跟随**：指针在页面任意位置移动都会驱动 `focus()`，停手 700ms 后回正；触屏按下跟随、抬起回待机，且不抢竖向滚动
- **失败兜底**：模型未就绪或加载失败时显示静态立绘，画布就绪后再叠上去

角色的设定与图鉴见[站点看板娘 琉璃NoIX 设定展示](/zh-CN/blog/noix-mascot)。
