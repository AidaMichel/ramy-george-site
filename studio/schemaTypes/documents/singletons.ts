import {defineArrayMember, defineField, defineType} from 'sanity'
import {CogIcon} from '@sanity/icons/Cog'
import {EnvelopeIcon} from '@sanity/icons/Envelope'
import {HomeIcon} from '@sanity/icons/Home'
import {MenuIcon} from '@sanity/icons/Menu'
import {StarIcon} from '@sanity/icons/Star'
import {UserIcon} from '@sanity/icons/User'
import {LOGO_GROUPS} from './credibilityLogo'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({name: 'siteName', type: 'string', initialValue: 'Ramy George', validation: (r) => r.required()}),
    defineField({name: 'professionalTitle', type: 'string', initialValue: 'Video Generalist'}),
    defineField({
      name: 'supportingSkills',
      type: 'array',
      of: [{type: 'string'}],
      initialValue: ['Editing', 'Motion', 'Design', 'Sound Design', 'Camera', 'AI Gen'],
      description: 'The first skill is shown stronger — keep your main discipline first',
    }),
    defineField({name: 'location', type: 'string', initialValue: 'Based in Dubai'}),
    defineField({name: 'logo', title: 'Wordmark (light, transparent)', type: 'image', description: 'Shown top-left in the navigation'}),
    defineField({name: 'footerLogo', title: 'Footer signature logo', type: 'image', description: 'Leave empty to reuse the header wordmark'}),
    defineField({name: 'showFooterSignature', title: 'Show footer signature', type: 'boolean', initialValue: true}),
    defineField({
      name: 'footer',
      title: 'Footer content',
      type: 'object',
      fields: [
        defineField({name: 'showEmail', title: 'Show email link', type: 'boolean', initialValue: false}),
        defineField({name: 'creditLine', title: 'Credit line', type: 'string', initialValue: 'All thumbnails created by me'}),
        defineField({name: 'locationLine', type: 'string', initialValue: 'Dubai, UAE'}),
        defineField({name: 'copyrightName', type: 'string', initialValue: '', description: 'Optional. Leave empty so the name is not repeated under the wordmark. The year is added automatically.'}),
        defineField({name: 'backToTopLabel', type: 'string', initialValue: 'Back to top ↑'}),
      ],
    }),
    defineField({name: 'favicon', title: 'Favicon / app icon (square monogram)', type: 'image', description: 'Use a monogram, not the full wordmark'}),
    defineField({name: 'cv', title: 'CV (PDF)', type: 'file', options: {accept: 'application/pdf'}}),
    defineField({name: 'siteUrl', title: 'Public site URL', type: 'url', description: 'e.g. https://ramygeorge.com — used for canonical links and the sitemap'}),
    defineField({name: 'defaultSeo', title: 'Default SEO + social share image', type: 'seo'}),
    defineField({
      name: 'workIntro',
      title: 'Work page intro',
      type: 'text',
      rows: 2,
      initialValue: 'Selected video editing, motion design, sound design and visual storytelling work from Dubai.',
      description: 'Visible introduction on the Work page. Keep it natural and useful — not keyword stuffing.',
      validation: (r) => r.max(220).warning('Keep it concise.'),
    }),
    defineField({name: 'workSeo', title: 'Work page SEO + social image', type: 'seo'}),
    defineField({
      name: 'googleSiteVerification',
      title: 'Google Search Console verification token',
      type: 'string',
      description: 'Paste only the content value from Google’s meta tag. Publish to verify without a website rebuild.',
    }),
    defineField({
      name: 'bingSiteVerification',
      title: 'Bing Webmaster Tools verification token',
      type: 'string',
      description: 'Paste only the content value from the msvalidate.01 meta tag. Publish to verify without a website rebuild.',
    }),
    defineField({name: 'note', type: 'string', readOnly: true, initialValue: 'Email, WhatsApp, LinkedIn and the LET’S TALK button are edited in Home → Contact.'}),
  ],
  preview: {prepare: () => ({title: 'Site Settings'})},
})

export const navigation = defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  icon: MenuIcon,
  fields: [
    defineField({
      name: 'items',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'navItem',
          fields: [
            defineField({name: 'label', type: 'string', validation: (r) => r.required()}),
            defineField({
              name: 'target',
              type: 'string',
              options: {list: [{title: 'Home', value: 'home'}, {title: 'Work', value: 'work'}, {title: 'Info page', value: 'about'}, {title: 'Let’s talk (homepage section)', value: 'contact'}, {title: 'Custom URL', value: 'custom'}]},
              validation: (r) => r.required(),
            }),
            defineField({name: 'url', type: 'url', hidden: ({parent}) => parent?.target !== 'custom'}),
            defineField({name: 'highlight', title: 'Accent colour (use for Let’s talk only)', type: 'boolean', initialValue: false}),
            defineField({name: 'visible', type: 'boolean', initialValue: true}),
          ],
          preview: {select: {title: 'label', subtitle: 'target'}},
        }),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Navigation'})},
})

export const homepage = defineType({
  name: 'homepage',
  title: 'Homepage Layout',
  type: 'document',
  icon: HomeIcon,
  groups: [
    {name: 'layout', title: 'Order & visibility', default: true},
    {name: 'video', title: 'Editing'},
    {name: 'motion', title: 'Motion & AI'},
    {name: 'posts', title: 'Posts & Carousels'},
    {name: 'clients', title: 'Clients & Coverage'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'sections',
      title: 'Sections (drag to reorder)',
      type: 'array',
      group: 'layout',
      of: [{type: 'homeSection'}],
      validation: (r) =>
        r.custom((arr: any[] | undefined) => {
          const keys = (arr || []).map((s) => s.key)
          return new Set(keys).size === keys.length ? true : 'Each section can appear once'
        }),
    }),
    defineField({name: 'defaultCategory', title: 'Default active editing category', type: 'reference', to: [{type: 'videoCategory'}], group: 'video'}),
    defineField({name: 'defaultProject', title: 'Default active editing project', type: 'reference', to: [{type: 'project'}], group: 'video', options: {filter: 'kind == "video"'}}),
    defineField({
      name: 'motionFilters',
      title: 'Motion & AI filters (order + visibility)',
      type: 'array',
      group: 'motion',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'motionFilter',
          fields: [
            defineField({name: 'key', type: 'string', options: {list: ['all', 'motion', 'ai', 'logo']}, validation: (r) => r.required()}),
            defineField({name: 'label', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'visible', type: 'boolean', initialValue: true}),
          ],
          preview: {select: {title: 'label', subtitle: 'key'}},
        }),
      ],
    }),
    defineField({
      name: 'posts',
      title: 'Carousels / posts shown (in order)',
      type: 'array',
      group: 'posts',
      of: [{type: 'reference', to: [{type: 'project'}], options: {filter: 'kind == "post"'}}],
    }),
    defineField({
      name: 'logoGroupHeadings',
      title: 'Group headings',
      type: 'object',
      group: 'clients',
      fields: LOGO_GROUPS.map((g) => defineField({name: g.value, type: 'string', initialValue: g.title})),
    }),
    defineField({
      name: 'logoGroupVisibility',
      title: 'Show groups',
      type: 'object',
      group: 'clients',
      fields: LOGO_GROUPS.map((g) => defineField({name: g.value, title: g.title, type: 'boolean', initialValue: true})),
    }),
    defineField({name: 'seo', type: 'seo', group: 'seo'}),
  ],
  preview: {prepare: () => ({title: 'Homepage Layout'})},
})

export const hero = defineType({
  name: 'hero',
  title: 'Hero',
  type: 'document',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'mode',
      title: 'Hero mode',
      type: 'string',
      options: {
        list: [
          {title: 'Editorial portrait (current default)', value: 'none'},
          {title: 'Portrait / behind the scenes', value: 'portrait'},
          {title: 'Single showcase', value: 'still'},
          {title: 'Multi-frame showcase', value: 'multiframe'},
          {title: 'Short muted showreel', value: 'showreel'},
        ],
        layout: 'radio',
      },
      initialValue: 'none',
    }),
    defineField({
      name: 'positioningLine',
      title: 'Hero positioning / Aha line',
      type: 'string',
      initialValue: 'The edit is the spine — motion, design and sound design make every beat land.',
      description: 'One short idea that reveals how you think — not another skills list. Publish and it updates live without a site build.',
      validation: (r) => r.max(120).warning('Keep this sharp. Around 60–100 characters works best.'),
    }),
    defineField({
      name: 'useDashboardImage',
      title: 'Use dashboard hero image',
      type: 'boolean',
      initialValue: false,
      description: 'Off keeps the approved built-in hero. Turn this on only after uploading the replacement image below, then Publish.',
    }),
    defineField({
      name: 'editorialPortrait',
      title: 'Homepage hero image',
      type: 'image',
      options: {hotspot: true},
      description: 'Upload the replacement image here, switch “Use dashboard hero image” on, then Publish. The live website updates within a few seconds — no new build needed.',
      fields: [defineField({name: 'alt', type: 'string', initialValue: 'Ramy George editing'})],
    }),
    defineField({
      name: 'portrait',
      type: 'image',
      options: {hotspot: true},
      hidden: ({document}) => document?.mode !== 'portrait',
      fields: [defineField({name: 'alt', type: 'string', initialValue: 'Ramy George'})],
    }),
    defineField({
      name: 'still',
      type: 'image',
      options: {hotspot: true},
      hidden: ({document}) => document?.mode !== 'still',
      fields: [defineField({name: 'alt', type: 'string'}), defineField({name: 'project', type: 'reference', to: [{type: 'project'}]})],
    }),
    defineField({
      name: 'frames',
      type: 'array',
      hidden: ({document}) => document?.mode !== 'multiframe',
      of: [{type: 'image', options: {hotspot: true}, fields: [defineField({name: 'alt', type: 'string'}), defineField({name: 'project', type: 'reference', to: [{type: 'project'}]})]}],
      validation: (r) => r.max(4),
    }),
    defineField({name: 'showreel', title: 'Showreel loop (MP4, muted, <15s)', type: 'file', options: {accept: 'video/mp4'}, hidden: ({document}) => document?.mode !== 'showreel'}),
    defineField({name: 'showreelPoster', type: 'image', hidden: ({document}) => document?.mode !== 'showreel'}),
    defineField({
      name: 'shortLine',
      title: 'Short intro line',
      type: 'text',
      hidden: ({document}) => document?.mode === 'none',
      rows: 2,
      description: 'One factual sentence. Not the About text, no slogans.',
      validation: (r) => r.max(160).warning('Keep it to one sentence'),
    }),
    defineField({name: 'ctaLabel', type: 'string', initialValue: 'See the work ↓'}),
    defineField({
      name: 'ctaTarget',
      type: 'string',
      options: {list: [{title: 'Editing section on the homepage', value: 'section'}, {title: 'Work page', value: 'work'}]},
      initialValue: 'section',
    }),
  ],
  preview: {select: {mode: 'mode'}, prepare: ({mode}) => ({title: 'Hero', subtitle: mode})},
})

export const about = defineType({
  name: 'about',
  title: 'About',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({name: 'heading', type: 'string', initialValue: 'About'}),
    defineField({name: 'paragraph', title: 'Full bio (used on Info)', type: 'text', rows: 6, validation: (r) => r.required()}),
    defineField({
      name: 'homepageParagraph',
      title: 'Short homepage intro',
      type: 'text',
      rows: 4,
      description: 'Keep this natural and short. The full biography belongs on the Info page.',
      initialValue: 'I’m Ramy, a video generalist based in Dubai. Editing is where I spend most of my time, but I also work across motion, design, sound and camera. I’ve worked on everything from news and documentaries to podcasts, social content and branded work.',
    }),
    defineField({name: 'portrait', type: 'image', options: {hotspot: true}, fields: [defineField({name: 'alt', type: 'string', initialValue: 'Ramy George'})]}),
    defineField({name: 'links', type: 'array', of: [{type: 'linkItem'}]}),
    defineField({name: 'seo', title: 'SEO (About page)', type: 'seo'}),
  ],
  preview: {prepare: () => ({title: 'About'})},
})

export const contact = defineType({
  name: 'contact',
  title: 'Contact',
  type: 'document',
  icon: EnvelopeIcon,
  fields: [
    defineField({name: 'email', type: 'string', validation: (r) => r.email()}),
    defineField({name: 'whatsapp', title: 'WhatsApp link', type: 'url', description: 'e.g. https://wa.me/…', validation: (r) => r.uri({scheme: ['https']})}),
    defineField({name: 'linkedin', title: 'LinkedIn URL', type: 'url', validation: (r) => r.uri({scheme: ['https']})}),
    defineField({name: 'kicker', type: 'string', initialValue: 'Have a project in mind?'}),
    defineField({name: 'heading', type: 'string', initialValue: 'Let’s talk.'}),
    defineField({name: 'buttonLabel', type: 'string', initialValue: 'LET’S TALK'}),
    defineField({name: 'buttonTarget', title: 'LET’S TALK button opens', type: 'string', options: {list: [{title: 'WhatsApp', value: 'whatsapp'}, {title: 'Email', value: 'email'}], layout: 'radio'}, initialValue: 'whatsapp'}),
    defineField({name: 'seo', title: 'SEO (legacy contact URL)', type: 'seo', hidden: true}),
  ],
  preview: {prepare: () => ({title: 'Contact'})},
})

export const info = defineType({
  name: 'info',
  title: 'Info page',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({name: 'heading', type: 'string', initialValue: 'Info'}),
    defineField({name: 'useAboutParagraph', title: 'Use the About paragraph as the intro', type: 'boolean', initialValue: true}),
    defineField({name: 'intro', type: 'text', rows: 5, hidden: ({document}) => document?.useAboutParagraph !== false}),
    defineField({name: 'showPortrait', type: 'boolean', initialValue: true}),
    defineField({
      name: 'experience',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'role',
          fields: [
            defineField({name: 'role', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'organisation', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'location', type: 'string'}),
            defineField({name: 'years', type: 'string', description: 'e.g. 2018 – present'}),
          ],
          preview: {select: {title: 'role', subtitle: 'organisation'}},
        }),
      ],
    }),
    defineField({
      name: 'training',
      title: 'Training & education',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'course',
          fields: [
            defineField({name: 'course', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'institution', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'year', type: 'string'}),
          ],
          preview: {select: {title: 'course', subtitle: 'institution'}},
        }),
      ],
    }),
    defineField({name: 'showCv', title: 'Show “Download CV ↗” (uses the CV in Site Settings)', type: 'boolean', initialValue: true}),
    defineField({name: 'cvLabel', type: 'string', initialValue: 'Download CV ↗'}),
    defineField({name: 'seo', type: 'seo'}),
  ],
  preview: {prepare: () => ({title: 'Info page'})},
})
