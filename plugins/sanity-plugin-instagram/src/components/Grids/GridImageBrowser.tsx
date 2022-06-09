import * as React from 'react'
import { Grid } from '@sanity/ui'
import { useStore } from '../../store'
import { InstgaramAsset } from '../../services/Assets'
import { CardAsset } from '../Cards/CardAsset'
import styled from 'styled-components'

export const GridImageBrowser = () => {
  const [items, setItems] = React.useState<InstgaramAsset[]>([])

  const assetServices = useStore((state) => state.assetsService)

  React.useEffect(() => {
    /**
     * TODO: add loading // error states
     */
    assetServices.getAllInstagramAssets().then((items) => setItems(items))
  }, [assetServices])

  return (
    <BrowserGrid>
      {items.map((asset) => (
        <CardAsset key={asset._id} {...asset} />
      ))}
    </BrowserGrid>
  )
}

const BrowserGrid = styled(Grid)`
  grid-template-columns: repeat(6, 1fr);
  margin: 0 auto;
  grid-gap: 2rem;
`
