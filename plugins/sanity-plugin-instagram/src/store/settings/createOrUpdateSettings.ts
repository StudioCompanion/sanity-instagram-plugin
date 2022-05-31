import type { Settings } from './index'
import { client } from '../../helpers/client'
import { INSTAGRAM_SETTINGS_DOCUMENT_ID } from '../../constants'

export type SettingsPayload = Required<Omit<Settings, 'token'>>

export type CreateOrUpdateSettings = (payload: SettingsPayload) => Promise<void>

export const createOrUpdateSettings: CreateOrUpdateSettings = async (
  payload
) => {
  const doc = {
    _id: INSTAGRAM_SETTINGS_DOCUMENT_ID,
    _type: INSTAGRAM_SETTINGS_DOCUMENT_ID,
    ...payload,
  }

  await client.createOrReplace(doc)

  return
}
