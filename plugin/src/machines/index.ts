import { ToastContextValue } from '@sanity/ui'
import { createMachine, MachineConfig, StateSchema } from 'xstate'
import { send } from 'xstate/lib/actions'
import { AuthService } from '../services/Auth'

import {
  Settings,
  SettingsService,
  UpdateSettingsPayload,
} from '../services/Settings'

export interface MachineContext {
  settingsService: SettingsService
  authService: AuthService
  toast: ToastContextValue
  settings?: Settings
  isLoggedIn: boolean
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

export interface MachineSchema extends StateSchema {
  context: MachineContext
  states: {
    idle: object
    loggingOut: object
    showingSettings: {
      states: {
        idle: object
        saving: object
      }
    }
  }
}

const Chart: MachineConfig<MachineContext, MachineSchema, MachineEvents> = {
  id: 'instagram-plugin',
  initial: 'idle',
  context: {
    toast: null as unknown as ToastContextValue,
    authService: null as unknown as AuthService,
    settingsService: null as unknown as SettingsService,
    settings: undefined,
    isLoggedIn: false,
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
    },
  },
  states: {
    idle: {
      on: {
        SETTINGS_SHOW: 'showingSettings',
        LOGOUT: 'loggingOut',
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
  },
}

export const pluginMachine = createMachine(Chart, {
  actions: {},
  services: {},
  guards: {},
})
