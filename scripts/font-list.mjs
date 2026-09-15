// scripts/font-list.mjs
// 字体清单：subset-fonts.mjs（切子集并生成 @font-face）与 check-fonts.mjs（校验漏字）共用。
//
// charset 决定这个字重带哪套字符集：
//   'text' —— 正文文楷，标点 + CJK 区段 + 站点用字
//   'mono' —— 等宽，只要标点；代码块里的中文靠字体栈回落到文楷，不必自己扛
//
// weight 300（Light）已移除：全站只有 home.astro 的 hero 两行用到，
// 却要单独背一份近 300 KB 的子集，已把这两行并入 400。
export const fonts = [
  { family: 'LXGW WenKai', weight: 400, charset: 'text', src: 'fonts-src/LXGWWenKaiGB-Regular.ttf', out: 'public/fonts/wenkai-regular/wenkai-regular.woff2' },
  { family: 'LXGW WenKai', weight: 500, charset: 'text', src: 'fonts-src/LXGWWenKaiGB-Medium.ttf', out: 'public/fonts/wenkai-medium/wenkai-medium.woff2' },
  { family: 'LXGW WenKai Mono', weight: 400, charset: 'mono', src: 'fonts-src/LXGWWenKaiMonoGB-Regular.ttf', out: 'public/fonts/wenkai-mono-regular/wenkai-mono-regular.woff2' },
];

/** 需要覆盖站点全部用字的字体（等宽那个只服务代码与日期，不管中文） */
export const textFonts = fonts.filter((f) => f.charset === 'text');
