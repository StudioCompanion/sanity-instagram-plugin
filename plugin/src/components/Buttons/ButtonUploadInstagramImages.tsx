import * as React from 'react'
import { Button } from '@sanity/ui'
import { useGlobalState } from '../../contexts/GlobalStateContext'
import { useSelector } from '@xstate/react'

export const ButtonUploadInstagramImages = () => {
  const globalState = useGlobalState()

  const isLoggedIn = useSelector(
    globalState,
    (state) => state.context.isLoggedIn
  )
  const isUploadingImages = useSelector(globalState, (state) =>
    state.matches('loadingImages')
  )

  const isDisabled = !isLoggedIn || isUploadingImages

  const handleClick = () => {
    globalState.send('LOAD_IMAGES')
  }

  return (
    <Button
      fontSize={[1, 1, 2]}
      tone="primary"
      padding={[2, 2, 3]}
      onClick={handleClick}
      text={'Import instagram images'}
      style={{
        cursor: isDisabled ? 'default' : 'pointer',
        pointerEvents: isDisabled ? 'none' : 'auto',
      }}
      disabled={isDisabled}
    />
  )
}
