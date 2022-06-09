import * as React from 'react'
import { Card } from '@sanity/ui'
import styled from 'styled-components'
import { InstgaramAsset } from '../../services/Assets'

export const CardAsset = ({
  url,
  description,
  instagramPost,
}: InstgaramAsset) => {
  if (!url) {
    return null
  }
  return (
    <div>
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
