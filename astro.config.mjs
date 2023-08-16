import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import image from '@astrojs/image';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import compress from 'astro-compress';
import { readingTimeRemarkPlugin } from './src/utils/frontmatter.mjs';
import { SITE } from './src/config.mjs';
import svelte from "@astrojs/svelte";
// import node from '@astrojs/node';
// import vercelEdge from '@astrojs/vercel/edge';
import vercel from "@astrojs/vercel/serverless";
import 'dotenv/config';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const whenExternalScripts = (items = []) => SITE.googleAnalyticsId ? Array.isArray(items) ? items.map(item => item()) : [items()] : [];


// https://astro.build/config
export default defineConfig({
  site: SITE.origin,
  base: SITE.basePathname,
  trailingSlash: SITE.trailingSlash ? 'always' : 'never',
  output: 'hybrid',
  adapter: vercel(),
  publicRuntimeConfig: {
    PUBLIC_SUPABASE_URL: process.env.PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_KEY: process.env.PUBLIC_SUPABASE_KEY,
    PUBLIC_SENDGRID_TEMPLATE_ID_INDIV: process.env.PUBLIC_SENDGRID_TEMPLATE_ID_INDIV,
    PUBLIC_SENDGRID_TEMPLATE_ID_CORP: process.env.PUBLIC_SENDGRID_TEMPLATE_ID_CORP,
    PUBLIC_SENDGRID_API_KEY: process.env.PUBLIC_SENDGRID_API_KEY
  },
  markdown: {
    remarkPlugins: [readingTimeRemarkPlugin]
  },
  integrations: [tailwind({
    config: {
      applyBaseStyles: false
    }
  }), sitemap(), image({
    serviceEntryPoint: '@astrojs/image/sharp'
  }), mdx(), ...whenExternalScripts(() => partytown({
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
