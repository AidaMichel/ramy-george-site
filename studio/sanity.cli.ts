import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'REPLACE_WITH_PROJECT_ID',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  // Studio is hosted free by Sanity at https://<studioHost>.sanity.studio after `npm run deploy`
  studioHost: process.env.SANITY_STUDIO_HOST || undefined,
})
