import ImagesIcon from 'part:@sanity/base/images-icon'
import { route } from 'part:@sanity/base/router'

import { Instagram } from './app'

export default {
  title: 'Instagram',
  name: 'instagram',
  icon: ImagesIcon,
  router: route('/authorization'),
  component: Instagram,
}
