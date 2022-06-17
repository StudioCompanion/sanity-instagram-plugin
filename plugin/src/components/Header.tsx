import * as React from 'react'
import styled from 'styled-components'
import { Box, Button, Inline } from '@sanity/ui'
import { CloseIcon } from '@sanity/icons'

import { ButtonInstagramLogin } from './Buttons/ButtonInstagramLogin'
import { ButtonUploadInstagramImages } from './Buttons/ButtonUploadInstagramImages'

import { useGlobalState } from '../contexts/GlobalStateContext'

interface HeaderProps {
  onClose?: () => void
}

export const Header = ({ onClose }: HeaderProps) => {
  const { send } = useGlobalState()

  const handleSettingsClick = () => {
    send('SETTINGS_SHOW')
  }

  return (
    <Head>
      <Inline space={[2, 2, 3]}>
        <ButtonInstagramLogin />
        <ButtonUploadInstagramImages />
        <Button
          fontSize={[1, 1, 2]}
          mode="ghost"
          padding={[2, 2, 3]}
          text="Settings"
          style={{ cursor: 'pointer' }}
          onClick={handleSettingsClick}
        />
        {/* Close */}
        {onClose && (
          <Box style={{ flexShrink: 0 }}>
            <Button
              disabled={!onClose}
              icon={CloseIcon}
              mode="bleed"
              onClick={onClose}
              radius={2}
            />
          </Box>
        )}
      </Inline>
    </Head>
  )
}

const Head = styled.header`
  display: flex;
  justify-content: flex-end;
  padding: 8px 24px;
`
