import { useState, useCallback } from 'react'
import { StyleSheet, TouchableOpacity, Modal, TextInput, View } from 'react-native'
import { useUserStore } from '@/stores/userStore'
import { Colors } from '@/constants/Colors'
import { ThemeText, ThemeView } from '@/components/Theme'
import { type AppInfo } from '@/constants/Contract'

interface UpdateDialogProps {
  visible: boolean
  onClose: () => void
  onConfirm: (values: { version: string; downloadUrl: string; content: string }) => void
  defaultValues: AppInfo | null
}

export const UpdateDialog = ({ visible, onClose, onConfirm, defaultValues }: UpdateDialogProps) => {
  const [version, setVersion] = useState(defaultValues?.version || '')
  const [downloadUrl, setDownloadUrl] = useState(defaultValues?.downloadUrl || '')
  const [content, setContent] = useState(defaultValues?.updateContent || '')
  const [errors, setErrors] = useState({ version: '', downloadUrl: '', content: '' })
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

  const handleConfirm = () => {
    const trimmedVersion = version.trim()
    const trimmedUrl = downloadUrl.trim()
    const trimmedContent = content.trim()
    const newErrors = { version: '', downloadUrl: '', content: '' }

    if (!trimmedVersion) newErrors.version = '请输入版本号'
    if (!trimmedUrl) newErrors.downloadUrl = '请输入下载链接'
    if (!validateUrl(trimmedUrl)) newErrors.downloadUrl = '请输入有效的下载链接'
    if (!trimmedContent) newErrors.content = '请输入更新内容'

    if (Object.values(newErrors).some((error) => error)) {
      setErrors(newErrors)
      return
    }

    onConfirm({
      version: trimmedVersion,
      downloadUrl: trimmedUrl,
      content: trimmedContent,
    })
  }

  const clearError = (field: keyof typeof errors) => {
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const validateField = useCallback(
    (field: string, value: string) => {
      const trimmedValue = value.trim()
      switch (field) {
        case 'version':
          if (!trimmedValue) return '请输入版本号'
          // 验证版本号格式 x.x.x
          if (!/^\d+\.\d+\.\d+$/.test(trimmedValue)) {
            return '版本号必须为 x.x.x'
          }
          return ''
        case 'downloadUrl':
          if (!trimmedValue) return '请输入下载链接'
          return validateUrl(trimmedValue) ? '' : '请输入有效的下载链接'
        case 'content':
          return trimmedValue ? '' : '请输入更新内容'
        default:
          return ''
      }
    },
    [validateUrl],
  )

  const handleBlur = (field: keyof typeof errors) => {
    const value = field === 'version' ? version : field === 'downloadUrl' ? downloadUrl : content
    const error = validateField(field, value)
    setErrors((prev) => ({ ...prev, [field]: error }))
  }

  const isValid = useCallback(() => {
    return (
      !errors.version &&
      !errors.downloadUrl &&
      !errors.content &&
      version.trim() &&
      downloadUrl.trim() &&
      content.trim()
    )
  }, [errors, version, downloadUrl, content])

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <ThemeView style={styles.modalContent}>
          <ThemeText type="subtitle">更新应用信息</ThemeText>

          <View>
            <TextInput
              style={[styles.input, errors.version ? styles.inputError : null]}
              placeholder="请输入版本号"
              value={version}
              onChangeText={(text) => {
                setVersion(text)
                clearError('version')
              }}
              onBlur={() => handleBlur('version')}
            />
            {errors.version ? (
              <ThemeText style={styles.errorText}>{errors.version}</ThemeText>
            ) : null}
          </View>

          <View>
            <TextInput
              style={[styles.input, errors.downloadUrl ? styles.inputError : null]}
              placeholder="请输入下载链接"
              value={downloadUrl}
              onChangeText={(text) => {
                setDownloadUrl(text)
                clearError('downloadUrl')
              }}
              onBlur={() => handleBlur('downloadUrl')}
            />
            {errors.downloadUrl ? (
              <ThemeText style={styles.errorText}>{errors.downloadUrl}</ThemeText>
            ) : null}
          </View>

          <View>
            <TextInput
              style={[
                styles.input,
                styles.multilineInput,
                errors.content ? styles.inputError : null,
              ]}
              placeholder="请输入更新内容"
              value={content}
              onChangeText={(text) => {
                setContent(text)
                clearError('content')
              }}
              onBlur={() => handleBlur('content')}
              multiline
              numberOfLines={4}
            />
            {errors.content ? (
              <ThemeText style={styles.errorText}>{errors.content}</ThemeText>
            ) : null}
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
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // 修改为半透明黑色遮罩
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: '90%',
      padding: 24, // 增加内边距
      borderRadius: 16, // 增加圆角
      gap: 20, // 增加间距
      shadowColor: '#000', // 添加阴影效果
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
      padding: 14, // 增加输入框内边距
      borderRadius: 10,
      fontSize: 16,
      borderWidth: 1.5, // 增加边框宽度
      borderColor: Colors[theme].input.border,
      backgroundColor: Colors[theme].input.background,
      color: Colors[theme].text,
    },
    modalButton: {
      flex: 1,
      paddingVertical: 14, // 增加按钮高度
      paddingHorizontal: 16,
      borderRadius: 10,
      alignItems: 'center',
      backgroundColor: 'transparent', // 取消按钮使用透明背景
      borderWidth: 1,
      borderColor: Colors[theme].disabled,
    },
    confirmButton: {
      backgroundColor: Colors.success,
      borderWidth: 0, // 确认按钮不需要边框
    },
    buttonText: {
      fontSize: 16,
      color: Colors[theme].text,
    },
    multilineInput: {
      height: 120, // 增加多行输入框高度
      textAlignVertical: 'top',
      paddingTop: 14, // 确保文本从顶部开始
    },
    buttonGroup: {
      flexDirection: 'row',
      gap: 12, // 增加按钮间距
      marginTop: 8, // 添加顶部间距
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
