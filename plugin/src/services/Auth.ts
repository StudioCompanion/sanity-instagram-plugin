import { SanityClient } from '@sanity/client'
import axios from 'axios'
import groq from 'groq'
import { INSTAGRAM_SETTINGS_DOCUMENT_ID } from '../constants'
import { ErrorLevels, ErrorLog } from './Errors'
import { Instagram } from './Instagram'

export interface InstagramLongLifeToken {
  access_token: string
  token_type: 'bearer'
  expires_in: number
}

export class AuthService {
  protected client: SanityClient

  private accessToken: string | null = null

  constructor(client: SanityClient) {
    this.client = client

    this.getAccessToken().then((token) => {
      if (token) {
        this.refreshAccessToken()
      }
    })
  }

  getAccessToken = async (): Promise<string | null> => {
    if (this.accessToken) {
      return this.accessToken
    }

    const query = groq`
        *[_type == $type][0].accessToken
    `

    const token = await this.client.fetch<string | null>(query, {
      type: INSTAGRAM_SETTINGS_DOCUMENT_ID,
    })

    this.accessToken = token

    return token
  }

  /**
   * TODO: Could use the expiry to know _if_ we need to try and refresh?
   */
  private refreshAccessToken = async () => {
    try {
      const { data } = await axios.get<Partial<InstagramLongLifeToken>>(
        `${Instagram.Endpoints.RefreshLongLife}?grant_type=ig_refresh_token&access_token=${this.accessToken}`
      )

      const { access_token } = data

      if (!access_token) {
        throw new Error()
      } else {
        await this.client
          .patch(INSTAGRAM_SETTINGS_DOCUMENT_ID)
          .set({
            accessToken: access_token,
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
