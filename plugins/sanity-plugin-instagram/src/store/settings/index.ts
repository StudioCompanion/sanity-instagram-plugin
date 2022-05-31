import type { CreateSlice } from '../index'

import {
  CreateOrUpdateSettings,
  createOrUpdateSettings,
} from './createOrUpdateSettings'
import { loadSettings, LoadSettings } from './loadSettings'

export interface Settings {
  clientId?: string
  redirectUrl?: string
  clientSecret?: string
  token?: string
}

export interface SettingsState {
  /**
   * @default false
   */
  showSettingsDialog: boolean
  setShowSettingsDialog: (
    setState: (isCurrentlyShowing: boolean) => boolean
  ) => void
  createOrUpdateSettings: CreateOrUpdateSettings
  settings: Settings | null
  loadSettings: LoadSettings
}

export type SettingsSlice<TReturn = SettingsState> = CreateSlice<
  SettingsState,
  TReturn
>

export const createSettingsState: SettingsSlice<SettingsState> = (...args) => {
  const [set] = args
  return {
    showSettingsDialog: false,
    setShowSettingsDialog: (setState) =>
      set((state) => ({
        showSettingsDialog: setState(state.showSettingsDialog),
      })),
    createOrUpdateSettings,
    settings: null,
    loadSettings: loadSettings(...args),
  }
}
