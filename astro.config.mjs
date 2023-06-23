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
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const whenExternalScripts = (items = []) => SITE.googleAnalyticsId ? Array.isArray(items) ? items.map(item => item()) : [items()] : [];


// https://astro.build/config
export default defineConfig({
  site: SITE.origin,
  base: SITE.basePathname,
  trailingSlash: SITE.trailingSlash ? 'always' : 'never',
  output: 'server',
  adapter: vercel(),
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
    css: true,
    html: {
      removeAttributeQuotes: false
    },
    img: false,
    js: true,
    svg: false,
    logger: 1
  }), svelte()],
  vite: {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
        'svelte-icons/lib/MdPerson.svelte': require.resolve('svelte-icons/lib/MdPerson.svelte'),
        'svelte-icons/lib/MdBusiness.svelte': require.resolve('svelte-icons/lib/MdBusiness.svelte'),
      },
    },
    optimizeDeps: {
      include: ['svelte-icons/lib/MdPerson.svelte', 'svelte-icons/lib/MdBusiness.svelte'],
    },
    build: {
      rollupOptions: {
        external: ['svelte-icons/Md'],
      },
    },
  },
});