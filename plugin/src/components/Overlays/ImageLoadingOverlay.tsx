import { Box, Dialog, Heading, Spinner } from '@sanity/ui'
import { useSelector } from '@xstate/react'
import * as React from 'react'
import styled from 'styled-components'

import { useGlobalState } from '../../contexts/GlobalStateContext'

export const ImageLoadingOverlay = () => {
  const globalState = useGlobalState()

  const isPruningImages = useSelector(globalState, (state) =>
    state.matches('loadingImages.pruning')
  )
  const isUploadingImages = useSelector(globalState, (state) =>
    state.matches('loadingImages.uploading')
  )

  return (
    <Overlay>
      <Dialog id="image-loading" width={1}>
        <DialogBox paddingX={2} paddingY={7} display="flex">
          <Spinner size={4} />
          <Box paddingTop={6}>
            <Heading>
              {!isPruningImages && !isUploadingImages
                ? `Getting images from instagram...`
                : isPruningImages
                ? 'Pruning images from instagram'
                : `Uploading instagram images to Sanity`}
            </Heading>
          </Box>
        </DialogBox>
      </Dialog>
    </Overlay>
  )
}

const Overlay = styled.div`
  background-color: rgba(0, 0, 0, 0.8);
  position: absolute;
  inset: 0;
`

const DialogBox = styled(Box)`
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
