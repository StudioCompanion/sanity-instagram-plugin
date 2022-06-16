import { SanityClient } from '@sanity/client'
import groq from 'groq'

import { INSTAGRAM_SETTINGS_DOCUMENT_ID } from '../constants'

export interface Settings {
  clientId?: string
  redirectUrl?: string
  clientSecret?: string
  token?: string
}

export type UpdateSettingsPayload = Required<Omit<Settings, 'token'>>

export class SettingsService {
  client: SanityClient
  settings?: Settings

  constructor(client: SanityClient) {
    this.client = client
  }

  updateSettings = async (payload: UpdateSettingsPayload): Promise<void> => {
    const doc = {
      _id: INSTAGRAM_SETTINGS_DOCUMENT_ID,
      _type: INSTAGRAM_SETTINGS_DOCUMENT_ID,
      ...payload,
    }

    await this.client.createOrReplace(doc)
  }

  getSettings = async (): Promise<Settings> => {
    const query = groq`
        *[_type == $type][0]{
            clientId,
            redirectUrl,
            clientSecret,
            accessToken,
        }
      `
    const res = await this.client.fetch<Settings>(query, {
      type: INSTAGRAM_SETTINGS_DOCUMENT_ID,
    })

    this.settings = res

    return res
  }
}
