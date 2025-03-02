import { router, useLocalSearchParams } from 'expo-router'
import { StyleSheet, TouchableOpacity } from 'react-native'
import PageView from '@/components/PageView'
import { useUserStore } from '@/stores/userStore'
import mp from '@/constants/mp'
import { SvgXml } from 'react-native-svg'
import { ThemeText, ThemeView } from '@/components/Theme'
import { useCopy } from '@/hooks/useCopy'
import { useEffect, useState } from 'react'

export default function TopicPage() {
  const params = useLocalSearchParams()
  const copy = useCopy()
  const address = params.address as string
  const theme = useUserStore((state) => state.theme)
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
    <PageView title={username || mp.formatAddress(address)}>
      <SvgXml xml={mp.avatar(address)} style={styles.avatar} />
      <TouchableOpacity onPress={() => copy(address)}>
        <ThemeText style={styles.account}>地址：{address}</ThemeText>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => copy(public_key)}>
        <ThemeText style={styles.account}>公钥：{public_key}</ThemeText>
      </TouchableOpacity>

      <ThemeView>
        <ThemeText>联系我</ThemeText>
        <TouchableOpacity
          onPress={() => router.push({ pathname: '/chat/[address]', params: { address } })}
        >
          <ThemeText type="link">{username || mp.formatAddress(address)}</ThemeText>
        </TouchableOpacity>
      </ThemeView>
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
