import { ToastContextValue } from '@sanity/ui'
import { createMachine, MachineConfig, StateSchema } from 'xstate'
import { send } from 'xstate/lib/actions'

import { AssetsService, InstagramAsset } from '../services/Assets'
import { AuthService } from '../services/Auth'
import { InstagramMedia } from '../services/Instagram'

import {
  Settings,
  SettingsService,
  UpdateSettingsPayload,
} from '../services/Settings'

export interface MachineContext {
  settingsService: SettingsService
  authService: AuthService
  assetService: AssetsService
  toast: ToastContextValue
  settings?: Settings
  isLoggedIn: boolean
  images: InstagramAsset[]
  pageIndex: number
  pageSize: number
}

export type MachineEvents =
  | { type: 'SETTINGS_SHOW' }
  | { type: 'LOGIN' }
  | {
      type: 'SETTINGS_SAVING'
      payload: UpdateSettingsPayload
    }
  | { type: 'SETTINGS_FAILED' }
  | { type: 'SETTINGS_IDLE' }
  | { type: 'SETTINGS_HIDE' }
  | { type: 'LOGOUT' }
  | { type: 'LOGGED_OUT' }
  | { type: 'LOAD_IMAGES' }
  | { type: 'IMAGES_UPLOADED' }
  | { type: 'IMAGES_PRUNED'; images: InstagramMedia[] }
  | { type: 'IMAGES_COLLECTED'; images: InstagramMedia[] }
  | { type: 'FETCH_ASSETS' }
  | { type: 'FETCH_MORE_ASSETS' }

export interface MachineSchema extends StateSchema {
  context: MachineContext
  states: {
    idle: object
    loggingOut: object
    fetchMoreAssets: object
    showingSettings: {
      states: {
        idle: object
        saving: object
      }
    }
    loadingImages: {
      states: {
        fetch: object
        collecting: object
        pruning: object
        uploading: object
      }
    }
  }
}

const Chart: MachineConfig<MachineContext, MachineSchema, MachineEvents> = {
  id: 'instagram-plugin',
  initial: 'idle',
  context: {
    toast: null as unknown as ToastContextValue,
    assetService: null as unknown as AssetsService,
    authService: null as unknown as AuthService,
    settingsService: null as unknown as SettingsService,
    settings: undefined,
    isLoggedIn: false,
    images: [],
    pageIndex: 0,
    pageSize: 50,
  },
  invoke: {
    id: 'start-up',
    src: async (ctx) => {
      const accessToken = await ctx.authService.getAccessToken()

      if (accessToken) {
        ctx.isLoggedIn = true
      }

      const res = await ctx.settingsService.getSettings()
      ctx.settings = res

      // await ctx.assetService.deleteAllAssets()

      const images = await ctx.assetService.getInstagramAssets(
        ctx.pageIndex,
        ctx.pageSize
      )

      ctx.images = [...images]
    },
  },
  states: {
    idle: {
      on: {
        SETTINGS_SHOW: 'showingSettings',
        LOGOUT: 'loggingOut',
        LOAD_IMAGES: 'loadingImages',
        FETCH_MORE_ASSETS: 'fetchMoreAssets',
      },
    },
    loggingOut: {
      on: {
        LOGGED_OUT: 'idle',
      },
      invoke: {
        id: 'logout',
        src: async (ctx) => {
          await ctx.authService.logout()
        },
        onDone: {
          actions: [
            send((ctx) => {
              ctx.toast.push({
                closable: true,
                status: 'success',
                title: 'Logged out',
              })

              ctx.isLoggedIn = false

              return {
                type: 'LOGGED_OUT',
              }
            }),
          ],
        },
      },
    },
    showingSettings: {
      initial: 'idle',
      states: {
        idle: {
          on: {
            SETTINGS_SAVING: {
              target: 'saving',
            },
          },
        },
        saving: {
          on: {
            SETTINGS_FAILED: {
              target: 'idle',
            },
          },
          invoke: {
            id: 'save-settings',
            src: async (ctx, event) => {
              if (event.type === 'SETTINGS_SAVING') {
                await ctx.settingsService.updateSettings(event.payload)
              }
            },
            onDone: {
              actions: [
                send((ctx) => {
                  ctx.toast.push({
                    closable: true,
                    status: 'success',
                    title: 'Saved settings successfully',
                  })

                  ctx.settingsService
                    .getSettings()
                    .then((settings) => (ctx.settings = settings))

                  return {
                    type: 'SETTINGS_HIDE',
                  }
                }),
              ],
            },
            onError: {
              actions: [
                send((ctx) => {
                  ctx.toast.push({
                    closable: true,
                    status: 'error',
                    title: 'Failed to save settings',
                  })

                  return {
                    type: 'SETTINGS_FAILED',
                  }
                }),
              ],
            },
          },
        },
      },
      on: {
        SETTINGS_HIDE: 'idle',
      },
    },
    loadingImages: {
      on: {
        IMAGES_UPLOADED: 'idle',
      },
      initial: 'collecting',
      states: {
        fetch: {
          invoke: {
            id: 'fetch-insta-assets-from-sanity',
            src: async (ctx) => {
              ctx.pageIndex = 0

              const images = await ctx.assetService.getInstagramAssets(
                0,
                ctx.pageSize
              )

              ctx.images = images
            },
            onDone: {
              actions: [
                send({
                  type: 'IMAGES_UPLOADED',
                }),
              ],
            },
          },
        },
        collecting: {
          on: {
            IMAGES_COLLECTED: {
              target: 'pruning',
            },
          },
          invoke: {
            id: 'load-instagram-images',
            src: (ctx) => async (callback) => {
              const accessToken = await ctx.authService.getAccessToken()
              let images: InstagramMedia[] = []
              if (accessToken) {
                images = await ctx.assetService.getImages(accessToken)
              }

              callback({
                type: 'IMAGES_COLLECTED',
                images,
              })
            },
            onError: {
              actions: [
                send((ctx) => {
                  ctx.toast.push({
                    closable: true,
                    status: 'error',
                    title: 'Failed to collect images from instagram',
                  })

                  return {
                    type: 'IMAGES_UPLOADED',
                  }
                }),
              ],
            },
          },
        },
        pruning: {
          on: {
            IMAGES_PRUNED: {
              target: 'uploading',
            },
          },
          invoke: {
            id: 'prune-instagram-images',
            src: (ctx, event) => async (callback) => {
              if (event.type === 'IMAGES_COLLECTED') {
                const { images } = event

                const prunedImages =
                  await ctx.assetService.pruneInstagramAssets(images)

                callback({
                  type: 'IMAGES_PRUNED',
                  images: prunedImages,
                })
              }
            },
            onError: {
              actions: [
                send((ctx) => {
                  ctx.toast.push({
                    closable: true,
                    status: 'error',
                    title: 'Failed to prune images from instagram',
                  })

                  return {
                    type: 'IMAGES_UPLOADED',
                  }
                }),
              ],
            },
          },
        },
        uploading: {
          on: {
            FETCH_ASSETS: 'fetch',
          },
          invoke: {
            id: 'upload-instagram-images',
            src: async (ctx, event) => {
              if (event.type === 'IMAGES_PRUNED') {
                await ctx.assetService.uploadInstagramAssets(event.images)
              }
            },
            onDone: {
              actions: [
                send((ctx) => {
                  ctx.toast.push({
                    closable: true,
                    status: 'success',
                    title: 'Uploaded instagram images to Sanity',
                  })

                  return {
                    type: 'FETCH_ASSETS',
                  }
                }),
              ],
            },
            onError: {
              actions: [
                send((ctx) => {
                  ctx.toast.push({
                    closable: true,
                    status: 'error',
                    title:
                      'Failed to upload images from instagram, please try again.',
                  })

                  return {
                    type: 'IMAGES_UPLOADED',
                  }
                }),
              ],
            },
          },
        },
      },
    },
    fetchMoreAssets: {
      invoke: {
        id: 'fetch-more-assets',
        src: async (ctx) => {
          const newPage = ctx.pageIndex + 1

          const images = await ctx.assetService.getInstagramAssets(
            newPage,
            ctx.pageSize
          )

          ctx.pageIndex = newPage
          ctx.images = [...ctx.images, ...images]
        },
      },
      onDone: {
        target: 'idle',
      },
    },
  },
}

export const pluginMachine = createMachine(Chart)
