import type {APIRoute} from 'astro'
import {getSite} from '../lib/content'

const esc = (value: string) =>
  value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;')

export const GET: APIRoute = async ({site, url}) => {
  const data = await getSite()
  const base = site || new URL(data.settings.siteUrl || url.origin)
  const paths = [
    '/',
    '/work/',
    '/info/',
    ...data.projects.filter((p) => p.showOnWork).map((p) => `/work/${p.slug}/`),
  ]
  const urls = [...new Set(paths)].map((path) => new URL(path, base).href)
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((loc) => `  <url><loc>${esc(loc)}</loc></url>`)
    .join('\n')}\n</urlset>\n`

  return new Response(body, {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=300, s-maxage=300',
    },
  })
}
