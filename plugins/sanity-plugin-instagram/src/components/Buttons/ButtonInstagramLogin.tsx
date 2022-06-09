import * as React from 'react'
import { Button } from '@sanity/ui'
import { useStore } from '../../store'
import { Instagram } from '../../services/Instagram'

export const ButtonInstagramLogin = () => {
  const settings = useStore((state) => state.settings)
  const isLoggedIn = useStore((state) => state.isLoggedIn)
  const canLogin = Boolean(
    settings &&
      settings.clientSecret &&
      settings.clientId &&
      settings.redirectUrl
  )

  const loginUrl = new URL(Instagram.Endpoints.Authorize)

  loginUrl.searchParams.set('client_id', settings?.clientId ?? '')
  loginUrl.searchParams.set('redirect_uri', settings?.redirectUrl ?? '')
  loginUrl.searchParams.set('scope', 'user_profile,user_media')
  loginUrl.searchParams.set('response_type', 'code')

  const isDisabled = !canLogin || isLoggedIn

  return (
    <Button
      fontSize={[1, 1, 2]}
      tone="primary"
      padding={[2, 2, 3]}
      text={isLoggedIn ? 'Logged in' : 'Login'}
      as="a"
      href={loginUrl.toString()}
      style={{ pointerEvents: isDisabled ? 'none' : 'auto' }}
      disabled={isDisabled}
    />
  )
}
