import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Projects',
      href: '/projects',
    },
    {
      text: 'Resources',
      href: '/resources',
    },
    {
      text: 'Blog',
      href:  getBlogPermalink(),
    },
    {
      text: 'Store',
      href: 'https://plebnet-dev.printify.me/',
    },
    
      {
      text: 'About',
      href: '/about',
    },
    
  ],
  actions: [
    // adds a download button to the upper right nav on blog page
    // { type: 'button', text: 'Download', href: 'https://github.com/onwidget/astrowind' }
  ],
};
  
export const footerData = {
  links: [
    {
      title: 'Members',
      links: [
        { text: 'Join Us', href: '/join' },
        { text: 'FAQ', href: '/faq' },
        { text: 'Projects', href: '/projects' },
      ],        
    },
    {
      title: 'Connect',
      links: [
        { text: 'Sponsors', href: '/sponsors' },
        { text: 'FAQ Discord', href: 'https://discord.gg/PdBcqnAyCD'},
        { text: 'Store', href: 'https://plebnet-dev.printify.me/'},
      ],
    },
    {
      title: 'Resources',
      links: [
        { text: 'LNBits Testnet', href: 'https://testnet.plebnet.dev'},
        { text: 'CLN Testnet Node', href: 'https://mempool.space/testnet/lightning/node/03ba00a57cec1cef4873065ad54d0912696274cc53155b29a3b1256720e33a0943'},
        { text: 'Nostr Relay', href: 'https://testnet.plebnet.dev/nostrrelay/1'},
        { text: 'Nostrogen', href: 'https://nostrogen.plebnet.dev/'},
      ],
    },
    {
      title: 'About',
      links: [
        { text: 'Blog', href: '/blog' },
        { text: 'Press Kit', href: 'https://github.com/plebnet-dev/presskit' },
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
  { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
  { ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com/plebnet-dev/' },
  ],
  footNote: `
    <span class=" float-left rounded-sm"></span>
    Copyright © 2023 - Plebnet.dev · All rights reserved.
  `,
};
