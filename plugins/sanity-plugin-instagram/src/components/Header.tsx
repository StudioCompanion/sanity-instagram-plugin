import * as React from 'react'
import styled from 'styled-components'
import { Button, Inline } from '@sanity/ui'

import { InstagramLoginButton } from './InstagramLoginButton'
import { useStore } from '../store'

export const Header = () => {
  const setShowSettingsDialog = useStore((state) => state.setShowSettingsDialog)

  const handleSettingsClick = () => {
    setShowSettingsDialog((isCurrentShowing) => !isCurrentShowing)
  }

  return (
    <Head>
      <Inline space={[2, 2, 3]}>
        <InstagramLoginButton />
        <Button
          fontSize={[1, 1, 2]}
          mode="ghost"
          padding={[2, 2, 3]}
          text="Settings"
          onClick={handleSettingsClick}
        />
      </Inline>
    </Head>
  )
}

const Head = styled.header`
  display: flex;
  justify-content: flex-end;
  padding: 8px 24px;
`
