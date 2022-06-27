import { ImagesIcon } from '@sanity/icons'
import { createPlugin } from 'sanity'

import { InstagramApp } from './app'

export { createAndSaveLongLifeInstagramToken } from './function'

const plugin = {
  title: 'Instagram',
  name: 'instagram',
  icon: ImagesIcon,
  component: InstagramApp,
}

export const SanityInstagramPlugin = createPlugin<void>(() => {
  return {
    schema: [],
    tools: (prev) => {
      return [...prev, plugin]
    },
    formBuilder: {
      image: {
        assetSources: (prev) => {
          return [...prev, plugin]
        },
      },
    },
    name: 'sanity-instagram-plugin',
  }
})
