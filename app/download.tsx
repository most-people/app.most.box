import { StyleSheet } from 'react-native'
import { useUserStore } from '@/stores/userStore'
import { Colors } from '@/constants/Colors'
import PageView from '@/components/PageView'

export default function DownloadPage() {
  const theme = useUserStore((state) => state.theme)
  const styles = createStyles(theme)

  return <PageView title="下载"></PageView>
}

const createStyles = (theme: 'light' | 'dark') => {
  return StyleSheet.create({})
}
