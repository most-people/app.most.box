import { useState } from 'react'
import { StyleSheet, TouchableOpacity, Modal, TextInput, View } from 'react-native'
import { useUserStore } from '@/stores/userStore'
import { Colors } from '@/constants/Colors'
import { ThemeText, ThemeView } from '@/components/Theme'

interface AddNodeDialogProps {
  visible: boolean
  onClose: () => void
  onConfirm: (values: { url: string }) => void
}

export const AddNodeDialog = ({ visible, onClose, onConfirm }: AddNodeDialogProps) => {
  const [url, setUrl] = useState('')
  const theme = useUserStore((state) => state.theme)
  const styles = createStyles(theme)

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <ThemeView style={styles.modalContent}>
          <ThemeText type="subtitle">添加节点</ThemeText>

          <TextInput
            style={styles.input}
            placeholder="请输入节点地址"
            value={url}
            onChangeText={setUrl}
            // placeholderTextColor={Colors[theme].text.secondary}
          />

          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.modalButton} onPress={onClose}>
              <ThemeText style={styles.buttonText}>取消</ThemeText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.confirmButton]}
              onPress={() => onConfirm({ url })}
            >
              <ThemeText style={styles.buttonText}>确认</ThemeText>
            </TouchableOpacity>
          </View>
        </ThemeView>
      </View>
    </Modal>
  )
}

const createStyles = (theme: 'light' | 'dark') => {
  return StyleSheet.create({
    input: {
      width: '100%',
      padding: 12,
      borderRadius: 8,
      fontSize: 16,
      borderWidth: 1,
      borderColor: Colors[theme].input.border,
      backgroundColor: Colors[theme].input.background,
      color: Colors[theme].text,
    },
    modalButton: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: 'center',
      backgroundColor: Colors[theme].disabled,
    },
    confirmButton: {
      backgroundColor: Colors.success,
    },
    buttonText: {
      fontSize: 16,
      color: Colors[theme].text,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgb(247, 126, 126)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: '90%',
      padding: 20,
      borderRadius: 12,
      gap: 16,
    },
    buttonGroup: {
      flexDirection: 'row',
      gap: 10,
    },
  })
}
