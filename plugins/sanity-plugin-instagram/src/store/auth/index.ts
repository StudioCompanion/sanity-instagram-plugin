import { Instagram } from '../../services/Instagram'
import type { CreateSlice } from '../index'

export interface AuthState {
  isLoggedIn: boolean
  setIsLoggedIn: (loggedIn: boolean) => void
  instagramService: Instagram
}

export type AuthSlice<TReturn = AuthState> = CreateSlice<AuthState, TReturn>

export const createAuthState: AuthSlice = (...args) => {
  const [set] = args

  const InstagramService = new Instagram()

  Promise.resolve(InstagramService.shouldUserBeLoggedIn()).then((bool) =>
    set({
      isLoggedIn: bool,
    })
  )

  return {
    instagramService: InstagramService,
    isLoggedIn: false,
    setIsLoggedIn: (loggedIn) =>
      set({
        isLoggedIn: loggedIn,
      }),
  }
}
