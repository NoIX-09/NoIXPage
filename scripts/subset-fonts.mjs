// scripts/subset-fonts.mjs
// 重新子集化字体：把 4 个全量 TTF 裁剪为单文件 woff2，只保留站点用字 + 3500 常用字 + 代码/标点字符。
// 用法：
//   python -m venv .venv && .venv/Scripts/python -m pip install fonttools brotli
//   node scripts/subset-fonts.mjs
// 注意：fonts-src/（原始 TTF，来自 NoIXStatus 仓库 public/）已被 gitignore，需自行放入后再重跑。
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
// 用项目内虚拟环境的 Python，避免污染本机环境
const venvPython = process.platform === 'win32'
  ? path.join(root, '.venv', 'Scripts', 'python.exe')
  : path.join(root, '.venv', 'bin', 'python');

function walk(dir, out) {
  for (const f of readdirSync(dir)) {
    const p = path.join(dir, f);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, out);
    else if (/\.(astro|ts|md|json|mdx)$/.test(f)) out.push(p);
  }
  return out;
}

function range(lo, hi) {
  let s = '';
  for (let cp = lo; cp <= hi; cp++) s += String.fromCodePoint(cp);
  return s;
}

// —— 收集字符集 ——
const set = new Set();
// ASCII 可打印（代码常用：字母/数字/运算符/括号）
for (const ch of range(0x20, 0x7e)) set.add(ch);
// Latin-1（NBSP + 变音拉丁字母）
for (const ch of range(0xa0, 0xff)) set.add(ch);
// 通用标点（破折号/引号/省略号/箭头…）
for (const ch of range(0x2010, 0x206f)) set.add(ch);
// CJK 标点（、。「」《》…）
for (const ch of range(0x3000, 0x303f)) set.add(ch);
// 平假名 + 片假名（日文）
for (const ch of range(0x3040, 0x30ff)) set.add(ch);
// 全角形式
for (const ch of range(0xff00, 0xffef)) set.add(ch);
// 箭头（→←↑↓…，注释/输出常用）
for (const ch of range(0x2190, 0x21ff)) set.add(ch);
// 数学运算符（×÷≤≥≠≈…）
for (const ch of range(0x2200, 0x22ff)) set.add(ch);
// 制表框线/方块（终端输出、ASCII 图）
for (const ch of range(0x2500, 0x259f)) set.add(ch);
// 3500 常用字
for (const ch of readFileSync(path.join(__dirname, 'common-3500.txt'), 'utf8').replace(/\s/g, '')) set.add(ch);
// 站点当前用字（src + .env 动态文案）
const srcFiles = [];
for (const r of ['src/i18n', 'src/content', 'src/pages', 'src/components', 'src/layouts']) walk(path.join(root, r), srcFiles);
const addText = (t) => { if (!t) return; for (const ch of t) { if (ch.codePointAt(0) > 0x2e80) set.add(ch); } };
for (const f of srcFiles) { try { addText(readFileSync(f, 'utf8')); } catch {} }
try {
  for (const line of readFileSync(path.join(root, '.env'), 'utf8').split(/\r?\n/)) {
    const i = line.indexOf('=');
    if (i > 0) addText(line.slice(i + 1).trim());
  }
} catch {}

const chars = [...set].sort().join('');
const charsFile = path.join(__dirname, '.subset-chars.txt');
writeFileSync(charsFile, chars);
console.log(`字符集：共 ${set.size} 个字符`);

// —— 字体清单（4 族，映射到原始 TTF）——
const fonts = [
  { family: 'LXGW WenKai', weight: 300, src: 'fonts-src/LXGWWenKaiGB-Light.ttf', out: 'public/fonts/wenkai-light/wenkai-light.woff2' },
  { family: 'LXGW WenKai', weight: 400, src: 'fonts-src/LXGWWenKaiGB-Regular.ttf', out: 'public/fonts/wenkai-regular/wenkai-regular.woff2' },
  { family: 'LXGW WenKai', weight: 500, src: 'fonts-src/LXGWWenKaiGB-Medium.ttf', out: 'public/fonts/wenkai-medium/wenkai-medium.woff2' },
  { family: 'LXGW WenKai Mono', weight: 400, src: 'fonts-src/LXGWWenKaiMonoGB-Regular.ttf', out: 'public/fonts/wenkai-mono-regular/wenkai-mono-regular.woff2' },
];

for (const f of fonts) {
  mkdirSync(path.join(root, path.dirname(f.out)), { recursive: true });
  console.log(`\n子集化 ${path.basename(f.src)} → ${path.basename(f.out)}`);
  if (!existsSync(venvPython)) {
    console.error('缺少虚拟环境：请先运行  python -m venv .venv && .venv/Scripts/python -m pip install fonttools brotli');
    process.exit(1);
  }
  const r = spawnSync(venvPython, ['-m', 'fontTools.subset', path.join(root, f.src), `--text-file=${charsFile}`, '--flavor=woff2', `--output-file=${path.join(root, f.out)}`, '--layout-features=*', '--no-hinting'], { encoding: 'utf8' });
  if (r.status !== 0) { console.error(r.stderr || r.stdout); process.exit(1); }
  const kb = (statSync(path.join(root, f.out)).size / 1024).toFixed(1);
  console.log(`  完成：${kb} KB`);
}

// —— 生成 @font-face CSS ——
const css = fonts.map(f =>
  `@font-face{font-family:"${f.family}";src:url("./${path.basename(path.dirname(f.out))}/${path.basename(f.out)}") format("woff2");font-style:normal;font-weight:${f.weight};font-display:swap;}`
).join('\n') + '\n';
writeFileSync(path.join(root, 'public/fonts/fonts.css'), css);
console.log('\n已生成 public/fonts/fonts.css');
