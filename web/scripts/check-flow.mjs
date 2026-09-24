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
  ['hero section CTA can target #work', hero.includes("hero.ctaTarget === 'work' || !hasWorkAnchor ? '/work/' : '#work'")],
  ['#work resolves to an actual work section after CMS reorder', home.includes("const workKeys = new Set(['video', 'motion', 'posts'])") && home.includes("const workAnchorAt = firstWork") && home.includes("hasWorkAnchor={workAnchorAt >= 0}")],
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
  ['dashboard hero override is opt-in with approved fallback', hero.includes("hero.useDashboardImage && hero.image?.src") && content.includes("useDashboardImage?: boolean")],
  ['hidden Work projects cannot leak into previous/next or related', project.includes("x.showOnWork && x.kind === p.kind")],
  ['Work overview uses consistent editorial thumbnail crops', work.includes('class="cover"') && work.includes('object-fit: cover')],
  ['mobile hero type has a narrow-screen clamp', hero.includes('@media (max-width: 380px)') && hero.includes('17vw')],
  ['empty Motion and Posts states stay compact', motion.includes('min-height: clamp(176px, 18vw, 240px)') && posts.includes('min-height: clamp(176px, 18vw, 230px)')],
  ['dashboard favicon is used with a static fallback', base.includes("site.settings.favicon || '/favicon.svg?v=10'")],
  ['nav active state is trailing-slash safe', base.includes("Astro.url.pathname.replace(/\\/+$/, '') || '/'") && base.includes("path === hrefPath || path.startsWith(hrefPath + '/')")],
  ['contact CTA always has a valid destination', base.includes("homeHasContact") && base.includes("'/info/#contact'")],
  ['canonical URLs normalize directory slashes', base.includes("canonicalPath") && base.includes("replace(/\\/+$/, '') + '/'")],
  ['all hero CMS modes keep a visual fallback', hero.includes("showReel") && hero.includes("showFrames") && hero.includes("hero.showreelPoster?.src || fallbackHero")],
  ['hero CTA falls back to Work when homepage work is hidden', hero.includes("!hasWorkAnchor ? '/work/' : '#work'") || hero.includes("hero.ctaTarget === 'work' || !hasWorkAnchor")],
  ['Motion initial filter matches its pressed state', motion.includes("const initialFilter") && motion.includes("f.key === initialFilter") && motion.includes("hidden={initialFilter !== 'all'")],
  ['stale curated Posts refs fall back to published posts', posts.includes("const curated") && posts.includes("const chosen = curated.length ? curated : all")],
  ['hidden two-screen previews do not play background loops', editing.includes("d.loop && !d.two && !reduce")],
  ['missing projects use the real 404 route', project.includes("Astro.rewrite('/404')")],
  ['hero image has a runtime photo fallback', hero.includes('data-fallback={fallbackHero}') && hero.includes("heroImg.addEventListener('error'")],
  ['hero includes a concise storytelling line', hero.includes('const storyLine') && hero.includes('class="story muted"')],
  ['hero blend includes warm atmospheric depth', hero.includes('hero-float') && hero.includes('sepia(.035)') && hero.includes('rgba(255,169,78,.105)')],
]

const failed = checks.filter(([, ok]) => !ok)
for (const [name, ok] of checks) console.log(`${ok ? '✓' : '✗'} ${name}`)
if (failed.length) {
  console.error(`\nFlow audit failed: ${failed.length} contract(s).`)
  process.exit(1)
}
console.log(`\nFlow audit passed: ${checks.length} contracts.`)
