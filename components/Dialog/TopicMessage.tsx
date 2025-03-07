import React from 'react'
import { View, Modal, TouchableOpacity, StyleSheet } from 'react-native'
import { ThemeText } from '@/components/Theme'
import { useUserStore } from '@/stores/userStore'
import { Colors } from '@/constants/Colors'
import { type Message } from '@/hooks/useChat'
import dayjs from 'dayjs'

interface Props {
  visible: boolean
  onClose: () => void
  onConfirmDelete: () => void
  item?: Message
}

const DialogTopicMessageModal: React.FC<Props> = ({ visible, onClose, onConfirmDelete, item }) => {
  const handleDelete = () => {
    onConfirmDelete()
    onClose()
  }

  const theme = useUserStore((state) => state.theme)
  const styles = createStyles(theme)

  return (
    <Modal animationType="none" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <ThemeText style={styles.modalTitle} numberOfLines={8}>
            {item?.text}
          </ThemeText>
          <ThemeText style={styles.modalText}>
            {dayjs(item?.timestamp).fromNow() + `\n确定要删除这条聊天记录吗？删除后将无法恢复。`}
          </ThemeText>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.buttonCancel]} onPress={onClose}>
              <ThemeText style={styles.textStyleCancel}>取消</ThemeText>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.buttonDelete]} onPress={handleDelete}>
              <ThemeText style={styles.textStyleDelete}>删除</ThemeText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const createStyles = (theme: 'light' | 'dark') => {
  const isDark = theme === 'dark'

  return StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)',
    },
    modalView: {
      margin: 20,
      backgroundColor: isDark ? '#2C2C2C' : 'aliceblue',
      borderRadius: 10,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      width: '80%',
      maxWidth: 450,
    },
    modalTitle: {
      marginBottom: 15,
      textAlign: 'center',
      fontSize: 18,
      fontWeight: 'bold',
      color: isDark ? 'aliceblue' : '#000000',
    },
    modalText: {
      marginBottom: 20,
      textAlign: 'center',
      fontSize: 16,
      color: isDark ? '#B0B0B0' : '#666666',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    button: {
      borderRadius: 8,
      padding: 10,
      elevation: 2,
      width: '45%',
      alignItems: 'center',
    },
    buttonCancel: {
      backgroundColor: isDark ? '#3A3A3A' : '#E0E0E0',
    },
    buttonDelete: {
      backgroundColor: Colors.tint,
    },
    textStyleCancel: {
      textAlign: 'center',
    },
    textStyleDelete: {
      color: 'aliceblue',
      textAlign: 'center',
    },
  })
}

export default DialogTopicMessageModal
