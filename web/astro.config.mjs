import {defineConfig} from 'astro/config'
import cloudflare from '@astrojs/cloudflare'
import sitemap from '@astrojs/sitemap'

// SITE_URL is set once a custom domain is connected. Until then the workers.dev URL is used directly.
const site = process.env.SITE_URL || undefined

export default defineConfig({
  site,
  output: 'server',
  session: false,
  adapter: cloudflare({imageService: 'passthrough'}),
  trailingSlash: 'ignore',
  build: {format: 'directory', inlineStylesheets: 'never'},
  integrations: site ? [sitemap()] : [],
  // Keep every script as an external file so the Content-Security-Policy can forbid inline scripts.
  vite: {build: {assetsInlineLimit: 0}},
})
