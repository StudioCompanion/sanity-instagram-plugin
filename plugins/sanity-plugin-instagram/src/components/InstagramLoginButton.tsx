import * as React from 'react'
import { Button } from '@sanity/ui'
import { useStore } from '../store'
import { INSTAGRAM_AUTHORIZE_URL } from '../constants'

export const InstagramLoginButton = () => {
  const settings = useStore((state) => state.settings)
  const canLogin = Boolean(
    settings &&
      settings.clientSecret &&
      settings.clientId &&
      settings.redirectUrl
  )

  const loginUrl = new URL(INSTAGRAM_AUTHORIZE_URL)

  loginUrl.searchParams.set('client_id', settings?.clientId ?? '')
  loginUrl.searchParams.set('redirect_uri', settings?.redirectUrl ?? '')
  loginUrl.searchParams.set('scope', 'user_profile,user_media')
  loginUrl.searchParams.set('response_type', 'code')

  return (
    <Button
      fontSize={[1, 1, 2]}
      tone="primary"
      padding={[2, 2, 3]}
      text="Login"
      as="a"
      href={loginUrl.toString()}
      disabled={!canLogin}
    />
  )
}
