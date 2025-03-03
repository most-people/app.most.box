// [topic].tsx
import { useLocalSearchParams } from 'expo-router'
import { useTopic } from '@/hooks/useTopic'
import ChatView from '@/components/ChatView'

export default function TopicPage() {
  const params = useLocalSearchParams()
  const topicName = params.topic as string
  const topic = useTopic(topicName)

  // 消息按时间戳排序
  const messages = topic.messages.sort((a, b) => a.timestamp - b.timestamp)

  return (
    <ChatView
      title={topicName}
      messages={messages}
      onSend={(text) => topic.send(text)}
      onDelete={(timestamp) => topic.del(timestamp)}
    />
  )
}
