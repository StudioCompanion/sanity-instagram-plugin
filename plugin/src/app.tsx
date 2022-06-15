import * as React from 'react'
import {
  Flex,
  ThemeProvider,
  ToastProvider,
  studioTheme,
  Portal,
  Box,
  PortalProvider,
} from '@sanity/ui'
import { AssetFromSource, AssetSourceComponentProps } from '@sanity/types'

import { useStore } from './store'

import { DialogSettings } from './components/Dialogs/DialogSettings'
import { GridImageBrowser } from './components/Grids/GridImageBrowser'

import { AssetBrowserDispatchProvider } from './contexts/AssetSourceDispatchContext'
import { useClient } from 'sanity'

export const InstagramApp = React.forwardRef<
  HTMLDivElement,
  Omit<AssetSourceComponentProps, 'onSelect'> & {
    onSelect: (assetFromSource: AssetFromSource[]) => void
  }
>(({ onClose, onSelect }, ref) => {
  const showSettingsDialog = useStore((state) => state.showSettingsDialog)
  const loadSettings = useStore((state) => state.loadSettings)

  const client = useClient()

  React.useEffect(() => {
    if (client) {
      loadSettings(client)
    }
  }, [loadSettings, client])

  const handleStopPropagation = (e: React.MouseEvent) => {
    e.nativeEvent.stopImmediatePropagation()
    e.stopPropagation()
  }

  return (
    <AssetBrowserDispatchProvider onSelect={onSelect}>
      <PortalProvider element={document.body}>
        <ThemeProvider theme={studioTheme} scheme="light">
          <ToastProvider>
            {onClose ? (
              <Portal>
                <Box
                  onDragEnter={handleStopPropagation}
                  onDragLeave={handleStopPropagation}
                  onDragOver={handleStopPropagation}
                  onDrop={handleStopPropagation}
                  onMouseUp={handleStopPropagation}
                  ref={ref}
                  style={{
                    bottom: 0,
                    height: 'auto',
                    left: 0,
                    position: 'fixed',
                    top: 0,
                    width: '100%',
                    zIndex: 600000,
                  }}
                >
                  <GridImageBrowser onClose={onClose} />
                </Box>
              </Portal>
            ) : (
              <Flex direction="column" ref={ref}>
                <GridImageBrowser />
              </Flex>
            )}
            {showSettingsDialog ? <DialogSettings /> : null}
          </ToastProvider>
        </ThemeProvider>
      </PortalProvider>
    </AssetBrowserDispatchProvider>
  )
})
