import { router } from 'expo-router'
import PageTabView from '@/components/PageTabView'
import { TouchableOpacity, View } from 'react-native'
import { Icon } from '@/assets/icon'
import { Colors } from '@/constants/Colors'
import { ThemeText } from '@/components/Theme'
import { useEffect, useRef } from 'react'
import { DialogPrompt } from '@/components/Dialog'
import { useTopicStore, type Topic } from '@/stores/topicStore'
import { useUserStore } from '@/stores/userStore'

export default function ChatScreen() {
  const theme = useUserStore((state) => state.theme)
  const dot = useUserStore((state) => state.dot)

  const topics = useTopicStore((state) => state.topics)
  const quit = useTopicStore((state) => state.quit)
  const join = useTopicStore((state) => state.join)
  const init = useTopicStore((state) => state.init)

  const createTopicRef = useRef<any>()
  const open = () => {
    createTopicRef.current.openModal()
  }

  useEffect(() => {
    if (dot) init(dot)
  }, [dot, init])

  const TopicItem = ({ item }: { item: Topic }) => (
    <View style={{ flexDirection: 'row', gap: '10%', justifyContent: 'space-between' }}>
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() => router.push({ pathname: '/topic/[topic]', params: { topic: item.name } })}
      >
        <ThemeText type="link">#{item.name}</ThemeText>
      </TouchableOpacity>
      {item.timestamp !== 0 && (
        <TouchableOpacity onPress={() => quit(item.name)}>
          <Icon.Exit style={{ width: 20, height: 20 }} fill={Colors[theme].border} />
        </TouchableOpacity>
      )}
    </View>
  )

  return (
    <PageTabView
      title="聊天"
      rightContent={
        <TouchableOpacity onPress={open}>
          <Icon.Add width={20} height={20} fill={Colors[theme].text} />
        </TouchableOpacity>
      }
    >
      {topics.length === 0 ? (
        <>
          <ThemeText>没有关注的话题？</ThemeText>
          <TouchableOpacity onPress={() => router.push('/')}>
            <ThemeText type="link">去探索</ThemeText>
          </TouchableOpacity>
        </>
      ) : (
        <ThemeText>话题</ThemeText>
      )}
      {topics.map((item, i) => (
        <TopicItem key={i} item={item} />
      ))}
      <DialogPrompt ref={createTopicRef} title="加入话题" onConfirm={join} />
    </PageTabView>
  )
}
