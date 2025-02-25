import { useEffect, useState, useMemo } from 'react'
import { useUserStore } from '@/stores/userStore'

export interface Message {
  text: string
  address: string
  timestamp: number
}

export const useChat = (topic: string) => {
  // const { wallet, gun } = useUserStore()
  // // 使用 useMemo 确保 chat 只初始化一次
  // const chat = useMemo(() => {
  //   if (gun) {
  //     return gun.get('most.box/topic/' + topic)
  //   }
  // }, [topic, gun])
  const [messages, setMessages] = useState<Message[]>([])

  // useEffect(() => {
  //   if (!chat) return
  //   const timestampSet = new Set()
  //   // 监听所有子节点的变化
  //   chat.map().on((data, key) => {
  //     if (timestampSet.has(key)) return
  //     if (data && key) {
  //       if (data.address && data.text) {
  //         if (!data.timestamp) {
  //           data.timestamp = Number(key)
  //         }
  //         if (!timestampSet.has(data.timestamp)) {
  //           timestampSet.add(String(data.timestamp))
  //           setMessages((list) => [...list, data])
  //         }
  //       } else {
  //         // chat.get(key).put(null)
  //       }
  //     }
  //   })

  //   // 清理监听器，防止内存泄漏
  //   return () => {
  //     chat.off()
  //   }
  // }, [chat])

  const send = (text: string) => {
    // if (wallet && chat) {
    //   const timestamp = Date.now()
    //   const newMessage = {
    //     text,
    //     address: wallet.address,
    //     timestamp,
    //   }
    //   // 使用唯一键存储消息
    //   chat.get(String(timestamp)).put(newMessage)
    // }
  }

  const del = (timestamp: number) => {
    // if (!chat) return
    // // 更新 Gun 数据库
    // chat.get(String(timestamp)).put(null)

    // 更新本地状态
    setMessages((prevMessages) => prevMessages.filter((msg) => msg.timestamp !== timestamp))
  }
  return { messages, send, del }
}
