import {defineField, defineType} from 'sanity'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'
import {ImageIcon} from '@sanity/icons/Image'

export const LOGO_GROUPS = [
  {title: 'Clients & Collaborations', value: 'clients'},
  {title: 'Media & Organisations', value: 'media'},
  {title: 'Events & Coverage', value: 'events'},
]

export const credibilityLogo = defineType({
  name: 'credibilityLogo',
  title: 'Logo',
  type: 'document',
  icon: ImageIcon,
  orderings: [orderRankOrdering],
  fields: [
    defineField({name: 'name', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'organisation', type: 'reference', to: [{type: 'organisation'}]}),
    defineField({name: 'group', type: 'string', options: {list: LOGO_GROUPS, layout: 'radio'}, validation: (r) => r.required()}),
    defineField({name: 'officialLogo', title: 'Official logo (as supplied)', type: 'image', description: 'Keep the original file for reference'}),
    defineField({name: 'logo', title: 'Light logo (shown on the dark site)', type: 'image', description: 'Transparent PNG or SVG, light artwork'}),
    defineField({name: 'darkLogo', title: 'Dark logo (for light backgrounds, future use)', type: 'image'}),
    defineField({
      name: 'displayVersion',
      title: 'Version shown on the site',
      type: 'string',
      options: {list: [{title: 'Light logo (recommended on the dark site)', value: 'light'}, {title: 'Official logo', value: 'official'}, {title: 'Dark logo', value: 'dark'}], layout: 'radio'},
      initialValue: 'light',
      description: 'If the chosen version is empty, the light logo is used.',
    }),
    defineField({
      name: 'size',
      title: 'Optical size',
      type: 'number',
      description: 'Display height in px on desktop — balance visually heavy vs light marks',
      initialValue: 48,
      validation: (r) => r.min(20).max(90),
    }),
    defineField({
      name: 'destination',
      type: 'string',
      options: {
        list: [
          {title: 'Not clickable (default)', value: 'none'},
          {title: 'Official website (future use; not shown as a link on the homepage)', value: 'external'},
        ],
        layout: 'radio',
      },
      initialValue: 'none',
    }),
    defineField({
      name: 'url',
      type: 'url',
      hidden: ({document}) => document?.destination !== 'external',
      validation: (r) => r.uri({scheme: ['https']}),
    }),
    defineField({name: 'visible', type: 'boolean', initialValue: true}),
    orderRankField({type: 'credibilityLogo'}),
  ],
  preview: {
    select: {title: 'name', group: 'group', media: 'logo', dest: 'destination', visible: 'visible'},
    prepare: ({title, group, media, dest, visible}) => ({
      title,
      media,
      subtitle: [LOGO_GROUPS.find((g) => g.value === group)?.title, dest !== 'none' ? '→ ' + dest : null, !media ? 'LOGO NEEDED' : null, visible === false ? 'Hidden' : null]
        .filter(Boolean)
        .join(' · '),
    }),
  },
})
