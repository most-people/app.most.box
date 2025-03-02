import React, { useCallback } from 'react'
import 'react-native-reanimated'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import { ToastProvider } from 'expo-toast'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { useUserStore } from '@/stores/userStore'
import { useColorScheme } from 'react-native'
import { Colors } from '@/constants/Colors'
import Nodes from '@/assets/json/nodes.json'
import { DotClient, type MostWallet } from 'dot.most.box'
import mp from '@/constants/mp'
import asyncStorage from '@/stores/asyncStorage'
import { HDNodeWallet } from 'ethers'
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const systemTheme = useColorScheme() ?? 'dark'
  const theme = useUserStore((state) => state.theme)
  const setItem = useUserStore((state) => state.setItem)
  const wallet = useUserStore((state) => state.wallet)
  const dotClient = useUserStore((state) => state.dotClient)

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  })

  useEffect(() => {
    // 跟随系统主题
    setItem('theme', systemTheme)
  }, [systemTheme, setItem])

  const initWallet = useCallback(async () => {
    const token = await asyncStorage.getItem('token')
    const tokenSecret = await asyncStorage.getItem('tokenSecret')
    if (token && tokenSecret) {
      const wallet = mp.verifyJWT(token, tokenSecret) as MostWallet | null
      if (wallet) {
        setItem('wallet', wallet)
      }
    }
  }, [setItem])

  const initDot = useCallback(() => {
    setItem('dotClient', new DotClient(Nodes))
  }, [setItem])

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
      initWallet()
      initDot()
    }
  }, [initDot, initWallet, loaded])

  useEffect(() => {
    if (wallet?.mnemonic && dotClient) {
      const signer = HDNodeWallet.fromPhrase(wallet.mnemonic)
      const dot = dotClient.dot(wallet.address)
      dot.setSigner(signer)
      dot.setPubKey(wallet.public_key)
      dot.setPrivKey(wallet.private_key)
      setItem('dot', dot)
      dot.put('info', {
        username: wallet.username,
        public_key: wallet.public_key,
      })
    }
  }, [setItem, wallet, dotClient])

  if (!loaded) {
    return null
  }

  const light = { ...DefaultTheme, colors: Colors.light }
  const dark = { ...DarkTheme, colors: Colors.dark }

  return (
    <ThemeProvider value={theme === 'light' ? light : dark}>
      <ToastProvider>
        <Stack screenOptions={{ headerShown: false, headerTitleAlign: 'center' }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ToastProvider>
    </ThemeProvider>
  )
}
