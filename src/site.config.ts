export const site = {
  name: import.meta.env.SITE_NAME,
  domain: import.meta.env.SITE_DOMAIN,
  email: import.meta.env.SITE_EMAIL,
  copyright: import.meta.env.SITE_COPYRIGHT,
};

export const hero = {
  name: import.meta.env.HERO_NAME,
  subtitle: import.meta.env.HERO_SUBTITLE,
  quote: import.meta.env.HERO_QUOTE,
};

export const profile = {
  name: import.meta.env.PROFILE_NAME,
  bio: import.meta.env.PROFILE_BIO,
  social: {
    bilibili: import.meta.env.PROFILE_BILIBILI,
    github: import.meta.env.PROFILE_GITHUB,
    email: import.meta.env.SITE_EMAIL,
  },
};

/** STATUS_ALMANAC 默认卡池（galgame 梗）：宜忌共用一个池子，逗号分隔（中英文逗号都认），设成空串即整块关掉 */
const ALMANAC_DEFAULT = [
  '便利店买肉包', '与学妹玩怪猎', 'Ciallo～(∠・ω<)⌒☆', '雪人语研究', '夕渚镇Setria咖啡馆打工',
  '图书馆0721', '在图书馆使用桌角', '“请看着我的0721吧”', '柚子社的“起爆器”研究', '给雪村千绘莉喂猕猴桃',
  '在咖啡馆发现兽耳娘的秘密', '煎蛋放白糖', '在秋千上淋雨等回复', '向一抹多撒娇抽卡', '躲在金发一抹多怀里哭',
  '使用宝特瓶', '去樱公馆当女仆', '在神社拔出从雨丸'
];

const words = (raw: string | undefined, fallback: string[]) =>
  (raw === undefined ? fallback : raw.split(/[,，]/)).map((s) => s.trim()).filter(Boolean);

export const status = {
  playing: import.meta.env.STATUS_PLAYING,
  music: {
    title: import.meta.env.STATUS_MUSIC_TITLE,
    url: import.meta.env.STATUS_MUSIC_URL,
  },
  /** 今日宜忌卡池：按日期做种子，每天从池里抽两个不重复的，先抽到的算宜、后抽到的算忌 */
  almanac: words(import.meta.env.STATUS_ALMANAC, ALMANAC_DEFAULT),
};

export const bot = {
  name: import.meta.env.BOT_NAME,
  desc: import.meta.env.BOT_DESC,
};

export const myFriendInfo = {
  name: import.meta.env.MY_FRIEND_NAME,
  desc: import.meta.env.MY_FRIEND_DESC,
  url: import.meta.env.MY_FRIEND_URL,
  avatar: import.meta.env.MY_FRIEND_AVATAR,
};
