import * as React from 'react'
import { Box, Button, Flex, Inline } from '@sanity/ui'
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
    <Box as="header" paddingX={3} paddingY={3}>
      <Flex justify="space-between" width="100%">
        <ButtonInstagramLogin />
        <Inline space={[2, 2, 3]}>
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
      </Flex>
    </Box>
  )
}
