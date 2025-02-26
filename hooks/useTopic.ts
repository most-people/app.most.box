import { useEffect, useState } from 'react'
import { useUserStore } from '@/stores/userStore'
import { useTopicStore } from '@/stores/topicStore'
import { router } from 'expo-router'
import mp from '@/constants/mp'

export interface Topic {
  name: string
  timestamp: number
}

export const useTopic = () => {
  const { wallet, dotClient } = useUserStore()
  const { inited, topics } = useTopicStore()
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

  // 使用 useEffect 确保 chat 只初始化一次
  useEffect(() => {
    if (inited) return
    if (wallet && dotClient) {
      // const dotWallet = Dot.mostWallet('most.box#' + topic, '', 'I know loss mnemonic will lose my wallet.')
      // const signer = HDNodeWallet.fromPhrase(dotWallet.mnemonic)
      // dotClient.setSigner(signer)
      // const dot = dotClient.dot(dotWallet.address)
      // setChat(dot)
      // dot.on(DotKey, (data: any) => {
      //   if (data) {
      //     setMessages(data)
      //   }
      // })
      // // 清理监听器，防止内存泄漏
      // return () => {
      //   dot.off(DotKey)
      // }
    }
  }, [wallet, dotClient, inited])

  return { join, quit }
}
