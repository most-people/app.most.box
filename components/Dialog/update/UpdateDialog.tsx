import { useState } from 'react'
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
  const theme = useUserStore((state) => state.theme)
  const styles = createStyles(theme)

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <ThemeView style={styles.modalContent}>
          <ThemeText type="subtitle">更新应用信息</ThemeText>

          <TextInput
            style={styles.input}
            placeholder="请输入版本号"
            value={version}
            onChangeText={setVersion}
            // placeholderTextColor={Colors[theme].text.secondary}
          />

          <TextInput
            style={styles.input}
            placeholder="请输入下载链接"
            value={downloadUrl}
            onChangeText={setDownloadUrl}
            // placeholderTextColor={Colors[theme].text.secondary}
          />

          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="请输入更新内容"
            value={content}
            onChangeText={setContent}
            multiline
            numberOfLines={4}
            // placeholderTextColor={Colors[theme].text.secondary}
          />

          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.modalButton} onPress={onClose}>
              <ThemeText style={styles.buttonText}>取消</ThemeText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.confirmButton]}
              onPress={() => onConfirm({ version, downloadUrl, content })}
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
  })
}
