import { useLocalSearchParams } from 'expo-router'
import { useChat } from '@/hooks/useChat'
import { useUserStore } from '@/stores/userStore'
import ChatView from '@/components/ChatView'

export default function AddressPage() {
  const params = useLocalSearchParams()
  const address = params.address as string
  const topic = useChat(address)
  const wallet = useUserStore((state) => state.wallet)

  // 消息按时间戳排序
  const messages = topic.messages.sort((a, b) => a.timestamp - b.timestamp)

  // 根据是否是自己的地址决定标题
  const title = wallet?.address === address ? '文件传输助手' : '单线联系'

  return (
    <ChatView
      title={title}
      messages={messages}
      onSend={(text) => topic.send(text)}
      onDelete={(timestamp) => topic.del(timestamp)}
    />
  )
}
