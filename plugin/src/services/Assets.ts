import groq from 'groq'
import type { SanityClient } from '@sanity/client'

import { ErrorLevels, ErrorLog } from './Errors'
import { Instagram, InstagramMedia } from './Instagram'

export interface InstgaramAsset {
  _id: string | null
  description: string | null
  name: string | null
  instagramId: string | null
  instagramPost: string | null
  url: string | null
}

export class Asset {
  client: SanityClient

  constructor(client: SanityClient) {
    this.client = client
  }

  /**
   * TODO: this needs throttling
   * Also they are done out of order if we use some metadata
   * from instagram maybe we can solve how to put them in
   * the correct order of newest post to oldest post
   */
  private uploadAsset = async (blob: Blob, media: InstagramMedia) => {
    try {
      const doc = await this.client.assets.upload('image', blob, {
        extract: ['blurhash', 'exif', 'location', 'lqip', 'palette'],
        tag: 'instagram',
        contentType: 'image/png',
        filename: `instagram-${media.id}.png`,
        description: media.caption,
        source: {
          id: media.id ?? '',
          name: `instagram-${media.id}`,
          url: media.permalink ?? '',
        },
      })
      await this.client
        .patch(doc._id)
        .setIfMissing({ opt: {} })
        .setIfMissing({ 'opt.instagram': true })
        .commit()
    } catch (err) {
      new ErrorLog('failed to upload asset', ErrorLevels.Error)
    } finally {
      return
    }
  }

  getAllInstagramAssets = async (): Promise<InstgaramAsset[]> => {
    try {
      const instagramAssetQuery = groq`
    *[_type == 'sanity.imageAsset' && opt.instagram == true][]{
        _id,
        description,
        "name": source.name,
        "instagramId": source.id,
        "instagramPost": source.url,
        url,
    }
  `
      const items = await this.client.fetch<InstgaramAsset[]>(
        instagramAssetQuery
      )

      return items
    } catch (err) {
      new ErrorLog('failed to fetch instagram assets', ErrorLevels.Error)

      return []
    }
  }

  uploadInstagramAssets = async (InstaService: Instagram) => {
    try {
      const images = await InstaService.getImages()

      /**
       * Create canvas
       */
      const canvas = document.createElement('canvas')

      const setCanvasDimensions = (img: HTMLImageElement) => {
        canvas.style.height = `${img.height}px`
        canvas.style.width = `${img.width}px`
        canvas.height = img.height
        canvas.width = img.width
      }

      /**
       * Get the context
       */
      const ctx = canvas.getContext('2d')!

      await Promise.all(
        images.map(
          (media) =>
            new Promise((res) => {
              {
                if (!media.media_url) {
                  return
                }
                const img = new Image()
                img.crossOrigin = 'anonymous'
                img.src = media.media_url
                img.onload = () => {
                  setCanvasDimensions(img)
                  ctx.drawImage(img, 0, 0, img.width, img.height)

                  canvas.toBlob(async (blob) => {
                    if (blob) {
                      await this.uploadAsset(blob, media)
                    }

                    res(true)
                  })
                }
              }
            })
        )
      )

      canvas.remove()
    } catch (err) {}
  }
}
