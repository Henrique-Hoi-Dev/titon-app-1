import 'react-native-get-random-values'
import { Stack } from 'expo-router'
import { PortalHost, PortalProvider } from '@gorhom/portal'
import { AuthProvider } from '~/src/context/auth'
import { BottomTab } from '~/src/components/Layout'
import { ColorSchemeProvider } from '~/src/context/colorSchema'
import AppProvider from '~/src/context/app'
import AvisoOffline from '~/src/components/AvisoOffline'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '~/src/services/client'
import Toast, { BaseToast } from 'react-native-toast-message'
import { FeedbackProvider } from '~/src/context/feedback'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import RelativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
require('dayjs/locale/pt-br')

dayjs.locale('pt-br')
dayjs.extend(RelativeTime)

export default function Layout() {
  const insets = useSafeAreaInsets()

  return (
    <ColorSchemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <PortalProvider>
            <AppProvider>
              <FeedbackProvider>
                <Stack
                  screenOptions={{
                    headerShown: false,
                  }}
                />
                <PortalHost name="portalHost" />
                <BottomTab />
                <AvisoOffline />
              </FeedbackProvider>
            </AppProvider>
          </PortalProvider>
          <Toast
            topOffset={20 + insets.top}
            position="top"
            config={{
              error: (props) => (
                <BaseToast
                  style={{ borderLeftColor: '#EF4444' }}
                  text2NumberOfLines={3}
                  {...props}
                />
              ),
            }}
          />
        </AuthProvider>
      </QueryClientProvider>
    </ColorSchemeProvider>
  )
}
