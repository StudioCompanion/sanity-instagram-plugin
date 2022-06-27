import * as React from 'react'
import styled from 'styled-components'
import { Box, Flex, Text } from '@sanity/ui'
import { LaunchIcon } from '@sanity/icons'

import { useAssetSourceActions } from '../../contexts/AssetSourceDispatchContext'

import { imageDprUrl } from '../../helpers/images'

import { InstagramAsset } from '../../services/Assets'
import { format, parseISO } from 'date-fns'

export const CardAsset = React.memo((props: InstagramAsset) => {
  const { url, title, instagramPost, _id } = props
  const { onSelect } = useAssetSourceActions()

  if (!url) {
    return null
  }

  const handleAssetClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()

    if (onSelect && _id) {
      onSelect([
        {
          kind: 'assetDocumentId',
          value: _id,
        },
      ])
    }
  }

  const filename = title?.split('.jpg')[0] ?? ''

  return (
    <CardWrapper onClick={handleAssetClick}>
      <CardContainer direction="column">
        <Box flex={1}>
          <Image
            draggable={false}
            src={imageDprUrl(props, { height: 250, width: 250 })}
            style={{
              transition: 'opacity 1000ms',
            }}
          />
        </Box>
        <Box paddingY={3}>
          <AssetText size={1}>
            <span>{format(parseISO(filename), 'dd-MM-yyyy')}</span>
            {instagramPost ? (
              <Anchor
                target="_blank"
                href={instagramPost}
                rel="noopenner noreferrer"
              >
                View post <LaunchIcon />
              </Anchor>
            ) : null}
          </AssetText>
        </Box>
      </CardContainer>
    </CardWrapper>
  )
})

const CardWrapper = styled(Flex)`
  height: 100%;
  overflow: hidden;
  padding: 2px;
  position: relative;
  width: 100%;
`

const CardContainer = styled(Flex)`
  border: 1px solid transparent;
  height: 100%;
  position: relative;
  transition: all 300ms;
  user-select: none;
  width: 100%;
`

const Image = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
`

const AssetText = styled(Text)`
  & span {
    display: block;
  }
`

const Anchor = styled.a`
  padding-top: 8px;
  display: inline-flex;
  align-items: center;

  & > svg {
    margin-left: 2px !important;
  }
`
