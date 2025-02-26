import { router } from 'expo-router'
import { create } from 'zustand'

export interface Topic {
  name: string
  timestamp: number
}

interface TopicStore {
  inited: boolean
  topics: Topic[]
  join: (topic: string) => void
  quit: (topic: string) => void
}

interface State extends TopicStore {
  setItem: <K extends keyof State>(key: K, value: State[K]) => void
  pushItem: <K extends keyof State>(
    key: K,
    value: State[K] extends any[] ? (State[K] extends (infer T)[] ? T : never) : never,
  ) => void
}

export const useTopicStore = create<State>((set, get) => ({
  inited: false,
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
  join(topic: string) {
    // 检查是否已经存在，避免重复添加
    console.log('🌊', topic, get().topics)

    // if (!topics.some((e) => e.name === name)) {
    //   const timestamp = Date.now()
    //   const data: Topic = { name, timestamp }
    //   // 使用唯一键存储消息
    //   // window.most.put('topics', mp.getHash(name), JSON.stringify(data)).then((res) => {
    //   //   if (res.ok) {
    //   //     pushItem('topics', data)
    //   //   }
    //   // })
    // }
    router.push({ pathname: '/topic/[topic]', params: { topic } })
  },
  quit(topic: string) {},
}))
