import { create, StoreApi } from 'zustand'

interface TopicStore {
  inited: boolean
}

interface State extends TopicStore {
  setItem: <K extends keyof State>(key: K, value: State[K]) => void
}


export const useTopicStore = create<State>((set: StoreApi<State>['setState']) => ({
  inited: false,
  setItem: (key, value) => set((state) => ({ ...state, [key]: value })),
}))

