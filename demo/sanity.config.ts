import {createConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {SanityInstagramPlugin} from 'sanity-plugin-instagram'

import {deskStructure} from './deskStructure'
import {schemaTypes} from './schemas'

export default createConfig({
  name: 'default',
  title: 'Instagram Plugin',

  projectId: import.meta.env.SANITY_STUDIO_PROJECT_ID,
  dataset: import.meta.env.SANITY_STUDIO_DATASET,

  plugins: [
    deskTool({
      structure: deskStructure,
    }),
    // @ts-expect-error not sure...
    SanityInstagramPlugin(),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    newDocumentOptions: () => [],
  },
})
