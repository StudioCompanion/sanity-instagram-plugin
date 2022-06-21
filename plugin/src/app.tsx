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
import { useSelector } from '@xstate/react'

import { DialogSettings } from './components/Dialogs/DialogSettings'
import { GridImageBrowser } from './components/Grids/GridImageBrowser'

import { AssetBrowserDispatchProvider } from './contexts/AssetSourceDispatchContext'
import {
  GlobalStateProvider,
  useGlobalState,
} from './contexts/GlobalStateContext'
import { ImageLoadingOverlay } from './components/Overlays/ImageLoadingOverlay'

interface AppProps extends Omit<AssetSourceComponentProps, 'onSelect'> {
  onSelect: (assetFromSource: AssetFromSource[]) => void
}

const App = React.forwardRef<HTMLDivElement, AppProps>(({ onClose }, ref) => {
  const globalState = useGlobalState()

  const showSettings = useSelector(globalState, (state) =>
    state.matches('showingSettings')
  )

  const isUploadingImages = useSelector(globalState, (state) =>
    state.matches('loadingImages')
  )

  const handleStopPropagation = (e: React.MouseEvent) => {
    e.nativeEvent.stopImmediatePropagation()
    e.stopPropagation()
  }

  return (
    <>
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
      {showSettings ? <DialogSettings /> : null}
      {isUploadingImages ? <ImageLoadingOverlay /> : null}
    </>
  )
})

export const InstagramApp = React.forwardRef<HTMLDivElement, AppProps>(
  (props, ref) => (
    <AssetBrowserDispatchProvider onSelect={props.onSelect}>
      <PortalProvider element={document.body}>
        <ThemeProvider theme={studioTheme} scheme="light">
          <ToastProvider>
            <GlobalStateProvider>
              <App ref={ref} {...props} />
            </GlobalStateProvider>
          </ToastProvider>
        </ThemeProvider>
      </PortalProvider>
    </AssetBrowserDispatchProvider>
  )
)
