import {defineField, defineType} from 'sanity'
import {CaseIcon} from '@sanity/icons/Case'

export const organisation = defineType({
  name: 'organisation',
  title: 'Organisation',
  type: 'document',
  icon: CaseIcon,
  fields: [
    defineField({name: 'name', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'website', title: 'Official website', type: 'url', validation: (r) => r.uri({scheme: ['https']})}),
  ],
})
