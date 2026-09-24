/**
 * Content layer. In production it reads published Sanity content while rendering each
 * request on Cloudflare; without SANITY_PROJECT_ID it falls back to the bundled seed.
 * Only a read token (optional, for draft previews/private datasets) is ever used here.
 */
import {createClient} from '@sanity/client'
import seed from '../data/seed.json'

export type Img = {src: string; w?: number; h?: number; alt?: string} | null
export type Project = {
  id: string; slug: string; title: string; kind: 'video' | 'motion' | 'post'; category?: string; motionType?: string
  org: string; role: string; poster: Img; mobilePoster?: Img; homepagePreview?: Img; cover?: Img; previewLoop?: string; hoverPreview?: string
  watchUrl: string; platform: string; watchLabel?: string; aspect: string; featured: boolean; showOnHome: boolean; showOnWork: boolean
  secondScreen?: {label: string; aspect: string; poster: Img; url: string; watchLabel: string} | null
  slides?: Img[]; slideAspect?: string; summary?: string; credits?: string; seo?: Seo
}
export type Seo = {title?: string; description?: string; ogImage?: string; noIndex?: boolean}
export type Logo = {id: string; name: string; group: 'clients' | 'media' | 'events'; logo: Img; size: number}
export type Site = {
  settings: {siteName: string; professionalTitle: string; supportingSkills: string[]; location: string; logo: Img; footerLogo?: Img; showFooterSignature: boolean; cv: string; siteUrl: string; favicon?: string; seo: Seo
    footer: {showEmail: boolean; creditLine: string; locationLine: string; copyrightName: string; backToTopLabel: string}}
  navigation: {label: string; target: string; url?: string; highlight: boolean; visible?: boolean}[]
  contact: {email: string; whatsapp: string; linkedin: string; kicker: string; heading: string; buttonLabel: string; buttonTarget: 'email' | 'whatsapp'; seo?: Seo}
  hero: {mode: 'portrait' | 'still' | 'multiframe' | 'showreel' | 'none'; image?: Img; frames?: {img: Img; projectSlug?: string}[]; showreel?: string; showreelPoster?: Img; stillProjectSlug?: string; shortLine: string; ctaLabel: string; ctaTarget: 'section' | 'work'}
  about: {heading: string; paragraph: string; portrait: Img; links: {label: string; kind: string; url?: string}[]; seo?: Seo}
  info: {heading: string; useAboutParagraph: boolean; intro?: string; showPortrait: boolean; experience: {role: string; organisation: string; location?: string; years?: string}[]; training: {course: string; institution: string; year?: string}[]; showCv: boolean; cvLabel: string; seo?: Seo}
  home: {sections: {key: string; visible: boolean; heading: string; microcopy: string; variant?: string}[]; defaultCategory: string; defaultProject: string; motionFilters: {key: string; label: string}[]; logoGroupHeadings: Record<string, string>; logoGroupVisibility: Record<string, boolean>; posts?: string[]; seo?: Seo}
  categories: {id: string; title: string; slug: string}[]
  projects: Project[]
  logos: Logo[]
}

const env = (k: string) => (import.meta.env[k] ?? process.env[k]) as string | undefined
const API_VERSION = '2025-01-01'

function platformOf(url?: string) {
  if (!url) return ''
  if (/vimeo\.com/.test(url)) return 'Vimeo'
  if (/youtube\.com|youtu\.be/.test(url)) return 'YouTube'
  if (/linkedin\.com/.test(url)) return 'LinkedIn'
  return 'the web'
}

const IMG = `{"src": asset->url, "w": asset->metadata.dimensions.width, "h": asset->metadata.dimensions.height, alt}`
const QUERY = `{
  "settings": *[_id=="siteSettings"][0]{siteName, professionalTitle, supportingSkills, location, "logo": logo${IMG}, "footerLogo": footerLogo${IMG}, showFooterSignature, footer, "cv": cv.asset->url, siteUrl, "favicon": favicon.asset->url, "seo": defaultSeo{title, description, noIndex, "ogImage": ogImage.asset->url}},
  "navigation": *[_id=="navigation"][0].items[]{label, target, url, highlight, visible},
  "contact": *[_id=="contact"][0]{email, whatsapp, linkedin, kicker, heading, buttonLabel, buttonTarget, "seo": seo{title, description, noIndex, "ogImage": ogImage.asset->url}},
  "hero": *[_id=="hero"][0]{mode, shortLine, ctaLabel, ctaTarget,
     "image": select(mode=="portrait" => portrait${IMG}, mode=="still" => still${IMG}),
     "stillProjectSlug": still.project->slug.current,
     "frames": frames[]{"img": @${IMG}, "projectSlug": project->slug.current},
     "showreel": showreel.asset->url, "showreelPoster": showreelPoster${IMG}},
  "about": *[_id=="about"][0]{heading, paragraph, "portrait": portrait${IMG}, "links": links[visible != false]{label, kind, url}, "seo": seo{title, description, noIndex, "ogImage": ogImage.asset->url}},
  "info": *[_id=="info"][0]{heading, useAboutParagraph, intro, showPortrait, experience[]{role, organisation, location, years}, training[]{course, institution, year}, showCv, cvLabel, "seo": seo{title, description, noIndex, "ogImage": ogImage.asset->url}},
  "home": *[_id=="homepage"][0]{"sections": sections[]{key, visible, heading, microcopy, variant}, "defaultCategory": defaultCategory->slug.current, "defaultProject": defaultProject->slug.current,
     "motionFilters": motionFilters[visible != false]{key, label}, logoGroupHeadings, logoGroupVisibility, "posts": posts[]->slug.current, "seo": seo{title, description, noIndex, "ogImage": ogImage.asset->url}},
  "categories": *[_type=="videoCategory" && visible != false]|order(orderRank){"id": _id, title, "slug": slug.current},
  "projects": *[_type=="project" && visible != false && status != "archived" && defined(slug.current)]|order(orderRank){
     "id": _id, "slug": slug.current, title, kind, "category": category->slug.current, "categoryVisible": category->visible, motionType,
     "org": coalesce(organisation->name, ""), "role": coalesce(role, ""), "poster": poster${IMG}, "mobilePoster": mobilePoster${IMG}, "homepagePreview": homepagePreview${IMG}, "cover": cover${IMG},
     "previewLoop": previewLoop.asset->url, "hoverPreview": hoverPreview.asset->url, "watchUrl": coalesce(watchUrl, ""), watchLabel, "aspect": coalesce(aspect, "16:9"),
     "featured": coalesce(featured, false), "showOnHome": coalesce(showOnHome, true), "showOnWork": coalesce(showOnWork, true),
     "secondScreen": select(secondScreen.enabled == true => secondScreen{label, aspect, "poster": poster${IMG}, url, watchLabel}, null),
     "slides": slides[]${IMG}, slideAspect, summary, credits, "seo": seo{title, description, noIndex, "ogImage": ogImage.asset->url}},
  "logos": *[_type=="credibilityLogo" && visible != false]|order(orderRank){"id": _id, name, group, "logo": select(displayVersion=="official" && defined(officialLogo) => officialLogo${IMG}, displayVersion=="dark" && defined(darkLogo) => darkLogo${IMG}, logo${IMG}), "size": coalesce(size, 48)}
}`

let cached: {value: Promise<Site>; at: number} | null = null
const LIVE_CACHE_MS = 2000

export function getSite(): Promise<Site> {
  const now = Date.now()
  // Coalesce the many getSite() calls made while rendering a page, but keep the
  // cache intentionally tiny so a Sanity Publish appears on the live site almost immediately.
  if (!cached || now - cached.at > LIVE_CACHE_MS) cached = {value: load(), at: now}
  return cached.value
}

async function load(): Promise<Site> {
  const projectId = env('SANITY_PROJECT_ID')
  const fixture = env('CONTENT_FIXTURE')
  let raw: any
  if (projectId) {
    const preview = env('SANITY_PREVIEW') === '1'
    const client = createClient({
      projectId, dataset: env('SANITY_DATASET') || 'production', apiVersion: API_VERSION, useCdn: false,
      perspective: preview ? 'drafts' : 'published', token: env('SANITY_READ_TOKEN') || undefined, // read-only; needed for drafts or a private dataset
    })
    raw = await client.fetch(QUERY)
  } else if (fixture) {
    raw = JSON.parse((await import('node:fs')).readFileSync(fixture, 'utf8'))
  } else {
    raw = structuredClone(seed)
  }
  return normalise(raw)
}

// Sanity returns null for empty fields; drop them so seed defaults apply instead of breaking a page.
function clean(v: any): any {
  if (Array.isArray(v)) return v.filter((x) => x != null).map(clean)
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).filter(([, x]) => x != null).map(([k, x]) => [k, clean(x)]))
  return v
}

function normalise(input: any): Site {
  const r = clean(input)
  const s = seed as any
  const projects: Project[] = (r.projects || [])
    .filter((p: any) => p.categoryVisible !== false && p.visible !== false)
    .map((p: any) => ({...p, platform: p.platform || platformOf(p.watchUrl), watchUrl: p.watchUrl || '', slides: (p.slides || []).filter((x: any) => x?.src)}))
  // Contact & settings: fall back to seed defaults field-by-field so a half-filled CMS never breaks a page
  return {
    settings: {...s.settings, ...(r.settings || {}), seo: {...s.settings.seo, ...(r.settings?.seo || {})}, footer: {...s.settings.footer, ...(r.settings?.footer || {})}},
    navigation: (() => {
      const nav = r.navigation?.length ? r.navigation : s.navigation
      return nav.some((n: any) => n.target === 'home')
        ? nav
        : [{label: 'Home', target: 'home', highlight: false, visible: true}, ...nav]
    })(),
    contact: {...s.contact, ...(r.contact || {})},
    hero: {...s.hero, ...(r.hero || {})},
    about: {...s.about, ...(r.about || {}), links: r.about?.links ?? s.about.links},
    info: {...s.info, ...(r.info || {}), experience: r.info?.experience ?? s.info.experience, training: r.info?.training ?? s.info.training},
    home: {...s.home, ...(r.home || {}), sections: r.home?.sections?.length ? r.home.sections : s.home.sections,
           motionFilters: r.home?.motionFilters?.length ? r.home.motionFilters : s.home.motionFilters,
           logoGroupHeadings: {...s.home.logoGroupHeadings, ...(r.home?.logoGroupHeadings || {})},
           logoGroupVisibility: {...s.home.logoGroupVisibility, ...(r.home?.logoGroupVisibility || {})}},
    categories: r.categories || [],
    projects,
    logos: (r.logos || []).filter((l: any) => l.logo?.src),
  }
}

// ---------- helpers ----------
export const isExternal = (href: string) => /^https?:\/\//.test(href)
export function watchLabel(p: Pick<Project, 'watchLabel' | 'platform'>) {
  return p.watchLabel || (p.platform ? `Watch on ${p.platform} ↗` : 'Watch ↗')
}
export function navHref(target: string, url?: string) {
  return target === 'home' ? '/' : target === 'work' ? '/work/' : target === 'about' || target === 'info' ? '/info/' : target === 'contact' ? '/contact/' : url || '/'
}
export function linkHref(site: Site, kind: string, url?: string): string {
  switch (kind) {
    case 'linkedin': return site.contact.linkedin
    case 'email': return site.contact.email ? `mailto:${site.contact.email}` : ''
    case 'whatsapp': return site.contact.whatsapp
    case 'cv': return site.settings.cv
    case 'work': return '/work/'
    case 'info': return '/info/'
    default: return url || ''
  }
}
export function section(site: Site, key: string) {
  return site.home.sections.find((x) => x.key === key)
}
export function embedUrl(url: string): string {
  const v = url.match(/vimeo\.com\/(\d+)(?:$|[/?#])/)
  if (v) return `https://player.vimeo.com/video/${v[1]}?autoplay=1&dnt=1`
  const y = url.match(/[?&]v=([\w-]{11})/) || url.match(/youtu\.be\/([\w-]{11})/)
  if (y) return `https://www.youtube-nocookie.com/embed/${y[1]}?autoplay=1&rel=0`
  return ''
}
export function ratio(a?: string) {
  const [w, h] = (a || '16:9').split(':').map(Number)
  return `${w} / ${h}`
}
