import {defineField, defineType} from 'sanity'

/** A button/link used in About and elsewhere. External links open in a new tab automatically. */
export const linkItem = defineType({
  name: 'linkItem',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({name: 'label', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'kind',
      type: 'string',
      initialValue: 'custom',
      options: {
        list: [
          {title: 'LinkedIn (from Contact)', value: 'linkedin'},
          {title: 'Email (from Contact)', value: 'email'},
          {title: 'WhatsApp (from Contact)', value: 'whatsapp'},
          {title: 'CV file (from Site Settings)', value: 'cv'},
          {title: 'Work page', value: 'work'},
          {title: 'Info page', value: 'info'},
          {title: 'Custom URL', value: 'custom'},
        ],
      },
    }),
    defineField({
      name: 'url',
      title: 'Custom URL',
      type: 'url',
      hidden: ({parent}) => parent?.kind !== 'custom',
      validation: (r) => r.uri({scheme: ['https', 'mailto']}),
    }),
    defineField({name: 'visible', type: 'boolean', initialValue: true}),
  ],
  preview: {select: {title: 'label', subtitle: 'kind'}},
})
