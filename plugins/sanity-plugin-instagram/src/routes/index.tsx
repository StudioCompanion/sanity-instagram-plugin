import { AssetSourceComponentProps } from '@sanity/types/dist/dts'
import { Box, Flex, Portal } from '@sanity/ui'
import * as React from 'react'
import { DialogSettings } from '../components/Dialogs/DialogSettings'
import { GridImageBrowser } from '../components/Grids/GridImageBrowser'

import { useStore } from '../store'

type IndexRouteProps = Pick<AssetSourceComponentProps, 'onClose'>

export const IndexRoute = React.forwardRef<HTMLDivElement, IndexRouteProps>(
  ({ onClose }, ref) => {
    const showSettingsDialog = useStore((state) => state.showSettingsDialog)

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
        {showSettingsDialog ? <DialogSettings /> : null}
      </>
    )
  }
)
