import {defineConfig} from 'astro/config'
import sitemap from '@astrojs/sitemap'

// SITE_URL is set in Cloudflare (e.g. https://ramygeorge.com). Without it, canonical URLs and the sitemap are skipped.
const site = process.env.SITE_URL || undefined

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'ignore',
  build: {format: 'directory', inlineStylesheets: 'never'},
  integrations: site ? [sitemap()] : [],
  // Keep every script as an external file so the Content-Security-Policy can forbid inline scripts.
  vite: {build: {assetsInlineLimit: 0}},
})
