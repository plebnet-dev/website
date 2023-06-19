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
      ],        
    },
    {
      title: 'Connect',
      links: [
        { text: 'Projects', href: '/projects' },
        { text: 'Sponsors', href: '/sponsors' },
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
    <span class="w-5 h-5 md:w-6 md:h-6 md:-mt-0.5 bg-cover mr-1.5 float-left rounded-sm bg-[url(https://onwidget.com/favicon/favicon-32x32.png)]"></span>
    Template by <a class="text-blue-600 hover:underline dark:text-gray-200" href="https://onwidget.com/"> onWidget</a> · All rights reserved.
  `,
};
