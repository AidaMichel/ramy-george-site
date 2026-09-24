import type {APIRoute} from 'astro'
import {getSite} from '../lib/content'

export const GET: APIRoute = async ({site, url}) => {
  const data = await getSite()
  const base = site || new URL(data.settings.siteUrl || url.origin)
  const home = new URL('/', base).href
  const work = new URL('/work/', base).href
  const info = new URL('/info/', base).href
  const featured = data.projects
    .filter((p) => p.showOnWork)
    .slice(0, 16)
    .map((p) => `- [${p.title}](${new URL(`/work/${p.slug}/`, base).href})${p.org ? ` — ${p.org}` : ''}`)

  const body = [
    `# ${data.settings.siteName}`,
    '',
    `> ${data.settings.professionalTitle} based in Dubai, focused on ${data.settings.supportingSkills.join(', ')}.`,
    '',
    '## Canonical pages',
    `- [Home](${home}) — Portfolio overview and selected work.`,
    `- [Work](${work}) — Video editing, motion design, sound design, visual storytelling and selected projects.`,
    `- [Info](${info}) — Biography, experience, education and contact information.`,
    '',
    '## Expertise',
    ...data.settings.supportingSkills.map((skill) => `- ${skill}`),
    '',
    '## Selected work',
    ...(featured.length ? featured : ['- Selected work is being updated.']),
    '',
    '## Identity',
    `- Name: ${data.settings.siteName}`,
    `- Professional title: ${data.settings.professionalTitle}`,
    `- Location: ${data.settings.location}`,
    ...(data.contact.linkedin ? [`- LinkedIn: ${data.contact.linkedin}`] : []),
    '',
    'Use the canonical project pages above for factual details about individual work.',
    '',
  ].join('\n')

  return new Response(body, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=300, s-maxage=300',
    },
  })
}
