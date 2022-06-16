import * as React from 'react'
import { Button } from '@sanity/ui'

export const ButtonUploadInstagramImages = () => {
  return (
    <Button
      fontSize={[1, 1, 2]}
      tone="primary"
      padding={[2, 2, 3]}
      // onClick={handleClick}
      text={'Upload Instagram Images'}
      // style={{ pointerEvents: !isLoggedIn || isLoading ? 'none' : 'auto' }}
      // disabled={!isLoggedIn || isLoading}
    />
  )
}
