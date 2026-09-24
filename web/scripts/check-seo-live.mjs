const rawBase = process.env.SITE_URL || 'https://ramygeorge.com'
const base = rawBase.replace(/\/+$/, '')
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function get(path, userAgent = 'ramy-seo-audit/1.0') {
  const url = /^https?:\/\//.test(path) ? path : base + path
  let last
  for (let i = 0; i < 6; i++) {
    try {
      const res = await fetch(url, {redirect: 'follow', headers: {'user-agent': userAgent}})
      if (res.status < 500) return res
      last = new Error(`${url} returned ${res.status}`)
    } catch (e) { last = e }
    await sleep(1800)
  }
  throw last || new Error(`Failed to fetch ${url}`)
}
const assert = (ok, msg) => {
  if (!ok) throw new Error(msg)
  console.log('✓', msg)
}
const attrs = (tag) => Object.fromEntries(
  [...tag.matchAll(/([:\w.-]+)=["']([^"']*)["']/g)].map((m) => [m[1].toLowerCase(), m[2]])
)
const meta = (html, name, property = false) => {
  const key = property ? 'property' : 'name'
  for (const m of html.matchAll(/<meta\b[^>]*>/gi)) {
    const a = attrs(m[0])
    if ((a[key] || '').toLowerCase() === name.toLowerCase()) return a.content || ''
  }
  return ''
}
const link = (html, rel) => {
  for (const m of html.matchAll(/<link\b[^>]*>/gi)) {
    const a = attrs(m[0])
    if ((a.rel || '').toLowerCase() === rel.toLowerCase()) return a.href || ''
  }
  return ''
}
const titleOf = (html) => (/<title>([^<]+)<\/title>/i.exec(html)?.[1] || '').trim()
const jsonLd = (html) => [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)]
  .map((m) => JSON.parse(m[1]))

async function auditPage(path, label) {
  const res = await get(path)
  assert(res.status === 200, `${label} returns 200`)
  const html = await res.text()
  const title = titleOf(html)
  const desc = meta(html, 'description')
  const robots = meta(html, 'robots')
  assert(title.length >= 15 && title.length <= 70, `${label} has a useful title`)
  assert(desc.length >= 50 && desc.length <= 180, `${label} has a useful meta description`)
  assert(link(html, 'canonical').startsWith(base), `${label} has a canonical URL`)
  assert(!/noindex/i.test(robots), `${label} is indexable`)
  assert(/max-image-preview:large/i.test(robots), `${label} enables large image previews`)
  assert(Boolean(meta(html, 'og:title', true)) && Boolean(meta(html, 'og:description', true)), `${label} has Open Graph metadata`)
  assert(Boolean(meta(html, 'twitter:title')) && Boolean(meta(html, 'twitter:description')), `${label} has Twitter/X metadata`)
  const schemas = jsonLd(html)
  assert(schemas.length > 0, `${label} has JSON-LD structured data`)
  const graph = schemas.flatMap((x) => x['@graph'] || [x])
  assert(graph.some((x) => x['@type'] === 'WebSite'), `${label} identifies the WebSite entity`)
  assert(graph.some((x) => x['@type'] === 'Person'), `${label} identifies Ramy George as a Person entity`)
  return {html, graph}
}

const home = await auditPage('/', 'Home')
const work = await auditPage('/work/', 'Work')
const info = await auditPage('/info/', 'Info')
assert(info.graph.some((x) => x['@type'] === 'ProfilePage'), 'Info uses ProfilePage structured data')
assert(work.graph.some((x) => x['@type'] === 'CollectionPage'), 'Work uses CollectionPage structured data')

const projectMatch = work.html.match(/href=["'](\/work\/[^"'#?]+\/)["']/)
if (projectMatch) {
  const project = await auditPage(projectMatch[1], 'Project')
  assert(project.graph.some((x) => x['@type'] === 'CreativeWork'), 'Project identifies the work as CreativeWork')
  assert(project.graph.some((x) => x['@type'] === 'BreadcrumbList'), 'Project includes breadcrumb structured data')
}

const robotsRes = await get('/robots.txt')
assert(robotsRes.status === 200, 'robots.txt returns 200')
const robotsTxt = await robotsRes.text()
assert(/User-agent:\s*OAI-SearchBot/i.test(robotsTxt) && /Allow:\s*\//i.test(robotsTxt), 'robots.txt explicitly allows OAI-SearchBot')
assert(/Sitemap:\s*https:\/\/ramygeorge\.com\/sitemap\.xml/i.test(robotsTxt), 'robots.txt advertises the canonical sitemap')

const sitemapRes = await get('/sitemap.xml')
assert(sitemapRes.status === 200, 'Dynamic sitemap returns 200')
assert((sitemapRes.headers.get('content-type') || '').includes('xml'), 'Dynamic sitemap has XML content type')
const sitemap = await sitemapRes.text()
assert(sitemap.includes('<loc>https://ramygeorge.com/</loc>'), 'Sitemap contains Home')
assert(sitemap.includes('<loc>https://ramygeorge.com/work/</loc>'), 'Sitemap contains Work')
assert(sitemap.includes('<loc>https://ramygeorge.com/info/</loc>'), 'Sitemap contains Info')
if (projectMatch) assert(sitemap.includes(projectMatch[1]), 'Sitemap contains live project URLs')

const llmsRes = await get('/llms.txt')
assert(llmsRes.status === 200, 'llms.txt returns 200')
const llms = await llmsRes.text()
assert(/# Ramy George/i.test(llms) && /## Selected work/i.test(llms), 'llms.txt exposes a concise machine-readable portfolio summary')

const oai = await get('/', 'Mozilla/5.0; compatible; OAI-SearchBot/1.4; +https://openai.com/searchbot')
assert(oai.status === 200, 'OAI-SearchBot can reach the homepage')
const google = await get('/', 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)')
assert(google.status === 200, 'Googlebot can reach the homepage')

console.log('\nLive SEO + AI-search audit passed.')
