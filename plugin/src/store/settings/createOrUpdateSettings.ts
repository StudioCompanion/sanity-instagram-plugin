import type { SanityClient } from '@sanity/client'

import type { Settings } from './index'

import { INSTAGRAM_SETTINGS_DOCUMENT_ID } from '../../constants'

export type SettingsPayload = Required<Omit<Settings, 'token'>>

export type CreateOrUpdateSettings = (
  payload: SettingsPayload,
  client: SanityClient
) => Promise<void>

export const createOrUpdateSettings: CreateOrUpdateSettings = async (
  payload,
  client
) => {
  const doc = {
    _id: INSTAGRAM_SETTINGS_DOCUMENT_ID,
    _type: INSTAGRAM_SETTINGS_DOCUMENT_ID,
    ...payload,
  }

  await client.createOrReplace(doc)

  return
}
