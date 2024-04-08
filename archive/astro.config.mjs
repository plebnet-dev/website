import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import compress from 'astro-compress';
import { readingTimeRemarkPlugin } from './src/utils/frontmatter.mjs';
import { SITE, DISCORD_LINK } from './src/config.mjs';
import svelte from "@astrojs/svelte";
import vercel from "@astrojs/vercel/serverless";
import 'dotenv/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const whenExternalScripts = (items = []) => SITE.googleAnalyticsId ? Array.isArray(items) ? items.map(item => item()) : [items()] : [];


// https://astro.build/config
export default defineConfig({
  redirects: {
    '/join': {
      status: 302,
      destination: '/join-us'
    },
    '/discord': {
      status: 302,
      destination: DISCORD_LINK
    }
  },
  site: SITE.origin,
  base: SITE.basePathname,
  trailingSlash: SITE.trailingSlash ? 'always' : 'never',
  output: 'hybrid',
  adapter: vercel(),
  publicRuntimeConfig: {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_KEY: process.env.SUPABASE_KEY,
    SENDGRID_TEMPLATE_ID_INDIV: process.env.SENDGRID_TEMPLATE_ID_INDIV,
    SENDGRID_TEMPLATE_ID_CORP: process.env.SENDGRID_TEMPLATE_ID_CORP,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY
  },
  markdown: {
    remarkPlugins: [readingTimeRemarkPlugin]
  },
  integrations: [tailwind({
      config: {
        applyBaseStyles: false
    }
  }), sitemap(), mdx(), ...whenExternalScripts(() => partytown({
        config: {
          forward: ['dataLayer.push']
    }
      })), compress({
      CSS: true,
      HTML: {
        removeAttributeQuotes: false
      },
      Image: false,
      JavaScript: true,
      SVG: false,
      Logger: 1
    }), svelte()],
  vite: {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src')
      }
    }
  }
});
