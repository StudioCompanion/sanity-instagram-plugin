import * as React from 'react'
import { Card, Flex, Grid } from '@sanity/ui'
import styled from 'styled-components'

// import { CardAsset } from '../Cards/CardAsset'
import { Header } from '../Header'

interface GridImageBrowserProps {
  onClose?: () => void
}

export const GridImageBrowser = ({ onClose }: GridImageBrowserProps) => {
  // const [items, setItems] = React.useState<InstgaramAsset[]>([])

  // const assetServices = useStore((state) => state.assetsService)

  // React.useEffect(() => {
  //   /**
  //    * TODO: add loading // error states
  //    */
  //   assetServices.getAllInstagramAssets().then((items) => setItems(items))
  // }, [assetServices])

  return (
    <Card display="flex" height="fill">
      <Flex direction="column" flex={1}>
        <Header onClose={onClose} />
        <Flex flex={1}>
          <Flex
            align="flex-end"
            direction="column"
            flex={1}
            style={{ position: 'relative' }}
          >
            <BrowserGrid>
              {/* {items.map((asset) => (
                <CardAsset key={asset._id} {...asset} />
              ))} */}
            </BrowserGrid>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  )
}

const BrowserGrid = styled(Grid)`
  grid-template-columns: repeat(6, 1fr);
  margin: 0 auto;
  grid-gap: 2rem;
`
