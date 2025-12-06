import { DefaultTheme, ThemeProvider } from '@react-navigation/native'
import * as NavigationBar from 'expo-navigation-bar'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import 'react-native-reanimated'

import { useColorScheme } from '@/hooks/use-color-scheme'
import './global.css'
export default function RootLayout() {
  const colorScheme = useColorScheme()
  useEffect(() => {
    NavigationBar.setBackgroundColorAsync('#000000')
    NavigationBar.setButtonStyleAsync('light')
  }, [])
  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen name="login/index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: 'modal', title: 'Modal' }}
        />
      </Stack>

      <StatusBar style="auto" />
    </ThemeProvider>
  )
}
