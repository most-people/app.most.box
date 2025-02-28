import { Platform, StyleSheet, TouchableOpacity } from 'react-native'
import PageTabView from '@/components/PageTabView'
import { ThemeText, ThemeView } from '@/components/Theme'
import { router, useLocalSearchParams, useRootNavigationState } from 'expo-router'
import { useEffect, useRef } from 'react'
import { isAddress } from 'ethers'
import { useTopicStore } from '@/stores/topicStore'
import { useUserStore } from '@/stores/userStore'
import { Colors } from '@/constants/Colors'
import { Icon } from '@/assets/icon'
import { DialogPrompt } from '@/components/Dialog'

export default function ExploreScreen() {
  const { theme, dot } = useUserStore()
  const params = useLocalSearchParams()
  const rootNavigationState = useRootNavigationState()
  const createTopicRef = useRef<any>()

  const open = () => {
    createTopicRef.current.openModal()
  }

  useEffect(() => {
    // 确保 Root Layout 已挂载
    if (Platform.OS === 'web' && rootNavigationState?.key) {
      for (const address of Object.keys(params)) {
        if (isAddress(address)) {
          return router.replace({
            pathname: '/people/[address]',
            params: { address },
          })
        }
      }

      const hash = window.location.hash
      if (hash) {
        return router.replace({ pathname: '/topic/[topic]', params: { topic: hash.slice(1) } })
      }
    }
  }, [rootNavigationState?.key, params])

  const topics = [
    {
      name: '什么是去中心化',
      timestamp: 0,
    },
    {
      name: '星际文件系统',
      timestamp: 0,
    },
    {
      name: '用户反馈',
      timestamp: 0,
    },
  ]
  const { init, join } = useTopicStore()

  useEffect(() => {
    if (dot) init(dot)
  }, [dot, init])

  return (
    <PageTabView
      title="探索"
      rightContent={
        <TouchableOpacity onPress={open}>
          <Icon.Add width={20} height={20} fill={Colors[theme].text} />
        </TouchableOpacity>
      }
    >
      <ThemeView style={styles.titleContainer}>
        <ThemeText type="title">Explore</ThemeText>
      </ThemeView>
      <ThemeText>——聊天室，人人都可以发言</ThemeText>
      <TouchableOpacity onPress={open}>
        <ThemeText type="link">加入</ThemeText>
      </TouchableOpacity>
      <ThemeText>话题</ThemeText>
      {topics.map((item, i) => (
        <TouchableOpacity key={i} style={{ flex: 1 }} onPress={() => join(item.name)}>
          <ThemeText type="link">#{item.name}</ThemeText>
        </TouchableOpacity>
      ))}
      <DialogPrompt ref={createTopicRef} title="加入话题" onConfirm={join} />
    </PageTabView>
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
})
