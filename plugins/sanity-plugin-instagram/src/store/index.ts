import create, { StateCreator } from 'zustand'
import { devtools } from 'zustand/middleware'
import { Asset } from '../services/Assets'
import { AuthState, createAuthState } from './auth'
import { createSettingsState, SettingsState } from './settings'

export type UseStore = SettingsState &
  AuthState & {
    assetsService: Asset
  }

export type CreateSlice<TState extends object, TReturn = TState> = StateCreator<
  TState,
  [['zustand/devtools', never]],
  [],
  TReturn
>

/**
 * NOTE: you **must** curry this function on
 * init – https://github.com/pmndrs/zustand/blob/main/docs/typescript.md#basic-usage
 */
export const useStore = create<UseStore, [['zustand/devtools', never]]>(
  devtools(
    (...args) => ({
      ...createAuthState(...args),
      ...createSettingsState(...args),
      assetsService: new Asset(),
    }),
    {
      name: 'sanity-plugin-instagram',
    }
  )
)
