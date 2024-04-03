import {
  getBlogPermalink,
  getJoinPermalink,
  getDiscordPermalink,
  getAsset,
  getStorePermalink,
} from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Members',
      links: [
        {
          text: 'Join Us',
          href: getJoinPermalink(),
        },
        {
          text: 'Events',
          href: '/events',
        },
        {
          text: 'FAQ',
          href: getJoinPermalink() + '#faq',
        },
        {
          text: 'Plebnet Wiki',
          href: 'https://plebnet.wiki',
        },
      ],
    },
    {
      text: 'Resources',
      links: [
        {
          text: 'Testnet LNBits',
          href: 'https://testnet.plebnet.dev',
        },
        {
          text: 'Testnet LN Node',
          href: 'https://mempool.space/testnet/lightning/node/03ba00a57cec1cef4873065ad54d0912696274cc53155b29a3b1256720e33a0943',
        },
        {
          text: 'Rate Converter',
          href: 'https://rates.plebnet.dev',
        },
        {
          text: 'Nostr Relay',
          href: 'https://testnet.plebnet.dev/nostrrelay/1',
        },
        {
          text: 'Nostr Metadata',
          href: 'https://metadata.plebnet.dev/',
        },
        {
          text: 'All Resources',
          href: '/resources',
        },
        // {
        //   text: 'Signet Faucet (coming soon)',
        //   href: 'https://signet-faucet.plebnet.dev/',
        // },
        // {
        //   text: 'Signet LN Node',
        //   href: '',
        // },
      ],
    },
    {
      text: 'About',
      links: [
        {
          text: 'Our Story',
          href: '/about',
        },
        {
          text: 'Blog',
          href: getBlogPermalink(),
        },
        {
          text: 'Donate',
          href: '/donate',
        },
        {
          text: 'Discord',
          href: getDiscordPermalink(),
        },
      ],
    },
    {
      text: 'Store',
      href: getStorePermalink(),
      target: '_blank',
      rel: 'noopener noreferrer',
    },
  ],
  actions: [
    {
      type: 'orange',
      text: 'Donate',
      href: '/donate',
    },
    // adds a download button to the upper right nav on blog page
    // { type: 'button', text: 'Download', href: 'https://github.com/onwidget/astrowind' }
  ],
};

export const footerData = {
  links: [
    {
      title: 'Members',
      links: [
        { text: 'Join Us', href: getJoinPermalink() },
        { text: 'FAQ', href: getJoinPermalink() + '#faq' },
        { text: 'Events', href: '/events' },
        { text: 'Blog', href: '/blog' },
      ],
    },
    {
      title: 'Connect',
      links: [
        { text: 'Discord', href: getDiscordPermalink() },
        { text: 'Donate', href: '/donate' },
        { text: 'Supporters', href: '/supporters' },
        { text: 'Store', href: getStorePermalink() },
      ],
    },
    {
      title: 'Resources',
      links: [
        { text: 'LNBits Testnet', href: 'https://testnet.plebnet.dev' },
        {
          text: 'CLN Testnet Node',
          href: 'https://mempool.space/testnet/lightning/node/03ba00a57cec1cef4873065ad54d0912696274cc53155b29a3b1256720e33a0943',
        },
        { text: 'Nostr Relay', href: 'https://testnet.plebnet.dev/nostrrelay/1' },
        { text: 'Nostr Metadata', href: 'https://metadata.plebnet.dev/' },
        { text: 'Nostrogen', href: 'https://nostrogen.plebnet.dev/' },
      ],
    },
    {
      title: 'About',
      links: [
        { text: 'Our Story', href: '/about' },
        { text: 'Press Kit', href: 'https://github.com/plebnet-dev/presskit' },
        { text: 'Terms of Service', href: '/terms' },
        { text: 'Privacy', href: '/privacy' },
      ],
    },
  ],
  // secondaryLinks: [
  //   { text: 'Terms', href: getPermalink('/terms') },
  //   { text: 'Privacy Policy', href: getPermalink('/privacy') },
  // ],
  socialLinks: [
    // { text: 'Nostr', href: '#'},
    // { ariaLabel: 'Twitter', icon: 'tabler:brand-twitter', href: '#' },
    { ariaLabel: 'Discord', icon: 'tabler:brand-discord', href: getDiscordPermalink() },
    { ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com/plebnet-dev/' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
  ],
  footNote: `
    <span class=" float-left rounded-sm"></span>
    Copyright © 2024 - Plebnet.dev · All rights reserved.
  `,
};
