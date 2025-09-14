import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useRouter, useSegments } from 'expo-router'
import Api from '../services/api'
import AsyncStorage from '@react-native-async-storage/async-storage'
import config from '../config'
import { OneSignal, UserChangedState } from 'react-native-onesignal'
import { Platform } from 'react-native'

export type User = {
  cpf: string
  credit: number
  daily: number
  id: number
  name: string
  number_cnh: string | null
  percentage: number | null
  valid_cnh: boolean | null
  value_fix: number
}

export type AuthResponse = {
  data: {
    token: string
  }
}

export type ProfileResponse = {
  data: User
}

export type AuthContextType = {
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  getUser: (token: string) => Promise<void>
  user?: User
  token?: string
  setToken: (token: string) => void
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider(props: PropsWithChildren) {
  const [user, setUser] = useState<User>()
  const [token, setToken] = useState<string>()
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()

  const handleProfile = useCallback(async (token?: string | null) => {
    setLoading(true)
    try {
      const response = await Api.get<ProfileResponse>('/v1/driver/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.status === 401) {
        throw new Error('Unauthorized', {
          cause: { status: 401 },
        })
      }

      if (response.status !== 200) {
        throw new Error('Invalid credentials')
      }

      if (response.data?.data) {
        setUser(response.data.data)
      }
    } catch (error) {
      if (error instanceof Error && error.cause?.status === 401) {
        handleSignOut()
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSignIn = useCallback(async (email: string, password: string) => {
    setLoading(true)
    try {
      const response = await Api.post<AuthResponse>('/v1/driver/signin', {
        cpf: email,
        password,
      })

      if (response.status !== 200) {
        throw new Error('Invalid credentials')
      }

      if (response.data?.data) {
        const {
          data: { token },
        } = response.data as unknown as AuthResponse

        setToken(token)
        handleProfile(token)
      }
    } catch (error) {
      setLoading(false)
    }
  }, [])

  const handleSignOut = useCallback(async () => {
    await AsyncStorage.removeItem(`@${config.appName}_token`)
    setToken(undefined)
    setUser(undefined)
    // router.replace('/sign-in')
  }, [router])

  useEffect(() => {
    const bootstrapAsync = async () => {
      if (!token) {
        return await AsyncStorage.removeItem(`@${config.appName}_token`)
      }

      const asyncStorageToken = await AsyncStorage.getItem(
        `@${config.appName}_token`,
      )

      if (
        (asyncStorageToken && asyncStorageToken !== token) ||
        !asyncStorageToken
      ) {
        await AsyncStorage.setItem(`@${config.appName}_token`, token)
      }
      if (asyncStorageToken) {
        handleProfile(asyncStorageToken)
      }
    }

    bootstrapAsync()
  }, [token])

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      OneSignal.initialize(config.oneSignalAppId[Platform.OS])
      OneSignal.Notifications.requestPermission(true)
    }

    const listener = (event: UserChangedState) => {
      if (event.current.onesignalId) {
        Api.patch('/v1/driver/activate/push-receive-notifications', {
          player_id: event.current.onesignalId,
        })
      }
    }

    OneSignal.User.addEventListener('change', listener)

    return () => {
      OneSignal.User.removeEventListener('change', listener)
    }
  }, [user])

  return (
    <AuthContext.Provider
      value={{
        loading,
        signIn: handleSignIn,
        signOut: handleSignOut,
        getUser: handleProfile,
        user,
        token,
        setToken,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}

export function useProtectedRoute() {
  const { user } = useAuth()
  const segments = useSegments()
  const router = useRouter()

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)'

    if (user && inAuthGroup) {
      router.replace('/home')
    }
  }, [user, segments, router])
}
