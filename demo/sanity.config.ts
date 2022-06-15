import {createConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {SanityInstagramPlugin} from 'sanity-plugin-instagram'

import {deskStructure} from './deskStructure'
import {schemaTypes} from './schemas'

export default createConfig({
  name: 'default',
  title: 'Instagram Plugin',

  projectId: 'ae1ddmef',
  dataset: 'production',

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
