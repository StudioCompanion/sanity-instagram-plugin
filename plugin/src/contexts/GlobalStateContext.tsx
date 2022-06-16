import React, { ReactNode, createContext, useContext } from 'react'
import { InterpreterFrom } from 'xstate'
import { useInterpret } from '@xstate/react'

import { pluginMachine } from '../machines'
import { SettingsService } from '../services/Settings'
import { useClient } from 'sanity'
import { useToast } from '@sanity/ui'

type GlobalStateContext = InterpreterFrom<typeof pluginMachine>

type Props = {
  children: ReactNode
}

const GlobalStateContext = createContext<GlobalStateContext | undefined>(
  undefined
)

export const GlobalStateProvider = (props: Props) => {
  const { children } = props
  const client = useClient()
  const toast = useToast()

  const globalService = useInterpret(
    pluginMachine.withContext({
      toast,
      settingsService: new SettingsService(client),
    })
  )

  return (
    <GlobalStateContext.Provider value={globalService}>
      {children}
    </GlobalStateContext.Provider>
  )
}

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext)
  if (context === undefined) {
    throw new Error('useGlobalState must be used within an GlobalStateProvider')
  }
  return context
}
