import { type DotMethods, type DotClient, type MostWallet } from 'dot.most.box'
import { create } from 'zustand'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

export interface Topic {
  name: string
  timestamp: number
}

interface UserStore {
  wallet?: MostWallet
  dotClient: DotClient | null
  dot: DotMethods | null
  theme: 'light' | 'dark'
  exit: () => void
  topics: Topic[]
}

interface State extends UserStore {
  setItem: <K extends keyof State>(key: K, value: State[K]) => void
}

export const useUserStore = create<State>((set) => ({
  wallet: undefined,
  dotClient: null,
  dot: null,
  theme: 'dark', // 默认为深色
  topics: [],
  setItem: (key, value) => set((state) => ({ ...state, [key]: value })),
  exit() {
    AsyncStorage.clear()
    set({ wallet: undefined })
    router.push('/login')
  },
}))
