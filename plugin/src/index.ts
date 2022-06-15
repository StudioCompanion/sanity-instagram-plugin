import { ImagesIcon } from '@sanity/icons'
import { createPlugin } from 'sanity'

import { InstagramApp } from './app'

const plugin = {
  title: 'Instagram',
  name: 'instagram',
  icon: ImagesIcon,
  component: InstagramApp,
}

export const SanityInstagramPlugin = createPlugin<void>(() => {
  return {
    schema: [],
    tools: [plugin],
    formBuilder: {
      image: {
        assetSources: [plugin],
      },
    },
    name: 'sanity-instagram-plugin',
  }
})
