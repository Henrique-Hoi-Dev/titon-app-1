import { PropsWithChildren, useCallback, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import config from '~/src/config'
import { useAuth, useProtectedRoute } from './auth'

export default function AppProvider({ children }: PropsWithChildren) {
  const { token, getUser, setToken } = useAuth()
  useProtectedRoute()

  const getToken = useCallback(async () => {
    return await AsyncStorage.getItem(`@${config.appName}_token`)
  }, [])

  useEffect(() => {
    async function load() {
      const asyncStorageToken = await getToken()
      if (
        (asyncStorageToken && !token) ||
        (asyncStorageToken && asyncStorageToken !== token)
      ) {
        setToken(asyncStorageToken)
        getUser(asyncStorageToken)
      }
    }

    load()
  }, [getToken, setToken, token])

  return children
}
