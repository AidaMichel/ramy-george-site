// Post-build link audit: "if it looks clickable, it must work".
// Fails the build on: dead internal links, empty/# / javascript: hrefs, external links without
// target=_blank + rel=noopener noreferrer, internal links opened in a new tab, missing images.
import {readFileSync, readdirSync, statSync, existsSync} from 'node:fs'
import {join, relative} from 'node:path'
const DIST = new URL('../dist/', import.meta.url).pathname
const files = []
const walk = (d) => readdirSync(d).forEach((f) => { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') && files.push(p) })
walk(DIST)
const problems = [], external = new Map()
const exists = (path) => {
  const clean = decodeURIComponent(path.split('#')[0].split('?')[0])
  if (clean === '' ) return true
  const p = join(DIST, clean)
  return existsSync(p) && statSync(p).isFile() || existsSync(join(p, 'index.html'))
}
const redirects = existsSync(join(DIST, '_redirects')) ? readFileSync(join(DIST, '_redirects'), 'utf8').split('\n').map((l) => l.split(/\s+/)[0]).filter(Boolean) : []
for (const f of files) {
  const html = readFileSync(f, 'utf8'), page = '/' + relative(DIST, f).replace(/index\.html$/, '')
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]))
  for (const m of html.matchAll(/<a\b([^>]*)>/g)) {
    const a = m[1], href = (a.match(/\shref="([^"]*)"/) || [])[1]
    const hidden = /\shidden(\s|=|$)/.test(a)
    if (href === undefined) { if (!hidden) problems.push(`${page}: <a> without href (looks clickable, goes nowhere)`); continue }
    if (href === '' || href === '#' || /^javascript:/i.test(href)) { problems.push(`${page}: dead href "${href}"`); continue }
    const blank = /target="_blank"/.test(a), rel = (a.match(/\srel="([^"]*)"/) || [])[1] || ''
    if (/^https?:/.test(href)) {
      if (!blank || !rel.includes('noopener') || !rel.includes('noreferrer')) problems.push(`${page}: external link missing target/rel: ${href}`)
      external.set(href, (external.get(href) || 0) + 1)
    } else if (href.startsWith('mailto:')) {
      if (!/^mailto:[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(href)) problems.push(`${page}: malformed mailto ${href}`)
    } else if (href.startsWith('#')) {
      if (!ids.has(href.slice(1))) problems.push(`${page}: anchor ${href} has no target`)
    } else if (href.startsWith('/')) {
      if (blank && !href.endsWith('.pdf')) problems.push(`${page}: internal link opens a new tab: ${href}`)
      if (!exists(href) && !redirects.includes(href.split('#')[0])) problems.push(`${page}: broken internal link ${href}`)
      const hash = href.split('#')[1]
      if (hash && exists(href)) {
        const target = readFileSync(existsSync(join(DIST, href.split('#')[0], 'index.html')) ? join(DIST, href.split('#')[0], 'index.html') : join(DIST, href.split('#')[0]), 'utf8')
        if (!target.includes(`id="${hash}"`)) problems.push(`${page}: ${href} — anchor not found on target page`)
      }
    }
  }
  for (const m of html.matchAll(/<img\b[^>]*\ssrc="([^"]+)"/g)) if (m[1].startsWith('/') && !exists(m[1])) problems.push(`${page}: missing image ${m[1]}`)
}
console.log(`Checked ${files.length} pages, ${external.size} unique external destinations.`)
if (problems.length) { console.error(problems.join('\n')); process.exit(1) }
console.log('All links OK.')
