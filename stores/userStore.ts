import { type DotClient, type MostWallet } from 'dot.most.box'
import { create, StoreApi } from 'zustand'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

export interface Topic {
  name: string
  timestamp: number
}

interface UserStore {
  wallet?: MostWallet
  dotClient: DotClient | null
  theme: 'light' | 'dark'
  exit: () => void
  topics: Topic[]
}

interface State extends UserStore {
  setItem: <K extends keyof State>(key: K, value: State[K]) => void
  pushItem: <K extends keyof State>(
    key: K,
    value: State[K] extends any[] ? (State[K] extends (infer T)[] ? T : never) : never,
  ) => void
}

export const useUserStore = create<State>(
  (set: StoreApi<State>['setState'], get: StoreApi<State>['getState']) => ({
    wallet: undefined,
    dotClient: null,
    theme: 'dark', // 默认为深色
    exit() {
      AsyncStorage.clear()
      set({ wallet: undefined })
      router.push('/login')
    },
    topics: [],
    setItem: (key, value) => set((state) => ({ ...state, [key]: value })),
    pushItem: (key, value) =>
      set((state) => {
        const prev = state[key]
        if (!Array.isArray(prev)) {
          console.error(`${key} is not an array`)
          return state
        }
        return {
          ...state,
          [key]: [value, ...prev],
        }
      }),
  }),
)
