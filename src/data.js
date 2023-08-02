import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Projects',
      href: '/projects',
    },
    {
      text: 'Blog',
      href:  getBlogPermalink(),
    },
    {
      text: 'About',
      href: '/about',
    },
    {
      text: 'Store',
      href: 'https://plebnet-dev.printify.me/',
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
        { text: 'Store', href: '/store'},
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
