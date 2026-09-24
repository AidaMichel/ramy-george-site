import {readFileSync} from 'node:fs'

const read = (p) => readFileSync(new URL('../' + p, import.meta.url), 'utf8')

const globalCss = read('src/styles/global.css')
const base = read('src/layouts/Base.astro')
const hero = read('src/components/Hero.astro')
const editing = read('src/components/VideoSection.astro')
const motion = read('src/components/MotionSection.astro')
const posts = read('src/components/PostsSection.astro')
const work = read('src/pages/work/index.astro')
const project = read('src/pages/work/[slug].astro')
const info = read('src/pages/info.astro')
const contact = read('src/components/ContactSection.astro')
const content = read('src/lib/content.ts')

const requiredTokens = [
  '--surface-1:', '--surface-2:', '--border:', '--border-strong:',
  '--measure-copy:', '--section-y:', '--control-sm:', '--control-md:', '--control-lg:',
  '--radius-pill:', '--dur-fast:', '--dur-med:', '--shadow-float:'
]

const checks = [
  ['core design tokens exist', requiredTokens.every((t) => globalCss.includes(t))],
  ['focus visibility is preserved', globalCss.includes(':focus-visible') && globalCss.includes('outline: 2px solid var(--acc)')],
  ['reduced motion is respected', globalCss.includes('@media (prefers-reduced-motion: reduce)')],
  ['touch highlight is intentionally controlled', globalCss.includes('-webkit-tap-highlight-color: transparent')],
  ['section rhythm uses the shared token', globalCss.includes('.sec { padding-top: var(--section-y)')],
  ['utility controls use shared sizing', globalCss.includes('height: var(--control-sm)') && globalCss.includes('width: var(--control-lg)')],
  ['desktop navigation uses design-system motion', base.includes('var(--dur-fast) var(--ease)')],
  ['navigation CTA uses the shared pill radius', base.includes('border-radius: var(--radius-pill)')],
  ['hero CTA uses shared control sizing', hero.includes('min-height: var(--control-lg)')],
  ['hero copy uses the shared reading measure', hero.includes('max-width: var(--measure-copy)')],
  ['Editing tabs use shared control sizing', editing.includes('min-height: var(--control-md)')],
  ['Motion hides irrelevant controls when empty', motion.includes('{items.length > 0 && (') && motion.includes('class="side"')],
  ['Posts transitions use shared timing', posts.includes('var(--dur-med) var(--ease)')],
  ['Work thumbnail motion uses shared timing', work.includes('var(--dur-med) var(--ease)')],
  ['project chrome uses shared pill and border tokens', project.includes('var(--radius-pill)') && project.includes('var(--border-strong)')],
  ['related work uses the same editorial cover crop', project.includes('class="cover" sizes="33vw"')],
  ['Info keeps copy before portrait on smaller screens', info.includes('.lead { grid-row: 1; }') && info.includes('.portrait { grid-row: 2;')],
  ['Contact CTA uses shared interaction timing', contact.includes('var(--dur-fast) var(--ease)')],
  ['hero positioning copy stays CMS-driven', hero.includes('hero.positioningLine ||') && content.includes('positioningLine?: string')],
  ['project storytelling stays CMS-driven', content.includes('storyBlocks?: {label: string; text: string}[]') && project.includes('p.storyBlocks.map')],
  ['related work stays CMS-curatable', content.includes('relatedProjects?: string[]') && project.includes('curatedRelated')],
]

const failed = checks.filter(([, ok]) => !ok)
for (const [name, ok] of checks) console.log(`${ok ? '✓' : '✗'} ${name}`)
if (failed.length) {
  console.error(`\nDesign-system audit failed: ${failed.length} contract(s).`)
  process.exit(1)
}
console.log(`\nDesign-system audit passed: ${checks.length} contracts.`)
