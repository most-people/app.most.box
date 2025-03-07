import React, { useState, forwardRef, useImperativeHandle } from 'react'
import { View, TextInput, Modal, StyleSheet, TouchableOpacity } from 'react-native'
import { AppHeader } from '../AppHeader'
import { Colors } from '@/constants/Colors'
import { ThemeText } from '@/components/Theme'
import { useUserStore } from '@/stores/userStore'

// 定义 props 类型
interface DialogPromptProps {
  title: string
  onConfirm: (inputText: string) => void // 完成回调
}

export const DialogPrompt = forwardRef(({ onConfirm, title }: DialogPromptProps, ref) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [inputText, setInputText] = useState('')
  const theme = useUserStore((state) => state.theme)
  const styles = createStyles(theme)

  // 暴露控制方法
  useImperativeHandle(ref, () => ({
    openModal: () => setModalVisible(true),
  }))

  // 完成按钮点击事件
  const confirm = () => {
    onConfirm(inputText) // 返回输入内容
    setInputText('')
    setModalVisible(false) // 关闭弹窗
  }

  return (
    <Modal
      animationType="slide"
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.container}>
        <AppHeader
          title={title}
          leftContent={
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <ThemeText style={styles.headerButton}>取消</ThemeText>
            </TouchableOpacity>
          }
          rightContent={
            <TouchableOpacity onPress={confirm}>
              <ThemeText style={styles.headerButton}>完成</ThemeText>
            </TouchableOpacity>
          }
        ></AppHeader>
        <View style={styles.content}>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            autoFocus
            maxLength={100}
            returnKeyType="go"
          />
        </View>
      </View>
    </Modal>
  )
})

// 设置组件名称
DialogPrompt.displayName = 'DialogPrompt'

const createStyles = (theme: 'light' | 'dark') => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[theme].background,
    },
    headerButton: {
      fontSize: 16,
    },
    content: {
      flex: 1,
      padding: 15,
    },
    input: {
      paddingLeft: 12,
      paddingRight: 12,
      fontSize: 16,
      height: 40,
      backgroundColor: Colors[theme].input.background,
      color: Colors[theme].text,
    },
  })
}
