import {defineField, defineType} from 'sanity'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'
import {PlayIcon} from '@sanity/icons'

const ASPECTS = ['16:9', '9:16', '1:1', '4:5', '3:4']

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: PlayIcon,
  orderings: [orderRankOrdering],
  groups: [
    {name: 'quick', title: 'Quick', default: true},
    {name: 'advanced', title: 'Advanced ↓'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    // ---------- QUICK ----------
    defineField({name: 'title', type: 'string', group: 'quick', validation: (r) => r.required()}),
    defineField({
      name: 'kind',
      title: 'Where does it appear?',
      type: 'string',
      group: 'quick',
      initialValue: 'video',
      options: {
        list: [
          {title: 'Video', value: 'video'},
          {title: 'Motion & AI', value: 'motion'},
          {title: 'Posts & Carousels', value: 'post'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'category',
      title: 'Video category',
      type: 'reference',
      to: [{type: 'videoCategory'}],
      group: 'quick',
      hidden: ({document}) => document?.kind !== 'video',
      validation: (r) =>
        r.custom((v, ctx) => ((ctx.document as any)?.kind === 'video' && !v ? 'Pick a category' : true)),
    }),
    defineField({
      name: 'motionType',
      title: 'Motion & AI filter',
      type: 'string',
      group: 'quick',
      hidden: ({document}) => document?.kind !== 'motion',
      options: {
        list: [
          {title: 'Motion', value: 'motion'},
          {title: 'AI Gen', value: 'ai'},
          {title: 'Logo animation', value: 'logo'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'motion',
    }),
    defineField({name: 'organisation', title: 'Organisation / client', type: 'reference', to: [{type: 'organisation'}], group: 'quick'}),
    defineField({name: 'role', type: 'string', group: 'quick', description: 'e.g. Editing · Music & sound · Thumbnail'}),
    defineField({
      name: 'poster',
      title: 'Website thumbnail / poster',
      type: 'image',
      group: 'quick',
      options: {hotspot: true, metadata: ['lqip', 'palette']},
      description: 'Clean frame from the source footage, no baked-in titles. Recommended: 2560 × 1440 (16:9) or 1080 × 1920 (9:16). The preview below shows the crop; size and ratio are checked on publish.',
      fields: [defineField({name: 'alt', title: 'Alt text', type: 'string', validation: (r) => r.warning().custom((v) => (v ? true : 'Describe the frame for screen readers'))})],
      validation: (r) =>
        r
          .custom((v: any, ctx) => ((ctx.document as any)?.kind === 'video' && !v?.asset ? 'A website poster is required for video projects' : true))
          .custom(async (v: any, ctx) => {
            if (!v?.asset?._ref) return true
            const m = v.asset._ref.match(/-(\d+)x(\d+)-/)
            if (!m) return true
            const [w, h] = [Number(m[1]), Number(m[2])]
            const vertical = h > w
            const [minW, minH] = vertical ? [720, 1280] : [1920, 1080]
            return w >= minW && h >= minH ? true : {message: `Poster is ${w} × ${h}. Recommended minimum ${minW} × ${minH} — it may look soft on large screens.`, level: 'warning'} as any
          }),
    }),
    defineField({
      name: 'desktopPoster',
      title: 'Desktop poster (optional override)',
      type: 'image',
      group: 'advanced',
      options: {hotspot: true},
    }),
    defineField({
      name: 'previewLoop',
      title: 'Preview / short muted loop (MP4, few seconds)',
      type: 'file',
      group: 'quick',
      options: {accept: 'video/mp4,video/webm'},
    }),
    defineField({
      name: 'watchUrl',
      title: 'Full video link (Watch ↗)',
      type: 'url',
      group: 'quick',
      description: 'Vimeo / YouTube / LinkedIn URL. Leave empty and the Watch button is hidden — never a dead link.',
      validation: (r) => r.uri({scheme: ['https']}),
    }),
    defineField({name: 'visible', title: 'Visible', type: 'boolean', group: 'quick', initialValue: true}),
    defineField({name: 'featured', type: 'boolean', group: 'quick', initialValue: false}),

    // ---------- ADVANCED ----------
    defineField({name: 'slug', type: 'slug', group: 'advanced', options: {source: 'title', maxLength: 80}, validation: (r) => r.required()}),
    defineField({
      name: 'status',
      type: 'string',
      group: 'advanced',
      description: 'Draft / Publish is handled by the Publish button. Archived hides the project everywhere but keeps it.',
      options: {list: [{title: 'Active', value: 'active'}, {title: 'Archived', value: 'archived'}], layout: 'radio'},
      initialValue: 'active',
    }),
    defineField({name: 'showOnHome', title: 'Show on homepage', type: 'boolean', group: 'advanced', initialValue: true}),
    defineField({name: 'showOnWork', title: 'Show on Work page', type: 'boolean', group: 'advanced', initialValue: true}),
    defineField({name: 'aspect', title: 'Main aspect ratio', type: 'string', group: 'advanced', options: {list: ASPECTS}, initialValue: '16:9'}),
    defineField({name: 'homepagePreview', title: 'Homepage preview image (overrides poster)', type: 'image', group: 'advanced', options: {hotspot: true}}),
    defineField({name: 'hoverPreview', title: 'Hover preview (MP4)', type: 'file', group: 'advanced', options: {accept: 'video/mp4,video/webm'}}),
    defineField({name: 'cover', title: 'Thumbnail / cover (Work page)', type: 'image', group: 'advanced', options: {hotspot: true}}),
    defineField({name: 'mobilePoster', title: 'Mobile poster (optional)', type: 'image', group: 'advanced', options: {hotspot: true}}),
    defineField({
      name: 'watchLabel',
      title: 'Watch button label',
      type: 'string',
      group: 'advanced',
      description: 'Leave empty for automatic (“Watch on Vimeo ↗”, “Watch on YouTube ↗”…)',
    }),
    defineField({name: 'secondScreen', type: 'secondScreen', group: 'advanced'}),
    defineField({
      name: 'slides',
      title: 'Carousel slides (in order)',
      type: 'array',
      group: 'advanced',
      hidden: ({document}) => document?.kind !== 'post',
      of: [{type: 'image', options: {hotspot: false}, fields: [defineField({name: 'alt', type: 'string'})]}],
      options: {layout: 'grid'},
    }),
    defineField({
      name: 'slideAspect',
      type: 'string',
      group: 'advanced',
      hidden: ({document}) => document?.kind !== 'post',
      options: {list: ['4:5', '3:4', '1:1']},
      initialValue: '4:5',
    }),
    defineField({name: 'summary', title: 'Short description (project page)', type: 'text', rows: 3, group: 'advanced'}),
    defineField({name: 'credits', type: 'text', rows: 3, group: 'advanced'}),
    defineField({name: 'seo', type: 'seo', group: 'seo'}),
    orderRankField({type: 'project', newItemPosition: 'after'}),
  ],
  preview: {
    select: {title: 'title', org: 'organisation.name', kind: 'kind', cat: 'category.title', media: 'poster', visible: 'visible', status: 'status', url: 'watchUrl', ref: 'poster.asset._ref'},
    prepare: ({title, org, kind, cat, media, visible, status, url, ref}) => ({
      title,
      media,
      subtitle: [kind === 'video' ? cat : kind, org, ref ? (ref.match(/-(\d+x\d+)-/) || [])[1]?.replace('x', ' × ') : 'NO POSTER', visible === false ? 'HIDDEN' : null, status === 'archived' ? 'ARCHIVED' : null, kind === 'video' && !url ? 'LINK NEEDED' : null]
        .filter(Boolean)
        .join(' · '),
    }),
  },
})
