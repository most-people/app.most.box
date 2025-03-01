import { router, useLocalSearchParams } from 'expo-router'
import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native'
import { AppHeader } from '@/components/AppHeader'
import { Icon } from '@/assets/icon'
import { Colors } from '@/constants/Colors'
import { useToast } from 'expo-toast'
import { Message, useChat } from '@/hooks/useChat'
import { useUserStore } from '@/stores/userStore'
import DialogTopicMessage from '@/components/Dialog/TopicMessage'
import { SvgXml } from 'react-native-svg'
import mp from '@/constants/mp'
import { useCopy } from '@/hooks/useCopy'

export default function TopicPage() {
  const params = useLocalSearchParams()
  const toast = useToast()
  const topicName = params.topic as string
  const [message, setMessage] = useState('')
  const chat = useChat(topicName)
  const wallet = useUserStore((state) => state.wallet)
  const theme = useUserStore((state) => state.theme)
  const styles = createStyles(theme)
  const copy = useCopy()

  const send = () => {
    if (!wallet) {
      toast.show('请先登录')
      return router.push('/login')
    }
    if (message.trim()) {
      chat.send(message)
      setMessage('')
      setAutoHeight(40)
    }
  }

  const messages = chat.messages.sort((a, b) => a.timestamp - b.timestamp)

  const [showDelete, setShowDelete] = useState(false)
  const [deleteItem, setDeleteItem] = useState<Message | undefined>(undefined)
  const deleteMessage = () => {
    if (!wallet) {
      toast.show('请先登录')
      return router.push('/login')
    }
    if (deleteItem) chat.del(deleteItem.timestamp)
  }

  const [autoHeight, setAutoHeight] = useState(40)

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <AppHeader
        title={topicName}
        rightContent={
          <TouchableOpacity onPress={() => toast.show('更多操作，开发中...')}>
            <Icon.More width={20} height={20} fill={Colors[theme].text} />
          </TouchableOpacity>
        }
      />
      <FlatList
        data={messages}
        initialNumToRender={10}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageBox,
              item.address === wallet?.address ? styles.senderBox : styles.receiverBox,
            ]}
          >
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: '/people/[address]',
                  params: { address: item.address },
                })
              }
            >
              <SvgXml xml={mp.avatar(item.address)} style={styles.avatar} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => copy(item.text)}
              onLongPress={() => {
                setShowDelete(true)
                setDeleteItem(item)
              }}
              style={[
                styles.messageContainer,
                item.address === wallet?.address ? styles.sender : styles.receiver,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  item.address === wallet?.address ? styles.senderText : styles.receiverText,
                ]}
              >
                {item.text}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item, i) => String(i)}
        style={styles.messageList}
      />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { height: Math.max(autoHeight, 40) }]}
            value={message}
            onChangeText={setMessage}
            placeholder="说点什么..."
            placeholderTextColor="#888"
            onSubmitEditing={send}
            maxLength={300}
            multiline
            submitBehavior="submit"
            onContentSizeChange={(event) => {
              // 内容高度变化时触发
              const h = event.nativeEvent.contentSize.height
              if (h !== autoHeight) {
                setTimeout(() => setAutoHeight(h), 0)
              }
            }}
            returnKeyType="send"
            onKeyPress={(event) => {
              if (Platform.OS === 'web') {
                // @ts-ignore
                if (!event.shiftKey && !event.ctrlKey && event.nativeEvent.key === 'Enter') {
                  // 按下回车但不按Shift键时发送消息
                  event.preventDefault()
                  send()
                }
              }
            }}
          />
          <TouchableOpacity style={styles.sendButton} onPress={send}>
            <Text style={styles.sendButtonText}>发送</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <DialogTopicMessage
        visible={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirmDelete={deleteMessage}
        item={deleteItem}
      />
    </KeyboardAvoidingView>
  )
}

const createStyles = (theme: 'light' | 'dark') => {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    messageList: {
      flex: 1,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    messageBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    messageContainer: {
      padding: 10,
      marginVertical: 5,
      borderRadius: 10,
      maxWidth: '80%',
      cursor: 'pointer',
    },
    sender: {
      backgroundColor: Colors.sender,
    },
    senderText: {
      color: 'aliceblue',
    },
    senderBox: {
      alignSelf: 'flex-end',
      flexDirection: 'row-reverse',
    },
    receiver: {
      backgroundColor: theme === 'dark' ? '#2C2C2C' : 'aliceblue',
    },
    receiverText: {
      color: Colors[theme].text,
    },
    receiverBox: {
      alignSelf: 'flex-start',
    },
    messageText: {
      fontSize: 16,
      // @ts-ignore
      wordBreak: 'break-word',
    },
    safeArea: {
      backgroundColor: theme === 'dark' ? '#1E1E1E' : 'aliceblue',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderTopWidth: 1,
      borderColor: theme === 'dark' ? '#444' : '#e0e0e0',
    },
    input: {
      flex: 1,
      borderWidth: 1,
      borderColor: Colors[theme].input.border,
      borderRadius: 20,
      paddingVertical: 6,
      paddingHorizontal: 15,
      backgroundColor: Colors[theme].input.background,
      color: Colors[theme].text,
      fontSize: 16,
    },
    sendButton: {
      marginLeft: 10,
      backgroundColor: Colors.sender,
      borderRadius: 20,
      paddingVertical: 8,
      paddingHorizontal: 15,
    },
    sendButtonText: {
      color: 'aliceblue',
      fontSize: 16,
    },
    avatar: {
      width: 32,
      height: 32,
      borderRadius: 10,
    },
  })
}
