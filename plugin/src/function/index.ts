import groq from 'groq'
import sanityClient from '@sanity/client'
import axios from 'axios'

import { Settings } from '../services/Settings'
import { INSTAGRAM_SETTINGS_DOCUMENT_ID } from '../constants'

interface InstagramShortLivedToken {
  access_token?: string
  user_id?: string
}

interface InstagramLongLivedToken {
  access_token: string
  token_type: 'bearer'
  expires_in: number
}

interface ENV {
  projectId?: string
  dataset?: string
  apiToken?: string
}

export const createAndSaveLongLifeInstagramToken = async (
  code: string,
  { projectId, dataset, apiToken }: ENV
) => {
  const query = groq`
        *[_type == "instagram.settings"][0]{
          clientId,
          clientSecret,
          redirectUrl
        }
      `

  if (!projectId || !dataset || !apiToken) {
    throw new Error('ENV has not been setup correctly')
  }

  const client = sanityClient({
    projectId,
    dataset,
    useCdn: true,
    token: apiToken,
  })

  const { clientSecret, clientId, redirectUrl } = await client.fetch<Settings>(
    query
  )

  const formData = new URLSearchParams()
  formData.set('client_id', clientId ?? '')
  formData.set('client_secret', clientSecret ?? '')
  formData.set('redirect_uri', redirectUrl ?? '')
  formData.set('grant_type', 'authorization_code')
  formData.set('code', code as string)

  const { data: shortData } = await axios.post<InstagramShortLivedToken>(
    'https://api.instagram.com/oauth/access_token',
    formData
  )

  const { data } = await axios.get<InstagramLongLivedToken>(
    `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${clientSecret}&access_token=${shortData.access_token}`
  )

  await client
    .patch(INSTAGRAM_SETTINGS_DOCUMENT_ID)
    .set({
      accessToken: data.access_token,
      userId: shortData.user_id,
    })
    .commit()

  return
}
