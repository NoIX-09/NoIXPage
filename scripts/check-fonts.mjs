// scripts/check-fonts.mjs
// 校验 public/fonts 下已入库的字体子集，是否覆盖站点当前的全部用字。
//
// 为什么要这个：字符集是「扫 src/ 得到站点用字」算出来的，站点一加新文章、新文案，
// 子集就落后了 —— 漏掉的字不会报错，只会静默回落到系统字体，肉眼未必立刻发现。
// 这个脚本把「跑没跑子集化」从记性问题变成一条命令。
//
// 用法：node scripts/check-fonts.mjs          （写完内容后跑一下）
// 覆盖不到时以非零码退出，可直接挂进 CI。
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { collectSiteChars } from './font-charset.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const venvPython = process.platform === 'win32'
  ? path.join(root, '.venv', 'Scripts', 'python.exe')
  : path.join(root, '.venv', 'bin', 'python');

// 读出某个字体文件实际带上了哪些字符，返回其中缺失的那批。
// 交给 fontTools 读 cmap —— woff2 也能直接开，不用先解压。
//
// 结果走文件而不是 stdout：Windows 上 Python 的 stdout 默认用系统本地编码
// （中文系统是 GBK），汉字经管道过来会被 Node 按 UTF-8 解成乱码，
// 校验就废了。文件读写两边都钉死 utf-8。
function missingIn(fontFile, chars) {
  const inFile = path.join(__dirname, '.check-chars.txt');
  const outFile = path.join(__dirname, '.check-missing.txt');
  writeFileSync(inFile, [...chars].join(''), 'utf8');
  const py = [
    'import sys',
    'from fontTools.ttLib import TTFont',
    'chars = set(open(sys.argv[2], encoding="utf-8").read())',
    'cmap = set(TTFont(sys.argv[1]).getBestCmap().keys())',
    'out = "".join(sorted(c for c in chars if ord(c) not in cmap))',
    'open(sys.argv[3], "w", encoding="utf-8").write(out)',
  ].join('\n');
  try {
    const r = spawnSync(venvPython, ['-c', py, fontFile, inFile, outFile], { encoding: 'utf8' });
    if (r.status !== 0) throw new Error(`读取 ${path.basename(fontFile)} 失败：${r.stderr || r.stdout}`);
    return [...readFileSync(outFile, 'utf8')];
  } finally {
    for (const f of [inFile, outFile]) { try { unlinkSync(f); } catch { /* 没生成就算了 */ } }
  }
}

/** 校验给定的正文字体是否覆盖站点用字；返回缺失字符（去重后合并） */
export function verifyCoverage(root, fonts) {
  const chars = collectSiteChars(root);
  const missing = new Map(); // 字符 → 缺它的字体名
  for (const f of fonts) {
    const p = path.join(root, f.out);
    if (!existsSync(p)) {
      console.warn(`  ⚠ 跳过 ${path.basename(f.out)}（文件不存在，先跑 node scripts/subset-fonts.mjs）`);
      continue;
    }
    for (const ch of missingIn(p, chars)) {
      if (!missing.has(ch)) missing.set(ch, []);
      missing.get(ch).push(f.weight);
    }
  }
  return { total: chars.size, missing };
}

// 被 import 时不跑 CLI 分支（subset-fonts.mjs 会引用上面的 verifyCoverage）。
// 用 pathToFileURL 而不是手拼 file:// —— Windows 的盘符与反斜杠拼不出合法 URL
const invokedDirectly = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (invokedDirectly) {
  if (!existsSync(venvPython)) {
    console.error('缺少虚拟环境：请先运行  python -m venv .venv && .venv/Scripts/python -m pip install fonttools brotli');
    process.exit(1);
  }
  const { textFonts } = await import('./font-list.mjs');
  const { total, missing } = verifyCoverage(root, textFonts);
  if (missing.size === 0) {
    console.log(`✓ 字体子集覆盖站点全部 ${total} 个用字`);
  } else {
    console.error(`✗ 站点用了 ${total} 个字，其中 ${missing.size} 个不在字体子集里：`);
    for (const [ch, weights] of missing) console.error(`    ${ch}  (缺：${weights.join(' / ')})`);
    console.error('\n重跑 node scripts/subset-fonts.mjs 即可收录。');
    process.exit(1);
  }
}
