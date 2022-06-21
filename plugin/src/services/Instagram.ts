import axios, { AxiosError } from 'axios'

export interface InstagramMedia {
  caption?: string
  id?: string
  media_type?: 'VIDEO' | 'IMAGE'
  media_url?: string
  permalink?: string
}

export interface InstagramLongLifeToken {
  access_token: string
  token_type: 'bearer'
  expires_in: number
}

export class InstagramService {
  refreshLongLifeToken = async (accessToken: string) => {
    const { data } = await axios.get<Partial<InstagramLongLifeToken>>(
      `${InstagramService.Endpoints.RefreshLongLife}?grant_type=ig_refresh_token&access_token=${accessToken}`
    )

    if (data.access_token && typeof data.access_token === 'string') {
      return data.access_token
    } else {
      return ''
    }
  }

  private recursivelyFetchImagesFromInstagram = async (
    url: string,
    dataArray: InstagramMedia[]
  ) => {
    try {
      const { data } = await axios.get<{
        data: InstagramMedia[]
        paging: {
          next?: string
          previous?: string
        }
      }>(url)
      /**
       * TODO: I should be able to upload videos...?
       */
      dataArray.push(
        ...data.data.filter((datum) => datum.media_type !== 'VIDEO')
      )

      if (data.paging.next) {
        await this.recursivelyFetchImagesFromInstagram(
          data.paging.next,
          dataArray
        )
      }
    } catch (err) {
      console.error((err as AxiosError).response?.data)
      return
    }
  }

  /**
   * Requires accessToken to have already been set before it will work.
   *
   * TODO: should cross reference the images we already have so we can
   * stop to avoid overfetching and therefore avoid the overhead of
   * creating the blob and uploading it in our Assets service
   */
  getImages = async (accessToken: string): Promise<InstagramMedia[]> => {
    try {
      const url = new URL(InstagramService.Endpoints.MyMedia)

      url.searchParams.set('access_token', accessToken)
      url.searchParams.set('limit', '25')
      url.searchParams.set(
        'fields',
        'caption,id,media_type,media_url,permalink,thumbnail_url'
      )

      const imageData: InstagramMedia[] = []

      await this.recursivelyFetchImagesFromInstagram(url.toString(), imageData)

      return imageData
    } catch (err) {
      console.error(err)

      return []
    }
  }

  static Endpoints = {
    Authorize: 'https://api.instagram.com/oauth/authorize',
    RefreshLongLife: 'https://graph.instagram.com/refresh_access_token',
    MyMedia: 'https://graph.instagram.com/me/media',
  }
}
