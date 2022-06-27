import * as React from 'react'
import { hues } from '@sanity/color'
import { Box, Card, Flex } from '@sanity/ui'
import styled from 'styled-components'
import { useSelector } from '@xstate/react'
import { VirtuosoGrid } from 'react-virtuoso'

import { CardAsset } from '../Cards/CardAsset'
import { Header } from '../Header'

import { useGlobalState } from '../../contexts/GlobalStateContext'

interface GridImageBrowserProps {
  onClose?: () => void
}

const CARD_HEIGHT = 320
const CARD_WIDTH = 320

export const GridImageBrowser = ({ onClose }: GridImageBrowserProps) => {
  const globalState = useGlobalState()
  const images = useSelector(globalState, (state) => state.context.images)

  const handleLoadMore = () => {
    globalState.send('FETCH_MORE_ASSETS')
  }

  return (
    <Card display="flex" height="fill">
      <Flex direction="column" flex={1}>
        <Header onClose={onClose} />
        <GridContainer flex={1} style={{ width: '100%', maxHeight: '100%' }}>
          <VirtuosoGrid
            computeItemKey={(index) => images[index]._id ?? ''}
            components={{
              Item: ItemContainer,
              List: ListContainer,
            }}
            endReached={handleLoadMore}
            itemContent={(index) => <CardAsset {...images[index]} />}
            overscan={48}
            totalCount={images.length}
          />
        </GridContainer>
      </Flex>
    </Card>
  )
}

const GridContainer = styled(Box)`
  padding: 12px 0;
  border-top: 1px solid ${hues.gray?.[900].hex};
`

const ItemContainer = styled.div`
  height: ${CARD_HEIGHT}px;
  /* width: ${CARD_WIDTH}px; */
`

const ListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(${CARD_WIDTH}px, 1fr));
  grid-gap: 12px;
  justify-content: center;
  margin: 0 auto;
  padding-left: 24px;
  padding-right: 24px;
`
