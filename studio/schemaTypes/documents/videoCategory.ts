import {defineField, defineType} from 'sanity'
import {TagIcon} from '@sanity/icons/Tag'
import {manualOrderRankField, manualOrderRankOrdering} from '../orderRank'

export const videoCategory = defineType({
  name: 'videoCategory',
  title: 'Video category',
  type: 'document',
  icon: TagIcon,
  orderings: [manualOrderRankOrdering],
  fields: [
    defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'slug', type: 'slug', options: {source: 'title'}, validation: (r) => r.required()}),
    defineField({name: 'visible', type: 'boolean', initialValue: true}),
    manualOrderRankField,
  ],
  preview: {select: {title: 'title', visible: 'visible'}, prepare: ({title, visible}) => ({title, subtitle: visible === false ? 'Hidden' : ''})},
})
