import groq from 'groq'
import { INSTAGRAM_SETTINGS_DOCUMENT_ID } from '../../constants'

import { client } from '../../helpers/client'

import type { SettingsSlice, Settings } from './index'

export type LoadSettings = () => Promise<void>

export const loadSettings: SettingsSlice<LoadSettings> = (set) => async () => {
  const query = groq`
        *[_type == $type][0]{
            clientId,
            redirectUrl,
            clientSecret,
            token
        }
    `
  const settings = await client.fetch<Settings>(query, {
    type: INSTAGRAM_SETTINGS_DOCUMENT_ID,
  })

  set({
    settings,
  })

  return
}
