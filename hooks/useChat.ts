import { startTransition, useEffect, useState } from 'react'
import { type DotMethods, mostEncode, mostDecode } from 'dot.most.box'
import { useUserStore } from '@/stores/userStore'

export interface Message {
  text: string
  address: string
  timestamp: number
}

interface You {
  address: string
  username: string
  public_key: string
}

export const useChat = (address: string) => {
  const wallet = useUserStore((state) => state.wallet)
  const dotClient = useUserStore((state) => state.dotClient)
  const dot = useUserStore((state) => state.dot)

  const [myMessages, setMyMessages] = useState<Message[]>([])
  const [youMessages, setYouMessages] = useState<Message[]>([])

  const messages = [...myMessages, ...youMessages]

  const [you, setYou] = useState<You | null>(null)
  const [youDot, setYouDot] = useState<DotMethods | null>(null)

  useEffect(() => {
    if (dot && you && youDot && wallet) {
      // 监听消息
      let t = 0
      dot.on(you.address, (data, timestamp) => {
        if (timestamp > t) {
          t = timestamp
          // 检查数据
          try {
            data = JSON.parse(mostDecode(data, you.public_key, wallet.private_key))
            if (Array.isArray(data) && data.every((item) => typeof item?.timestamp === 'number')) {
              startTransition(() => setMyMessages(data))
            }
          } catch (error) {
            console.error('Error parsing JSON:', error)
          }
        }
      })

      // 判断是否是自己
      if (you.address !== wallet.address) {
        let t = 0
        youDot.on(wallet.address, (data, timestamp) => {
          if (timestamp > t) {
            t = timestamp
            // 检查数据
            try {
              data = JSON.parse(mostDecode(data, you.public_key, wallet.private_key))
              if (
                Array.isArray(data) &&
                data.every((item) => typeof item?.timestamp === 'number')
              ) {
                startTransition(() => setYouMessages(data))
              }
            } catch (error) {
              console.error('Error parsing JSON:', error)
            }
          }
        })
      }

      // 清理监听器，防止内存泄漏
      return () => {
        dot.off(you.address)
        youDot.off(wallet.address)
      }
    }
  }, [dot, you, youDot, wallet])

  useEffect(() => {
    if (address && dotClient) {
      const youDot = dotClient.dot(address)
      setYouDot(youDot)
      let t = 0
      youDot.on('info', (info, timestamp) => {
        if (timestamp > t) {
          t = timestamp
          const username = info?.username
          const public_key = info?.public_key
          if (username && public_key) {
            // 成功获取，停止监听
            youDot.off('info')
            setYou({ address, username, public_key })
          }
        }
      })

      return () => {
        youDot.off('info')
      }
    }
  }, [address, dotClient])

  const send = (text: string) => {
    if (wallet && dot && you) {
      const timestamp = Date.now()
      const newMessage = {
        text,
        address: wallet.address,
        timestamp,
      }
      // 更新数据
      const data = JSON.stringify([...myMessages, newMessage])
      dot.put(address, mostEncode(data, you.public_key, wallet.private_key))
    }
  }

  const del = (timestamp: number) => {
    if (wallet && dot && you) {
      // 更新数据
      const data = JSON.stringify(myMessages.filter((item) => item.timestamp !== timestamp))
      dot.put(address, mostEncode(data, you.public_key, wallet.private_key))
    }
  }

  return { messages, send, del }
}
