import { Platform, StyleSheet, TouchableOpacity } from 'react-native'
import PageTabView from '@/components/PageTabView'
import { ThemeText, ThemeView } from '@/components/Theme'
import { router, useLocalSearchParams, useRootNavigationState } from 'expo-router'
import { useEffect } from 'react'
import { isAddress } from 'ethers'
import { useTopicStore } from '@/stores/topicStore'
export default function ExploreScreen() {
  const params = useLocalSearchParams()
  const rootNavigationState = useRootNavigationState()
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
  const topicStore = useTopicStore()
  return (
    <PageTabView title="探索">
      <ThemeView style={styles.titleContainer}>
        <ThemeText type="title">Explore</ThemeText>
      </ThemeView>
      <ThemeText>——开发中，之后会根据关注人数排序</ThemeText>
      <ThemeText>话题</ThemeText>
      {topics.map((item, i) => (
        <ThemeView
          key={i}
          style={{ flexDirection: 'row', gap: '10%', justifyContent: 'space-between' }}
        >
          <TouchableOpacity style={{ flex: 1 }} onPress={() => topicStore.join(item.name)}>
            <ThemeText type="link">#{item.name}</ThemeText>
          </TouchableOpacity>
        </ThemeView>
      ))}
    </PageTabView>
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
})
