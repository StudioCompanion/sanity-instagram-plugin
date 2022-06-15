import * as React from 'react'
import styled from 'styled-components'
import { Box, Button, Inline } from '@sanity/ui'

import { useStore } from '../store'

import { ButtonInstagramLogin } from './Buttons/ButtonInstagramLogin'
import { ButtonUploadInstagramImages } from './Buttons/ButtonUploadInstagramImages'
import { CloseIcon } from '@sanity/icons'

interface HeaderProps {
  onClose?: () => void
}

export const Header = ({ onClose }: HeaderProps) => {
  const setShowSettingsDialog = useStore((state) => state.setShowSettingsDialog)

  const handleSettingsClick = () => {
    setShowSettingsDialog((isCurrentShowing) => !isCurrentShowing)
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
