// scripts/font-charset.mjs
// 字符集收集：subset-fonts.mjs（切子集）与 check-fonts.mjs（校验漏字）共用一份，
// 免得两边的扫描范围渐渐对不上、校验形同虚设。
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

function range(lo, hi) {
  let s = '';
  for (let cp = lo; cp <= hi; cp++) s += String.fromCodePoint(cp);
  return s;
}

// 标点与符号。两个字体族都要：正文里的破折号、代码块里的箭头都靠它们。
const PUNCT_RANGES = [
  [0x20, 0x7e],     // ASCII 可打印
  [0xa0, 0xff],     // Latin-1（NBSP + 变音拉丁字母）
  [0x2010, 0x206f], // 通用标点（破折号/引号/省略号）
  [0x2190, 0x21ff], // 箭头（→←↑↓，注释与终端输出常用）
  [0x2200, 0x22ff], // 数学运算符（×÷≤≥≠≈）
  [0x2500, 0x259f], // 制表框线 / 方块（终端输出、ASCII 图）
];

// 汉字与和文相关的区段。只有正文用到的文楷字体族需要，
// 等宽那个只服务于日期与代码，扛 CJK 纯属浪费（实测 888 KB → 21 KB）。
const CJK_RANGES = [
  [0x3000, 0x303f], // CJK 标点（、。「」《》）
  [0x3040, 0x30ff], // 平假名 + 片假名
  [0xff00, 0xffef], // 全角形式
];

function fromRanges(ranges) {
  let s = '';
  for (const [lo, hi] of ranges) s += range(lo, hi);
  return s;
}

// 扫哪些目录找站点用字 —— 内容集合在 src/content 下，新增文章自然被带上
const SCAN_DIRS = ['src/i18n', 'src/content', 'src/pages', 'src/components', 'src/layouts'];

function walk(dir, out) {
  let files;
  try { files = readdirSync(dir); } catch { return out; }
  for (const f of files) {
    const p = path.join(dir, f);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, out);
    else if (/\.(astro|ts|md|json|mdx)$/.test(f)) out.push(p);
  }
  return out;
}

/**
 * 扫 src/ 与 .env，返回站点真正会渲染出的汉字/和文字符。
 * 只收码位 > 0x2e80 的（CJK 起始区），拉丁与标点由 PUNCT_RANGES 固定覆盖。
 */
export function collectSiteChars(root) {
  const set = new Set();
  const addText = (t) => {
    if (!t) return;
    for (const ch of t) if (ch.codePointAt(0) > 0x2e80) set.add(ch);
  };

  const files = [];
  for (const r of SCAN_DIRS) walk(path.join(root, r), files);
  for (const f of files) {
    try { addText(readFileSync(f, 'utf8')); } catch { /* 读不了就跳过 */ }
  }
  try {
    for (const line of readFileSync(path.join(root, '.env'), 'utf8').split(/\r?\n/)) {
      const i = line.indexOf('=');
      if (i > 0) addText(line.slice(i + 1).trim());
    }
  } catch { /* 没有 .env 也能跑 */ }

  return set;
}

/**
 * 正文文楷字体的字符集：固定标点 + CJK 区段 + 站点实际用字。
 *
 * 这里**不再并入 common-3500.txt**。那份 3500 常用字是早期的保险，
 * 实测站点只用到其中 797 个，另外 2703 字（77%）从没出现过，
 * 却让每个字重多背约 660 KB。站点用字本来就是自动扫出来的，
 * 保险换来的只是「新写的字不会掉到系统字体」，代价太大 ——
 * 改成由 check-fonts.mjs 在漏字时报警（见该文件）。
 */
export function buildTextCharset(root) {
  const set = new Set(fromRanges([...PUNCT_RANGES, ...CJK_RANGES]));
  for (const ch of collectSiteChars(root)) set.add(ch);
  return set;
}

/** 等宽字体的字符集：只要标点区段。中文走字体栈回落到文楷（见各处的 font-family） */
export function buildMonoCharset() {
  return new Set(fromRanges(PUNCT_RANGES));
}
