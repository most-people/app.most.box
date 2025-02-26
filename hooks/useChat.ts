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
      const dotWallet = Dot.mostWallet('most.box#' + topic, '', 'I know loss mnemonic will lose my wallet.')
      const signer = HDNodeWallet.fromPhrase(dotWallet.mnemonic)
      const dot = dotClient.dot(dotWallet.address)
      dot.setSigner(signer)
      setChat(dot)

      dot.on(DotKey, (data: any) => {
        if (data) {
          setMessages(data)
        }
      })
      // 清理监听器，防止内存泄漏
      return () => {
        dot.off(DotKey)
      }
    }
  }, [topic, dotClient])

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
