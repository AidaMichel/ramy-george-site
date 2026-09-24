import {defineField, defineType} from 'sanity'

export const SECTION_KEYS = [
  {title: 'Hero', value: 'hero'},
  {title: 'Editing', value: 'video'},
  {title: 'Motion & AI', value: 'motion'},
  {title: 'Posts & Carousels', value: 'posts'},
  {title: 'Clients & Coverage', value: 'clients'},
  {title: 'About', value: 'about'},
  {title: 'Let’s Talk', value: 'contact'},
]

/** One homepage section: order = position in the array; only approved variants are selectable. */
export const homeSection = defineType({
  name: 'homeSection',
  title: 'Section',
  type: 'object',
  fields: [
    defineField({name: 'key', title: 'Section', type: 'string', options: {list: SECTION_KEYS}, validation: (r) => r.required()}),
    defineField({name: 'visible', title: 'Show on homepage', type: 'boolean', initialValue: true}),
    defineField({
      name: 'heading',
      title: 'Section heading',
      type: 'string',
      description: 'Homepage heading shown to visitors. For the editing section use “Editing”. Change it here and Publish — no code edit is needed.',
    }),
    defineField({name: 'microcopy', type: 'string', description: 'Small guidance line, e.g. “BROWSE DIFFERENT FORMATS”'}),
    defineField({
      name: 'variant',
      title: 'Layout variant',
      type: 'string',
      description: 'Only design-approved variants are offered',
      options: {
        list: [
          {title: 'Default', value: 'default'},
          {title: 'Compact', value: 'compact'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'default',
    }),
  ],
  preview: {
    select: {key: 'key', visible: 'visible', heading: 'heading'},
    prepare: ({key, visible, heading}) => ({
      title: (SECTION_KEYS.find((s) => s.value === key)?.title || key) + (heading ? ` — “${heading}”` : ''),
      subtitle: visible === false ? 'Hidden' : 'Visible',
    }),
  },
})
