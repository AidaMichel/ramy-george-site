const rawBase = process.env.SITE_URL || 'https://ramygeorge.com'
const base = rawBase.replace(/\/+$/, '')
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function request(path, opts = {}) {
  const url = /^https?:\/\//.test(path) ? path : base + path
  let last
  for (let i = 0; i < 6; i++) {
    try {
      const res = await fetch(url, {redirect: opts.redirect || 'follow', headers: {'user-agent': 'ramy-site-smoke/1.0'}})
      if (res.status < 500) return res
      last = new Error(`${url} returned ${res.status}`)
    } catch (e) {
      last = e
    }
    await sleep(2000)
  }
  throw last || new Error(`Failed to fetch ${url}`)
}

function assert(ok, msg) {
  if (!ok) throw new Error(msg)
  console.log('✓', msg)
}

const home = await request('/')
assert(home.status === 200, 'Home returns 200')
const homeHtml = await home.text()
assert(/RAMY/i.test(homeHtml) && /GEORGE/i.test(homeHtml), 'Home renders the hero name')
assert(/Home/.test(homeHtml) && /Work/.test(homeHtml) && /Info/.test(homeHtml), 'Desktop/mobile navigation labels render')
assert(/id="main"/.test(homeHtml), 'Main landmark renders')
assert(/href="\/work\//.test(homeHtml) || /id="work"/.test(homeHtml), 'Home exposes a valid work path or work anchor')
assert(!/Ramy George editing at his workstation/.test(homeHtml), 'Broken hero alt-text fallback is not visible in HTML')
assert(/hero-rg-master\.webp/.test(homeHtml), 'Homepage renders the current high-resolution hero master')

const work = await request('/work/')
assert(work.status === 200, 'Work returns 200')
const workHtml = await work.text()
assert(/Selected Work/i.test(workHtml) || />Work</.test(workHtml), 'Work page content renders')

const projectMatch = workHtml.match(/href="(\/work\/[^"#?]+\/)"/)
if (projectMatch) {
  const project = await request(projectMatch[1])
  assert(project.status === 200, 'A live project detail returns 200')
  const projectHtml = await project.text()
  assert(/Back to Work/.test(projectHtml), 'Project detail renders Back to Work')
  assert(/Previous|Next|Related work/.test(projectHtml), 'Project browsing controls render')
} else {
  console.log('• No project detail link currently published on Work; skipped detail smoke check')
}

const info = await request('/info/')
assert(info.status === 200, 'Info returns 200')
const infoHtml = await info.text()
assert(/id="contact"/.test(infoHtml), 'Info contains the contact destination')

const contact = await request('/contact/', {redirect: 'manual'})
assert([301,302,307,308].includes(contact.status), 'Legacy Contact route redirects')
const loc = contact.headers.get('location') || ''
assert(loc.includes('#contact') || loc.endsWith('/'), 'Contact redirect has a usable destination')

const missing = await request('/__ramy_smoke_missing__')
assert(missing.status === 404, 'Unknown route returns a real 404')

const heroAsset = await request('/hero-rg-approved.webp?v=6')
assert(heroAsset.status === 200, 'Approved hero asset returns 200')
assert((heroAsset.headers.get('content-type') || '').includes('image'), 'Approved hero asset has an image content type')

const cssMatch = homeHtml.match(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/) || homeHtml.match(/<link[^>]+href="([^"]+)"[^>]+rel="stylesheet"/)
if (cssMatch) {
  const css = await request(cssMatch[1])
  assert(css.status === 200, 'Homepage stylesheet returns 200')
} else {
  console.log('• No linked stylesheet found in HTML; skipped stylesheet smoke check')
}

console.log('\nLive smoke audit passed.')
