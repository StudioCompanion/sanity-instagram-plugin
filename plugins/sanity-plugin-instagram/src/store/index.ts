import create, { StateCreator } from 'zustand'
import { devtools } from 'zustand/middleware'
import { createSettingsState, SettingsState } from './settings'

export type UseStore = SettingsState

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
      ...createSettingsState(...args),
    }),
    {
      name: 'sanity-plugin-instagram',
    }
  )
)
