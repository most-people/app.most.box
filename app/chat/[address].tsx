import { useEffect, useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { StyleSheet, TouchableOpacity } from 'react-native'
import PageView from '@/components/PageView'
import { useUserStore } from '@/stores/userStore'
import mp from '@/constants/mp'
import { SvgXml } from 'react-native-svg'
import { ThemeText, ThemeView } from '@/components/Theme'
import { useCopy } from '@/hooks/useCopy'

export default function TopicPage() {
  const params = useLocalSearchParams()
  const copy = useCopy()
  const address = params.address as string
  const theme = useUserStore((state) => state.theme)
  const wallet = useUserStore((state) => state.wallet)
  const dotClient = useUserStore((state) => state.dotClient)
  const styles = createStyles(theme)

  const [username, serUsername] = useState('')
  const [public_key, serPublic_key] = useState('')

  useEffect(() => {
    if (address && dotClient) {
      const dot = dotClient.dot(address)
      let t = 0
      dot.on('mine', (profile, timestamp) => {
        if (timestamp > t) {
          t = timestamp
          if (profile?.username) {
            serUsername(profile.username)
            serPublic_key(profile.public_key)
          }
        }
      })

      return () => {
        dot.off('mine')
      }
    }
  }, [address, dotClient])

  return (
    <PageView title="单线联系">
      <TouchableOpacity onPress={() => copy(address)}>
        <ThemeText style={styles.account}>联系地址：{username}</ThemeText>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => copy(wallet?.address)}>
        <ThemeText style={styles.account}>我的地址：{wallet?.username}</ThemeText>
      </TouchableOpacity>
    </PageView>
  )
}

const createStyles = (theme: 'light' | 'dark') => {
  return StyleSheet.create({
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 10,
    },
    account: {
      color: '#888',
    },
  })
}
