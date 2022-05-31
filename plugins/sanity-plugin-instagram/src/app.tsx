import * as React from 'react'
import {
  Card,
  Flex,
  ThemeProvider,
  ToastProvider,
  studioTheme,
} from '@sanity/ui'
import { Header } from './components/Header'

import { useStore } from './store'
import { DialogSettings } from './components/Dialogs/DialogSettings'

export const Instagram = () => {
  const showSettingsDialog = useStore((state) => state.showSettingsDialog)
  const loadSettings = useStore((state) => state.loadSettings)

  React.useEffect(() => {
    loadSettings()
  }, [loadSettings])

  return (
    <ThemeProvider theme={studioTheme} scheme="light">
      <ToastProvider>
        <Card display="flex" height="fill">
          <Flex direction="column" flex={1}>
            <Header />
            <Flex flex={1}>
              <Flex
                align="flex-end"
                direction="column"
                flex={1}
                style={{ position: 'relative' }}
              ></Flex>
            </Flex>
          </Flex>
        </Card>
        {showSettingsDialog ? <DialogSettings /> : null}
      </ToastProvider>
    </ThemeProvider>
  )
}
