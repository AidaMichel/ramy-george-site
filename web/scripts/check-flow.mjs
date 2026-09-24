import {readFileSync} from 'node:fs'

const read = (p) => readFileSync(new URL('../' + p, import.meta.url), 'utf8')

const base = read('src/layouts/Base.astro')
const home = read('src/pages/index.astro')
const hero = read('src/components/Hero.astro')
const editing = read('src/components/VideoSection.astro')
const motion = read('src/components/MotionSection.astro')
const posts = read('src/components/PostsSection.astro')
const work = read('src/pages/work/index.astro')
const project = read('src/pages/work/[slug].astro')
const info = read('src/pages/info.astro')
const content = read('src/lib/content.ts')

const checks = [
  ['desktop nav is locked to viewport center', base.includes("left: 50%;") && base.includes("transform: translate(-50%, -50%);")],
  ['desktop nav remains separate from highlighted CTA', base.includes("const primaryNav = navItems.filter((n) => !n.highlight)") && base.includes("const navCta = navItems.find((n) => n.highlight)")],
  ['mobile/desktop breakpoint logic matches', base.includes("matchMedia('(min-width: 900px)')") && base.includes('@media (max-width: 899px)')],
  ['Home/Info Let’s talk stays on the current page', base.includes("n.target === 'contact'") && base.includes("href = n.target === 'contact'") && base.includes("'#contact'")],
  ['other pages route Let’s talk to homepage contact', content.includes("target === 'contact' ? '/#contact'")],
  ['hero section CTA can target #work', hero.includes("const cta = hero.ctaTarget === 'work' ? '/work/' : '#work'")],
  ['#work resolves to an actual work section after CMS reorder', home.includes("const workKeys = new Set(['video', 'motion', 'posts'])") && home.includes("firstWork >= 0 ? firstWork")],
  ['Editing rows open project detail directly', editing.includes("href={\`/work/\${p.slug}/\`}"),],
  ['Editing preview opens the selected project detail', editing.includes("data-stage") && editing.includes("stage.href = row.href")],
  ['Motion tiles open project detail directly', motion.includes("href={\`/work/\${p.slug}/\`}"),],
  ['Posts project title opens project detail directly', posts.includes("href={\`/work/\${p.slug}/\`}"),],
  ['Work cards open project detail directly', work.includes("href={\`/work/\${p.slug}/\`}"),],
  ['project detail has a stable Back to Work path', project.includes("Back to Work") && project.includes("/work/#\${cat.slug}")],
  ['project detail supports previous and next browsing', project.includes("Previous") && project.includes("Next") && project.includes("prev.slug") && project.includes("next.slug")],
  ['project detail exposes related work', project.includes("Related work") && project.includes("related.map")],
  ['project video play is click-to-load', project.includes("data-embed") && project.includes("replaceChildren(f)")],
  ['Info contains an on-page contact destination', info.includes("<ContactSection />")],
  ['project detail uses Editing terminology', project.includes("p.kind === 'video' ? \`Editing")],
]

const failed = checks.filter(([, ok]) => !ok)
for (const [name, ok] of checks) console.log(`${ok ? '✓' : '✗'} ${name}`)
if (failed.length) {
  console.error(`\nFlow audit failed: ${failed.length} contract(s).`)
  process.exit(1)
}
console.log(`\nFlow audit passed: ${checks.length} contracts.`)
