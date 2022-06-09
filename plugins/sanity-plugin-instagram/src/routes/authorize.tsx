import * as React from 'react'
import { Card, Flex } from '@sanity/ui'
import axios from 'axios'
import groq from 'groq'

import { client } from '../helpers/client'

interface InstagramSettings {
  clientId: string | null
  clientSecret: string | null
  redirectUrl: string | null
}

interface InstagramShortLivedToken {
  access_token?: string
  user_id?: string
}

interface InstagramLongLivedToken {
  access_token: string
  token_type: 'bearer'
  expires_in: number
}

export const AuthorizationRoute = () => {
  const searchParams = new URL(window.location.href).searchParams
  const code = searchParams.get('code')

  if (!code) {
    window.location.pathname = '/instagram'
  }

  React.useEffect(() => {
    const query = groq`
        *[_type == "instagram.settings"][0]{
        clientId,
        clientSecret,
        redirectUrl
        }
    `

    client
      .fetch<InstagramSettings>(query)
      .then(async ({ clientSecret, clientId, redirectUrl }) => {
        try {
          const formData = new URLSearchParams()
          formData.set('client_id', clientId ?? '')
          formData.set('client_secret', clientSecret ?? '')
          formData.set('redirect_uri', redirectUrl ?? '')
          formData.set('grant_type', 'authorization_code')
          formData.set('code', code as string)

          const { data: shortData } =
            await axios.post<InstagramShortLivedToken>(
              'https://api.instagram.com/oauth/access_token',
              formData
            )

          const { data } = await axios.get<InstagramLongLivedToken>(
            `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${clientSecret}&access_token=${shortData.access_token}`
          )

          await client
            .patch('instagram.settings')
            .set({
              accessToken: data.access_token,
              userId: shortData.user_id,
            })
            .commit()
        } catch (err) {
          console.error(err)
        } finally {
          window.location.search = ''
          window.location.pathname = '/instagram'
        }
      })
  }, [code])

  return (
    <Card display="flex" height="fill">
      <Flex flex={1} align="center" justify="center">
        <h1>Logging you in...</h1>
      </Flex>
    </Card>
  )
}
