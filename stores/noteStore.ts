import { create } from 'zustand'
import api from '@/constants/Api'
import asyncStorage from '@/stores/asyncStorage'
import mp from '@/constants/mp'

export interface NoteAuthor {
  user_id: number
  password_hash: string
}
export interface Note {
  id: number
  title: string
  content: string
  updated_time: string
  user_id: number
  authors?: NoteAuthor[]
  address?: string
  openly?: boolean
  isEncrypt?: boolean
}

interface NoteStore {
  notes: Note[]
  authorsNotes: Note[]
  inited: boolean
  authorsInited: boolean
  init: () => Promise<void>
  fetch: () => Promise<void>
}

interface State extends NoteStore {
  setItem: <K extends keyof State>(key: K, value: State[K]) => void
}

export const useNoteStore = create<State>((set, get) => ({
  notes: [],
  authorsNotes: [],
  inited: false,
  authorsInited: false,
  setItem: (key, value) => set((state) => ({ ...state, [key]: value })),
  async fetch() {
    const res = await api({ method: 'post', url: '/db/get/Notes' })
    if (res.ok) {
      const list = res.data as Note[]
      set({ notes: list, inited: true })
      // save
      const KnowledgeCache = JSON.stringify(list)
      const KnowledgeHash = mp.getHash(KnowledgeCache)
      asyncStorage.setItem('KnowledgeCache', KnowledgeCache)
      asyncStorage.setItem('KnowledgeHash', KnowledgeHash)
    }
  },
  async init() {
    const list: Note[] | null = await asyncStorage.getItem('KnowledgeCache')
    if (list && list[0].id) {
      set({ notes: list, inited: true })
      const KnowledgeHash = await asyncStorage.getItem('KnowledgeHash')
      // 检查 KnowledgeHash
      const res = await api({
        url: '/db/check/hash/Notes',
        params: { hash: KnowledgeHash },
      })
      if (res.ok) {
        if (res.data === true) {
          console.log('知识库 数据一致')
        } else {
          console.log('知识库 数据不一致，正在更新')
          get().fetch()
        }
      }
    } else {
      get().fetch()
    }
  },
}))
