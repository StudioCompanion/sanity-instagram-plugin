import * as React from 'react'
import { Button } from '@sanity/ui'
import { useStore } from '../store'

export const InstagramLoginButton = () => {
  const settings = useStore((state) => state.settings)
  const canLogin = Boolean(
    settings &&
      settings.clientSecret &&
      settings.clientId &&
      settings.redirectUrl
  )

  return (
    <Button
      fontSize={[1, 1, 2]}
      tone="primary"
      padding={[2, 2, 3]}
      text="Login"
      disabled={!canLogin}
    />
  )
}
