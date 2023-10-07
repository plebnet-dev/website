import {getBlogPermalink, getJoinPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Members',
      links: [
        {
          text: 'Join Us',
          href:  getJoinPermalink(),
        },
        {
          text: 'FAQ',
          href:  getJoinPermalink() + '#faq',
        },
        {
          text: 'Projects',
          href: '/projects',    
        },
        // {
        //   text: 'Services',
        //   href: '/services',
        // },
      ]
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
          text: 'Nostr Relay',
          href: 'https://testnet.plebnet.dev/nostrrelay/1',          
        },
        {
          text: 'Nostrogen',
          href: 'https://nostrogen.plebnet.dev/',          
        },
        {
          text: 'All Resources',
          href: '/resources',
        }
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
          href:  getBlogPermalink(),
        }, 
        { 
          text: 'Donate',
          href: '/donate'
        },
        {
          text: 'Discord',
          href: 'https://discord.gg/ph88YwmcrA'
        }
      ],
    },
    {
      text: 'Store',
      href: 'https://plebnet-dev.printify.me/',
    },
  ],
  actions: [
    {
      type: 'orange',
      text: 'Donate',
      href: '/donate',
    }
    // adds a download button to the upper right nav on blog page
    // { type: 'button', text: 'Download', href: 'https://github.com/onwidget/astrowind' }
  ],
};
  
export const footerData = {
  links: [
    {
      title: 'Members',
      links: [
        { text: 'Join Us', href:  getJoinPermalink() },
        { text: 'FAQ', href:  getJoinPermalink() + '#faq' },
        { text: 'Projects', href: '/projects' },
        { text: 'Blog', href: '/blog' },
        // { text: 'Directory', href: '/directory' },
      ],        
    },
    {
      title: 'Connect',
      links: [
        { text: 'Discord', href: 'https://discord.gg/ph88YwmcrA'},
        { text: 'Donate', href: '/donate'},
        { text: 'Sponsors', href: '/sponsors' },
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
        { text: 'Our Story', href: '/about' },
        // { text: 'Contact Us', href: '/contact' },
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
  { ariaLabel: 'Discord', icon: 'tabler:brand-discord', href: 'https://discord.gg/ph88YwmcrA' },
  { ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com/plebnet-dev/' },
  { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
  ],
  footNote: `
    <span class=" float-left rounded-sm"></span>
    Copyright © 2023 - Plebnet.dev · All rights reserved.
  `,
};
