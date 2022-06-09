import * as React from 'react'
import { Button } from '@sanity/ui'

import { useStore } from '../../store'
import { Asset } from '../../services/Assets'

export const ButtonUploadInstagramImages = () => {
  const [isLoading, setIsLoading] = React.useState(false)

  const isLoggedIn = useStore((state) => state.isLoggedIn)
  const Instagram = useStore((state) => state.instagramService)

  const handleClick = async () => {
    try {
      setIsLoading(true)
      const assetService = new Asset()
      await assetService.uploadInstagramAssets(Instagram)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      fontSize={[1, 1, 2]}
      tone="primary"
      padding={[2, 2, 3]}
      onClick={handleClick}
      text={'Upload Instagram Images'}
      style={{ pointerEvents: !isLoggedIn || isLoading ? 'none' : 'auto' }}
      disabled={!isLoggedIn || isLoading}
    />
  )
}
