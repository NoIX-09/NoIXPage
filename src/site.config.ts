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
  avatar: '/head.jpg',
  name: import.meta.env.PROFILE_NAME,
  bio: import.meta.env.PROFILE_BIO,
  social: {
    bilibili: import.meta.env.PROFILE_BILIBILI,
    github: import.meta.env.PROFILE_GITHUB,
    email: import.meta.env.SITE_EMAIL,
  },
};

export const status = {
  online: 'Online',
  playing: import.meta.env.STATUS_PLAYING,
  music: {
    title: import.meta.env.STATUS_MUSIC_TITLE,
    url: import.meta.env.STATUS_MUSIC_URL,
  },
};

export const bot = {
  name: import.meta.env.BOT_NAME,
  desc: import.meta.env.BOT_DESC,
};

export const myFriendInfo = {
  name: import.meta.env.MY_FRIEND_NAME,
  desc: import.meta.env.MY_FRIEND_DESC,
  url: import.meta.env.MY_FRIEND_URL,
  avatar: '/head.jpg',
};
