import * as React from 'react'
import {
  ThemeProvider,
  ToastProvider,
  studioTheme,
  PortalProvider,
} from '@sanity/ui'
import { HOCRouter } from '@sanity/state-router'
import { withRouterHOC } from '@sanity/state-router/components'
import { AssetFromSource, AssetSourceComponentProps } from '@sanity/types'

import { useStore } from './store'

import { AssetBrowserDispatchProvider } from './contexts/AssetSourceDispatchContext'
import { IndexRoute } from './routes'
import { AuthorizationRoute } from './routes/authorize'

type InstagramAppProps = Omit<AssetSourceComponentProps, 'onSelect'> & {
  onSelect: (assetFromSource: AssetFromSource[]) => void
  router: HOCRouter
}

const InstagramApp = React.forwardRef<HTMLDivElement, InstagramAppProps>(
  ({ onClose, onSelect }, ref) => {
    const loadSettings = useStore((state) => state.loadSettings)

    React.useEffect(() => {
      loadSettings()
    }, [loadSettings])

    const currentRoute = window.location.pathname

    return (
      <AssetBrowserDispatchProvider onSelect={onSelect}>
        <PortalProvider element={document.body}>
          <ThemeProvider theme={studioTheme} scheme="light">
            <ToastProvider>
              {currentRoute === '/instagram/authorization' ? (
                <AuthorizationRoute />
              ) : (
                <IndexRoute ref={ref} onClose={onClose} />
              )}
            </ToastProvider>
          </ThemeProvider>
        </PortalProvider>
      </AssetBrowserDispatchProvider>
    )
  }
)

export const Instagram = withRouterHOC(InstagramApp)
