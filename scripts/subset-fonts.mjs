// scripts/subset-fonts.mjs
// 重新子集化字体：把原始 TTF 裁剪为单文件 woff2，只保留站点实际用到的字符。
// 用法：
//   python -m venv .venv && .venv/Scripts/python -m pip install fonttools brotli
//   node scripts/subset-fonts.mjs
// 注意：fonts-src/（原始 TTF，来自 NoIXStatus 仓库 public/）已被 gitignore，需自行放入后再重跑。
//
// 字符集不在这里定义，见 font-charset.mjs；字体清单见 font-list.mjs。
// 切完会自动跑一遍覆盖校验（同 check-fonts.mjs），确保源 TTF 里确实有这些字形 ——
// 字符在字符集里、源字体却没有，也一样会静默掉字。
import { spawnSync } from 'node:child_process';
import { writeFileSync, statSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { buildTextCharset, buildMonoCharset } from './font-charset.mjs';
import { fonts } from './font-list.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
// 用项目内虚拟环境的 Python，避免污染本机环境
const venvPython = process.platform === 'win32'
  ? path.join(root, '.venv', 'Scripts', 'python.exe')
  : path.join(root, '.venv', 'bin', 'python');

if (!existsSync(venvPython)) {
  console.error('缺少虚拟环境：请先运行  python -m venv .venv && .venv/Scripts/python -m pip install fonttools brotli');
  process.exit(1);
}

// —— 准备两套字符集 ——
const charsets = {
  text: [...buildTextCharset(root)].sort().join(''),
  mono: [...buildMonoCharset()].sort().join(''),
};
const charsetFiles = {};
for (const [kind, chars] of Object.entries(charsets)) {
  const f = path.join(__dirname, `.subset-chars-${kind}.txt`);
  writeFileSync(f, chars);
  charsetFiles[kind] = f;
  console.log(`字符集 ${kind}：共 ${[...chars].length} 个字符`);
}

// —— 逐个字体子集化 ——
let total = 0;
for (const f of fonts) {
  mkdirSync(path.join(root, path.dirname(f.out)), { recursive: true });
  console.log(`\n子集化 ${path.basename(f.src)} → ${path.basename(f.out)}`);
  const r = spawnSync(venvPython, [
    '-m', 'fontTools.subset', path.join(root, f.src),
    `--text-file=${charsetFiles[f.charset]}`,
    '--flavor=woff2',
    `--output-file=${path.join(root, f.out)}`,
    '--layout-features=*', '--no-hinting',
  ], { encoding: 'utf8' });
  if (r.status !== 0) { console.error(r.stderr || r.stdout); process.exit(1); }
  const kb = statSync(path.join(root, f.out)).size / 1024;
  total += kb;
  console.log(`  完成：${kb.toFixed(1)} KB`);
}
console.log(`\n合计 ${(total / 1024).toFixed(2)} MB`);

// —— 生成 @font-face CSS ——
const css = fonts.map(f =>
  `@font-face{font-family:"${f.family}";src:url("./${path.basename(path.dirname(f.out))}/${path.basename(f.out)}") format("woff2");font-style:normal;font-weight:${f.weight};font-display:swap;}`
).join('\n') + '\n';
writeFileSync(path.join(root, 'public/fonts/fonts.css'), css);
console.log('已生成 public/fonts/fonts.css');

// —— 切完自检：源 TTF 里是不是真有这些字形 ——
const { verifyCoverage } = await import('./check-fonts.mjs');
const { textFonts } = await import('./font-list.mjs');
const { total: siteTotal, missing } = verifyCoverage(root, textFonts);
if (missing.size === 0) {
  console.log(`\n✓ 子集覆盖站点全部 ${siteTotal} 个用字`);
} else {
  console.warn(`\n⚠ 站点用了 ${siteTotal} 个字，其中 ${missing.size} 个源 TTF 里就没有字形，会回落到系统字体：`);
  for (const [ch, weights] of missing) console.warn(`    ${ch}  (缺：${weights.join(' / ')})`);
}
