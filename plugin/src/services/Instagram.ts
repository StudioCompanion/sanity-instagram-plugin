import axios, { AxiosError } from 'axios'
import { SanityClient } from '@sanity/client'

import { ErrorLog } from './Errors'

export interface InstagramMedia {
  caption?: string
  id?: string
  media_type?: string
  media_url?: string
  permalink?: string
}

export class Instagram {
  accessToken: string | null = null
  client: SanityClient

  constructor(client: SanityClient) {
    this.client = client
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
      dataArray.push(...data.data)

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
  getImages = async (): Promise<InstagramMedia[]> => {
    try {
      if (!this.accessToken) {
        throw new Error(
          ErrorLog.message(
            'No access token available, unable to fetch images, are you sure you are logged in?'
          )
        )
      }

      const url = new URL(Instagram.Endpoints.MyMedia)

      url.searchParams.set('access_token', this.accessToken)
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
