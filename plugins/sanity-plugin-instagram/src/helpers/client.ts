import type { SanityClient } from '@sanity/client'
import sanityClient from 'part:@sanity/base/client'

export const client: SanityClient =
  typeof sanityClient.withConfig === 'function'
    ? sanityClient.withConfig({ apiVersion: 'v2022-05-31' })
    : sanityClient
