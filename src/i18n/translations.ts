export type Locale = 'zh-CN' | 'zh-TW' | 'en' | 'ja';
export const LOCALES: Locale[] = ['zh-CN', 'zh-TW', 'en', 'ja'];

type Dict = Record<string, Record<Locale, string>>;

const dict: Dict = {
  'nav.home':        { 'zh-CN': '首页',   'zh-TW': '首頁',   en: 'Home',   ja: 'ホーム' },
  'nav.works':       { 'zh-CN': '作品',   'zh-TW': '作品',   en: 'Works',  ja: '作品' },
  'nav.blog':        { 'zh-CN': '文章',   'zh-TW': '文章',   en: 'Blog',   ja: 'ブログ' },
  'nav.friends':     { 'zh-CN': '友链',   'zh-TW': '友鏈',   en: 'Friends', ja: '友達' },
  'nav.search':      { 'zh-CN': '搜索...', 'zh-TW': '搜尋...', en: 'Search...', ja: '検索...' },
  'nav.language':    { 'zh-CN': '语言',   'zh-TW': '語言',   en: 'Lang',  ja: '言語' },
  'nav.theme':       { 'zh-CN': '主题',   'zh-TW': '主題',   en: 'Theme',  ja: 'テーマ' },
  'nav.effects':     { 'zh-CN': '粒子效果', 'zh-TW': '粒子效果', en: 'Particles', ja: 'パーティクル' },
  'nav.mascot':      { 'zh-CN': '看板娘', 'zh-TW': '看板娘', en: 'Mascot', ja: '看板娘' },
  'nav.title.home':  { 'zh-CN': '首页',   'zh-TW': '首頁',   en: 'Home',   ja: 'ホーム' },
  'nav.title.works': { 'zh-CN': '作品',   'zh-TW': '作品',   en: 'Works',  ja: '作品' },
  'nav.title.blog':  { 'zh-CN': '文章',   'zh-TW': '文章',   en: 'Blog',   ja: 'ブログ' },
  'nav.title.friends':{ 'zh-CN': '友链',  'zh-TW': '友鏈',   en: 'Friends', ja: '友達' },

  'profile.bilibili': { 'zh-CN': 'Bilibili', 'zh-TW': 'Bilibili', en: 'Bilibili', ja: 'Bilibili' },
  'profile.github':   { 'zh-CN': 'GitHub',   'zh-TW': 'GitHub',   en: 'GitHub',   ja: 'GitHub' },
  'profile.email':    { 'zh-CN': 'Email',    'zh-TW': 'Email',    en: 'Email',    ja: 'メール' },

  'status.yi':        { 'zh-CN': '宜', 'zh-TW': '宜', en: 'Good for', ja: '宜' },
  'status.ji':        { 'zh-CN': '忌', 'zh-TW': '忌', en: 'Avoid',    ja: '忌' },

  'bot.viewToggle':   { 'zh-CN': '切换立绘', 'zh-TW': '切換立繪', en: 'Switch art', ja: '立ち絵切替' },
  'bot.statusOnline': { 'zh-CN': '在线', 'zh-TW': '線上', en: 'Online', ja: 'オンライン' },
  'bot.statusIdle':   { 'zh-CN': '待机', 'zh-TW': '待機', en: 'Idle',   ja: '待機中' },

  'friends.title':          { 'zh-CN': '友链',     'zh-TW': '友鏈',     en: 'Friends',        ja: '友達リンク' },
  'friends.emptyHint':      { 'zh-CN': '还没有友链，等待朋友们加入...', 'zh-TW': '還沒有友鏈，等待朋友們加入...', en: 'No friends yet...', ja: 'まだ友達がいません...' },
  'friends.exchangeTitle':  { 'zh-CN': '交换友链', 'zh-TW': '交換友鏈', en: 'Link Exchange',   ja: '相互リンク' },
  'friends.exchangeDesc':   { 'zh-CN': '如果对我的内容感兴趣，欢迎交换友链。添加前请确保你的网站可正常访问，然后通过邮件联系我。', 'zh-TW': '如果對我的內容感興趣，歡迎交換友鏈。添加前請確保你的網站可正常訪問，然後通過郵件聯系我。', en: 'If you enjoy my content, feel free to exchange links.', ja: '私のコンテンツが気に入ったら、相互リンクしませんか。' },
  'friends.labelName':      { 'zh-CN': '名称', 'zh-TW': '名稱', en: 'Name',   ja: '名前' },
  'friends.labelUrl':       { 'zh-CN': '网址', 'zh-TW': '網址', en: 'URL',    ja: 'URL' },
  'friends.labelAvatar':    { 'zh-CN': '头像', 'zh-TW': '頭像', en: 'Avatar', ja: 'アイコン' },
  'friends.labelDesc':      { 'zh-CN': '描述', 'zh-TW': '描述', en: 'Desc',   ja: '説明' },

  'blog.title':       { 'zh-CN': '文章',   'zh-TW': '文章',   en: 'Blog',  ja: 'ブログ' },
  'blog.emptyHint':   { 'zh-CN': '还没有文章', 'zh-TW': '還沒有文章', en: 'No posts yet', ja: 'まだ記事がありません' },
  'blog.backHome':    { 'zh-CN': '返回首页', 'zh-TW': '返回首頁', en: 'Back to Home', ja: 'ホームに戻る' },

  'works.title':      { 'zh-CN': '作品',   'zh-TW': '作品',   en: 'Works', ja: '作品' },
  'works.emptyHint':  { 'zh-CN': '还没有作品', 'zh-TW': '還沒有作品', en: 'No works yet', ja: 'まだ作品がありません' },
  'works.github':     { 'zh-CN': 'GitHub 仓库', 'zh-TW': 'GitHub 倉庫', en: 'GitHub Repository', ja: 'GitHub リポジトリ' },
  'works.release':    { 'zh-CN': '下载发行版', 'zh-TW': '下載發行版', en: 'Download Release', ja: 'リリースをダウンロード' },
  'works.back':       { 'zh-CN': '返回作品列表', 'zh-TW': '返回作品列表', en: 'Back to Works', ja: '作品一覧に戻る' },
  // Live2D 展示台的提示：模型会跟指针，不点一句没人会知道能互动
  'works.live2dHint': { 'zh-CN': '试着动一下鼠标，琉璃会看过来', 'zh-TW': '試著動一下滑鼠，琉璃會看過來', en: 'Move your cursor — her eyes will follow', ja: 'カーソルを動かすと、彼女は視線で追いかけます' },

  'home.techStack':   { 'zh-CN': '技术栈',   'zh-TW': '技術棧',   en: 'Tech Stack', ja: '技術スタック' },
  'home.activity':    { 'zh-CN': '最近动态', 'zh-TW': '最近動態', en: 'Recent',      ja: '最近の動き' },

  '404.message':      { 'zh-CN': '404 Not Found', 'zh-TW': '404 Not Found', en: '404 Not Found', ja: '404 Not Found' },
  '404.back':         { 'zh-CN': '← 返回首页',    'zh-TW': '← 返回首頁',   en: '← Back to Home', ja: '← ホームに戻る' },
  '404.backBlog':     { 'zh-CN': '← 返回文章列表', 'zh-TW': '← 返回文章列表', en: '← Back to Blog', ja: '← ブログに戻る' },
  '404.postNotFound': { 'zh-CN': '找不到这篇文章', 'zh-TW': '找不到這篇文章', en: 'Post not found', ja: '記事が見つかりません' },
  '404.workNotFound': { 'zh-CN': '找不到这个作品', 'zh-TW': '找不到這個作品', en: 'Work not found', ja: '作品が見つかりません' },

  'search.placeholder': { 'zh-CN': '输入关键词搜索...', 'zh-TW': '輸入關鍵詞搜尋...', en: 'Type to search...', ja: 'キーワードを入力...' },
  'search.empty':       { 'zh-CN': '未找到相关结果',   'zh-TW': '未找到相關結果',   en: 'No results found', ja: '結果が見つかりません' },
  'search.init':        { 'zh-CN': '输入关键词开始搜索', 'zh-TW': '輸入關鍵詞開始搜尋', en: 'Type to start searching', ja: 'キーワードを入力して検索' },
  'search.initHint':    { 'zh-CN': '可搜索页面、文章、作品、友链', 'zh-TW': '可搜尋頁面、文章、作品、友鏈', en: 'Search pages, posts, works, friends', ja: 'ページ、記事、作品、友達を検索' },
  'search.type.page':   { 'zh-CN': '页面', 'zh-TW': '頁面', en: 'Page',   ja: 'ページ' },
  'search.type.post':   { 'zh-CN': '文章', 'zh-TW': '文章', en: 'Post',   ja: '記事' },
  'search.type.work':   { 'zh-CN': '作品', 'zh-TW': '作品', en: 'Work',   ja: '作品' },
  'search.type.friend': { 'zh-CN': '友链', 'zh-TW': '友鏈', en: 'Friend', ja: '友達' },

  'backToTop': { 'zh-CN': '回到顶部', 'zh-TW': '回到頂部', en: 'Back to top', ja: 'トップに戻る' },
};

export function t(key: string, locale: Locale): string {
  return dict[key]?.[locale] ?? key;
}

// Locale labels for the language switcher
export const localeLabels: Record<Locale, string> = {
  'zh-CN': '简中',
  'zh-TW': '繁中',
  en: 'EN',
  ja: '日本語',
};
