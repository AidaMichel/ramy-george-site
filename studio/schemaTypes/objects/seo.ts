import {defineField, defineType} from 'sanity'

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  options: {collapsible: true, collapsed: true},
  fields: [
    defineField({name: 'title', title: 'Meta title', type: 'string', validation: (r) => r.min(25).warning('Add a little more context for search').max(65).warning('Keep under ~60 characters')}),
    defineField({name: 'description', title: 'Meta description', type: 'text', rows: 3, validation: (r) => r.min(50).warning('Aim for a useful 1–2 sentence description').max(170).warning('Keep under ~160 characters')}),
    defineField({name: 'ogImage', title: 'Share image (1200×630)', type: 'image'}),
    defineField({name: 'noIndex', title: 'Hide from search engines', type: 'boolean', initialValue: false}),
  ],
})
