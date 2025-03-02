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
  const styles = createStyles(theme)
  return <PageView title={mp.formatAddress(address)}></PageView>
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
