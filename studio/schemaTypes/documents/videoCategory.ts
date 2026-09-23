import {defineField, defineType} from 'sanity'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'
import {TagIcon} from '@sanity/icons/Tag'

export const videoCategory = defineType({
  name: 'videoCategory',
  title: 'Video category',
  type: 'document',
  icon: TagIcon,
  orderings: [orderRankOrdering],
  fields: [
    defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'slug', type: 'slug', options: {source: 'title'}, validation: (r) => r.required()}),
    defineField({name: 'visible', type: 'boolean', initialValue: true}),
    orderRankField({type: 'videoCategory'}),
  ],
  preview: {select: {title: 'title', visible: 'visible'}, prepare: ({title, visible}) => ({title, subtitle: visible === false ? 'Hidden' : ''})},
})
