import { useEffect, useState } from 'react'
import Dot, { type DotMethods } from 'dot.most.box'
import { useUserStore } from '@/stores/userStore'
import { HDNodeWallet } from 'ethers'

export interface Message {
  text: string
  address: string
  timestamp: number
}

const DotKey = 'messages'

export const useChat = (topic: string) => {
  const { wallet, dotClient } = useUserStore()

  const [chat, setChat] = useState<DotMethods | null>(null)
  const [messages, setMessages] = useState<Message[]>([])

  // 使用 useEffect 确保 chat 只初始化一次
  useEffect(() => {
    if (topic && dotClient) {
      const dotWallet = Dot.mostWallet(topic, '', 'I know loss mnemonic will lose my wallet.')
      const signer = HDNodeWallet.fromPhrase(dotWallet.mnemonic)
      dotClient.setSigner(signer)
      const dot = dotClient.dot(dotWallet.address)
      setChat(dot)
      const callback = (data: any) => {
        if (data) {
          setMessages(data)
        }
      }
      dot.on(DotKey, callback)
      // 清理监听器，防止内存泄漏
      return () => {
        dot.off(`${dotWallet.address}/${DotKey}`, callback)
      }
    }
  }, [topic, dotClient])

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
    if (wallet && chat) {
      const timestamp = Date.now()
      const newMessage = {
        text,
        address: wallet.address,
        timestamp,
      }
      // 更新数据
      chat.put(DotKey, [newMessage, ...messages])
    }
  }

  const del = (timestamp: number) => {
    if (wallet && chat) {
      // 更新数据
      chat.put(DotKey, messages.filter((item) => item.timestamp !== timestamp))
    }
  }
  return { messages, send, del }
}
