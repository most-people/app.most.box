import { useState, useCallback } from 'react'
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
  const [error, setError] = useState('')
  const theme = useUserStore((state) => state.theme)
  const styles = createStyles(theme)

  const validateUrl = useCallback((value: string) => {
    try {
      new URL(value.trim())
      return true
    } catch {
      return false
    }
  }, [])

  const validateField = useCallback(
    (value: string) => {
      const trimmedValue = value.trim()
      if (!trimmedValue) return '请输入节点地址'
      if (!validateUrl(trimmedValue)) return '请输入有效的网址'
      return ''
    },
    [validateUrl],
  )

  const handleBlur = () => {
    const error = validateField(url)
    setError(error)
  }

  const handleConfirm = () => {
    const trimmedUrl = url.trim()
    const error = validateField(trimmedUrl)
    if (error) {
      setError(error)
      return
    }
    onConfirm({ url: trimmedUrl })
  }

  const handleUrlChange = (text: string) => {
    setUrl(text)
    setError('')
  }

  const isValid = useCallback(() => {
    return !error && url.trim() && validateUrl(url.trim())
  }, [error, url, validateUrl])

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <ThemeView style={styles.modalContent}>
          <ThemeText type="subtitle">添加节点</ThemeText>

          <View>
            <TextInput
              style={[styles.input, error ? styles.inputError : null]}
              placeholder="请输入节点地址"
              value={url}
              onChangeText={handleUrlChange}
              onBlur={handleBlur}
            />
            {error ? <ThemeText style={styles.errorText}>{error}</ThemeText> : null}
          </View>

          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.modalButton} onPress={onClose}>
              <ThemeText style={styles.buttonText}>取消</ThemeText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalButton,
                styles.confirmButton,
                !isValid() && styles.disabledButton,
              ]}
              onPress={handleConfirm}
              disabled={!isValid()}
            >
              <ThemeText style={[styles.buttonText, { color: '#000' }]}>确认</ThemeText>
            </TouchableOpacity>
          </View>
        </ThemeView>
      </View>
    </Modal>
  )
}

const createStyles = (theme: 'light' | 'dark') => {
  return StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: '90%',
      padding: 24,
      borderRadius: 16,
      gap: 20,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      backgroundColor: Colors[theme].background, // 添加主题背景色
    },
    input: {
      width: '100%',
      padding: 14,
      borderRadius: 10,
      fontSize: 16,
      borderWidth: 1.5,
      borderColor: Colors[theme].input.border,
      backgroundColor: Colors[theme].input.background,
      color: Colors[theme].text,
    },
    modalButton: {
      flex: 1,
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 10,
      alignItems: 'center',
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: Colors[theme].disabled,
    },
    confirmButton: {
      backgroundColor: Colors.success,
      borderWidth: 0,
    },
    buttonText: {
      fontSize: 16,
      color: Colors[theme].text,
    },
    buttonGroup: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 8,
    },
    inputError: {
      borderColor: Colors.error,
    },
    errorText: {
      color: Colors.error,
      fontSize: 12,
      marginTop: 4,
    },
    disabledButton: {
      opacity: 0.5,
    },
  })
}
