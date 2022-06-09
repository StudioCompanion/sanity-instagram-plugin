import * as React from 'react'
import styled from 'styled-components'

import { InstgaramAsset } from '../../services/Assets'
import { useAssetSourceActions } from '../../contexts/AssetSourceDispatchContext'

export const CardAsset = ({
  url,
  description,
  instagramPost,
  _id,
}: InstgaramAsset) => {
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

  return (
    <div onClick={handleAssetClick}>
      <Image src={url} />
      <p>{description}</p>
      {instagramPost ? (
        <a target="_blank" href={instagramPost} rel="noopenner noreferrer">
          view post
        </a>
      ) : null}
    </div>
  )
}

const Image = styled.img`
  display: block;
  width: 100%;
  object-fit: contain;
`
