import { StyleSheet, TouchableOpacity } from 'react-native'
import { useNoteStore } from '@/stores/noteStore'
import { ThemeText, ThemeView } from '@/components/Theme'
import PageTabView from '@/components/PageTabView'
import { Icon } from '@/assets/icon'
import { useToast } from 'expo-toast'
import { useUserStore } from '@/stores/userStore'
import dayjs from 'dayjs'
export default function NoteScreen() {
  const notes = useNoteStore((state) => state.notes)
  const theme = useUserStore((state) => state.theme)
  const toast = useToast()

  const upload = async () => {
    toast.show('写笔记，开发中...')
  }

  return (
    <PageTabView title="笔记">
      <ThemeText>今天</ThemeText>

      <TouchableOpacity
        style={{
          ...styles.camera,
          backgroundColor: theme === 'light' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.14)',
        }}
        onPress={upload}
      >
        <Icon.Camera
          style={styles.cameraIcon}
          fill={theme === 'light' ? 'rgba(0, 0, 0, 0.14)' : 'rgba(255, 255, 255, 0.14)'}
        />
      </TouchableOpacity>
      {notes
        .sort((a, b) => Number(b.updated_time) - Number(a.updated_time))
        .map((item) => (
          <ThemeView key={item.id}>
            <ThemeText>{dayjs(Number(item.updated_time)).fromNow()}</ThemeText>
            <ThemeText>{item.title}</ThemeText>
          </ThemeView>
        ))}
    </PageTabView>
  )
}

const styles = StyleSheet.create({
  camera: {
    cursor: 'pointer',
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIcon: { width: 40, height: 40 },
})
