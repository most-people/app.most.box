import { useState, useCallback } from 'react'
import { StyleSheet, TouchableOpacity, Modal, TextInput, View } from 'react-native'
import { useUserStore } from '@/stores/userStore'
import { Colors } from '@/constants/Colors'
import { ThemeText, ThemeView } from '@/components/Theme'

export interface FormField {
  name: string
  label: string
  initialValue?: string
  validate?: (value: string) => string
  multiline?: boolean
  placeholder?: string
}

interface FormDialogProps {
  visible: boolean
  title: string
  fields: FormField[]
  onClose: () => void
  onConfirm: (values: Record<string, string>) => void
}

export const DialogForm = ({ visible, title, fields, onClose, onConfirm }: FormDialogProps) => {
  const theme = useUserStore((state) => state.theme)
  const styles = createStyles(theme)

  const initialValues = Object.fromEntries(
    fields.map((field) => [field.name, field.initialValue || '']),
  )
  const [values, setValues] = useState<Record<string, string>>(initialValues)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateField = useCallback(
    (name: string, value: string) => {
      const field = fields.find((f) => f.name === name)
      return field?.validate?.(value.trim()) || ''
    },
    [fields],
  )

  const handleBlur = (name: string) => {
    const error = validateField(name, values[name])
    setErrors((prev) => ({ ...prev, [name]: error }))
  }

  const isValid = useCallback(() => {
    return (
      Object.values(errors).every((error) => !error) &&
      Object.values(values).every((value) => value.trim())
    )
  }, [errors, values])

  const handleConfirm = () => {
    const newErrors = Object.fromEntries(
      fields.map((field) => [field.name, validateField(field.name, values[field.name])]),
    )

    if (Object.values(newErrors).some((error) => error)) {
      setErrors(newErrors)
      return
    }

    onConfirm(values)
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <ThemeView style={styles.modalContent}>
          <ThemeText type="subtitle">{title}</ThemeText>

          {fields.map((field) => (
            <View key={field.name}>
              <TextInput
                style={[
                  styles.input,
                  field.multiline && styles.multilineInput,
                  errors[field.name] && styles.inputError,
                ]}
                placeholder={field.placeholder || `请输入${field.label}`}
                value={values[field.name]}
                onChangeText={(text) => {
                  setValues((prev) => ({ ...prev, [field.name]: text }))
                  setErrors((prev) => ({ ...prev, [field.name]: '' }))
                }}
                onBlur={() => handleBlur(field.name)}
                multiline={field.multiline}
                numberOfLines={field.multiline ? 4 : undefined}
              />
              {errors[field.name] && (
                <ThemeText style={styles.errorText}>{errors[field.name]}</ThemeText>
              )}
            </View>
          ))}

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
