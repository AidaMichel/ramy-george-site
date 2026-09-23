import {defineField, defineType} from 'sanity'

/** “Two Screens”: only for projects that really have a second format (e.g. 16:9 episode + 9:16 promo). */
export const secondScreen = defineType({
  name: 'secondScreen',
  title: 'Two Screens (second format)',
  type: 'object',
  options: {collapsible: true, collapsed: true},
  fields: [
    defineField({name: 'enabled', type: 'boolean', initialValue: false}),
    defineField({name: 'label', type: 'string', initialValue: '9:16 PROMO'}),
    defineField({name: 'aspect', type: 'string', options: {list: ['9:16', '4:5', '1:1', '16:9']}, initialValue: '9:16'}),
    defineField({name: 'poster', type: 'image', options: {hotspot: true}}),
    defineField({name: 'url', title: 'Published video URL', type: 'url', validation: (r) => r.uri({scheme: ['https']})}),
    defineField({name: 'watchLabel', type: 'string', initialValue: 'Promo on Vimeo ↗'}),
  ],
})
