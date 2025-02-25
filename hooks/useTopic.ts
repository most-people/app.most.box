import { useEffect } from 'react'
import { useUserStore } from '@/stores/userStore'
import { router } from 'expo-router'
import mp from '@/constants/mp'

export interface Topic {
  name: string
  timestamp: number
}

export const useTopic = () => {
  const { topics, setItem, pushItem } = useUserStore()

  const init = async () => {
    // const res = await window.most.get('topics')
    // if (res.ok) {
    //   setItem('topics', res.data as Topic[])
    // } else {
    //   setItem('topics', [])
    // }
  }

  const join = (name: string) => {
    // if (pub) {
    //   // 检查是否已经存在，避免重复添加
    //   if (!topics.some((e) => e.name === name)) {
    //     const timestamp = Date.now()
    //     const data: Topic = { name, timestamp }
    //     // 使用唯一键存储消息
    //     // window.most.put('topics', mp.getHash(name), JSON.stringify(data)).then((res) => {
    //     //   if (res.ok) {
    //     //     pushItem('topics', data)
    //     //   }
    //     // })
    //   }
    // }
    router.push({ pathname: '/topic/[topic]', params: { topic: name } })
  }

  const quit = (name: string) => {
    // if (pub) {
    //   const topic = topics.find((e) => e.name === name)
    //   if (topic) {
    //     // 使用唯一键删除消息
    //     const key = mp.getHash(name)
    //     // window.most.del('topics', key).then((res) => {
    //     //   if (res.ok) {
    //     //     setItem(
    //     //       'topics',
    //     //       topics.filter((e) => mp.getHash(e.name) !== key),
    //     //     )
    //     //   }
    //     // })
    //   }
    // }
  }

  // useEffect(() => {
  //   if (pub) {
  //     init()
  //   } else {
  //     setItem('topics', [])
  //   }
  // }, [pub])

  return { join, quit }
}
