import * as React from 'react'
import { Button } from '@sanity/ui'

import { Instagram } from '../../services/Instagram'
import { useGlobalState } from '../../contexts/GlobalStateContext'
import { useSelector } from '@xstate/react'

export const ButtonInstagramLogin = () => {
  const globalState = useGlobalState()
  const settings = useSelector(globalState, (state) => state.context.settings)
  const isLoggedIn = useSelector(
    globalState,
    (state) => state.context.settings?.token
  )

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

  const isDisabled = Boolean(!canLogin || isLoggedIn)

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
