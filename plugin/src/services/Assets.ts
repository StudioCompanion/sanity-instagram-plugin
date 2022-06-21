import groq from 'groq'
import pThrottle from 'p-throttle'
import type { SanityClient } from '@sanity/client'

import { ErrorLevels, ErrorLog } from './Errors'
import { InstagramService, InstagramMedia } from './Instagram'

export interface InstgaramAsset {
  _id: string | null
  description: string | null
  name: string | null
  instagramId: string | null
  instagramPost: string | null
  url: string | null
}

export class AssetsService extends InstagramService {
  protected client: SanityClient

  constructor(client: SanityClient) {
    super()

    this.client = client
  }

  private uploadAsset = async (fullSizeBlob: Blob, media: InstagramMedia) => {
    try {
      const doc = await this.client.assets.upload('image', fullSizeBlob, {
        extract: ['blurhash', 'exif', 'location', 'lqip', 'palette'],
        contentType: 'image/png',
        filename: `instagram-${media.id}.png`,
        description: media.caption,
        source: {
          id: media.id ?? '',
          name: `instagram`,
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

  // getAllInstagramAssets = async (): Promise<InstgaramAsset[]> => {
  //   try {
  //     const instagramAssetQuery = groq`
  //   *[_type == 'sanity.imageAsset' && opt.instagram == true][]{
  //       _id,
  //       description,
  //       "name": source.name,
  //       "instagramId": source.id,
  //       "instagramPost": source.url,
  //       url,
  //   }
  // `
  //     const items = await this.client.fetch<InstgaramAsset[]>(
  //       instagramAssetQuery
  //     )

  //     return items
  //   } catch (err) {
  //     new ErrorLog('failed to fetch instagram assets', ErrorLevels.Error)

  //     return []
  //   }
  // }

  pruneInstagramAssets = async (
    images: InstagramMedia[]
  ): Promise<InstagramMedia[]> => {
    const currentlyStoredImagesQuery = groq`
    *[_type == "sanity.imageAsset" && opt.instagram == true][].source.id
  `

    const existingImages = await this.client.fetch<string[]>(
      currentlyStoredImagesQuery
    )

    interface InstagramAssetsWithIds extends Omit<InstagramMedia, 'id'> {
      id: string
    }

    return (
      images.filter(
        (img) => typeof img.id === 'string'
      ) as InstagramAssetsWithIds[]
    ).filter((img) => !existingImages.includes(img.id))
  }

  private createFullSizeBlobs = async (
    images: HTMLImageElement[]
  ): Promise<Blob[]> => {
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

    /**
     * Create the blobs
     */
    const maybeBlobs = await Promise.all(
      images.map(
        (img) =>
          new Promise<Blob | null>((res) => {
            {
              setCanvasDimensions(img)
              ctx.drawImage(img, 0, 0, img.width, img.height)

              canvas.toBlob(res, 'image/jpeg')
            }
          })
      )
    )

    canvas.remove()

    return maybeBlobs.filter((blob) => Boolean(blob)) as Blob[]
  }

  private createBlobs = async (
    images: InstagramMedia[]
  ): Promise<[fullSizeBlobs: Blob[]]> => {
    const imgElements = await Promise.all(
      images.map(
        (asset) =>
          new Promise<HTMLImageElement>((res) => {
            if (!asset.media_url) {
              return
            }

            const img = new Image()
            img.crossOrigin = 'anonymous'
            img.onload = () => res(img)
            img.src = asset.media_url
          })
      )
    )

    const fullSizeBlobs = await this.createFullSizeBlobs(imgElements)

    return [fullSizeBlobs]
  }

  uploadInstagramAssets = async (images: InstagramMedia[]) => {
    const throttle = pThrottle({
      limit: 20,
      interval: 1000,
    })

    const [fullSizeBlobs] = await this.createBlobs(images)

    /**
     * Upload the assets throttled
     */
    await Promise.all(
      fullSizeBlobs.map((blob, index) =>
        throttle(async () => {
          await this.uploadAsset(blob, images[index])
        })()
      )
    )
  }
}
