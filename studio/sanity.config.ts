// Ramy George Studio — content dashboard configuration
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes, SINGLETONS} from './schemaTypes'
import {structure} from './structure'

export default defineConfig({
  name: 'ramy-george',
  title: 'Ramy George — Website',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'REPLACE_WITH_PROJECT_ID',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  plugins: [structureTool({structure}), visionTool()],
  schema: {
    types: schemaTypes,
    // Singletons can't be created from the global "+" menu
    templates: (templates) => templates.filter(({schemaType}) => !SINGLETONS.includes(schemaType)),
  },
  document: {
    // "Open preview" in the document menu -> the private draft-preview site
    productionUrl: async (prev, {document}) => {
      const base = process.env.SANITY_STUDIO_PREVIEW_URL
      if (!base) return prev
      const slug = (document as any)?.slug?.current
      if (document._type === 'project' && slug) return `${base}/work/${slug}/`
      if (document._type === 'about') return `${base}/about/`
      if (document._type === 'contact') return `${base}/contact/`
      return `${base}/`
    },
    // Singletons: no duplicate / delete
    actions: (input, context) =>
      SINGLETONS.includes(context.schemaType)
        ? input.filter(({action}) => action && ['publish', 'discardChanges', 'restore', 'unpublish'].includes(action))
        : input,
  },
})
