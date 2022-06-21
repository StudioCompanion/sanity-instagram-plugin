import { SanityClient } from '@sanity/client'
import groq from 'groq'

import { INSTAGRAM_SETTINGS_DOCUMENT_ID } from '../constants'

import { ErrorLevels, ErrorLog } from './Errors'
import { InstagramService } from './Instagram'

export class AuthService extends InstagramService {
  protected client: SanityClient

  private accessToken: string | null = null

  constructor(client: SanityClient) {
    super()

    this.client = client

    this.getAccessToken().then((token) => {
      if (token && typeof token === 'string') {
        this.refreshAccessToken()
      }
    })
  }

  getAccessToken = async (): Promise<string | null> => {
    if (this.accessToken) {
      return this.accessToken
    }

    const query = groq`
        *[_type == $type][0]{
          accessToken
        }
    `

    const { accessToken } = await this.client.fetch<{
      accessToken: string | null
    }>(query, {
      type: INSTAGRAM_SETTINGS_DOCUMENT_ID,
    })

    this.accessToken = accessToken || null

    return accessToken
  }

  /**
   * TODO: Could use the expiry to know _if_ we need to try and refresh?
   */
  private refreshAccessToken = async () => {
    try {
      if (!this.accessToken) {
        return
      }

      const newToken = await this.refreshLongLifeToken(this.accessToken)

      if (!newToken) {
        throw new Error()
      } else {
        await this.client
          .patch(INSTAGRAM_SETTINGS_DOCUMENT_ID)
          .set({
            accessToken: newToken,
          })
          .commit()
      }
    } catch (err) {
      new ErrorLog('Access token is no longer valid', ErrorLevels.Warn)
      this.logout()
    }
  }

  logout = async () => {
    try {
      this.accessToken = null

      await this.client
        .patch(INSTAGRAM_SETTINGS_DOCUMENT_ID)
        .set({
          accessToken: '',
          userId: '',
        })
        .commit()
    } catch (err) {
      console.error(err)
      new ErrorLog('Failed to log user out.', ErrorLevels.Error)
    }
  }
}
