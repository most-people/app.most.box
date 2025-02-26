import { ThemeText } from '@/components/Theme'
import { Colors } from '@/constants/Colors'
import mp from '@/constants/mp'
import { SvgXml } from 'react-native-svg'
import { useState } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { Link, useNavigation, useRouter } from 'expo-router'
import { useUserStore } from '@/stores/userStore'
import Dot from 'dot.most.box'

export default function LoginPage() {
  const navigation = useNavigation()
  const router = useRouter()
  const { setItem, theme } = useUserStore()
  const styles = createStyles(theme)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const toLogin = () => {
    if (username && password) {
      if (navigation.canGoBack()) {
        navigation.goBack()
      } else {
        router.replace('/')
      }
      setTimeout(() => {
        const wallet = mp.login(username, password)
        if (wallet) {
          setItem('wallet', wallet)
        }
      }, 0)
    }
  }

  const disabled = !username || !password

  const back = () => {
    if (navigation.canGoBack()) {
      navigation.goBack()
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: '(tabs)' as never }],
      })
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableOpacity onPress={back}>
        <ThemeText type="link">游客</ThemeText>
      </TouchableOpacity>

      <SvgXml xml={mp.avatar(Dot.mostWallet(username, password).address)} style={styles.avatar} />

      <Text style={styles.title}>欢迎登录</Text>

      <TextInput
        style={styles.input}
        placeholder="请输入用户名"
        placeholderTextColor="#888"
        maxLength={36}
        value={username}
        onChangeText={setUsername}
        returnKeyType="next"
      />

      <TextInput
        style={styles.input}
        placeholder="请输入密码"
        placeholderTextColor="#888"
        maxLength={100}
        value={password}
        onChangeText={setPassword}
        returnKeyType="next"
      />

      <TouchableOpacity
        style={[styles.button, disabled ? styles.buttonDisabled : null]}
        onPress={toLogin}
        disabled={disabled}
      >
        <Text style={styles.buttonText}>登录</Text>
      </TouchableOpacity>

      <Link href="/about">
        <ThemeText type="link">去中心化，无需注册，直接登录</ThemeText>
      </Link>
    </KeyboardAvoidingView>
  )
}

const createStyles = (theme: 'light' | 'dark') => {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors[theme].background,
      padding: 20,
      gap: 16,
    },
    title: {
      fontSize: 24,
      color: Colors[theme].text,
    },
    input: {
      width: '100%',
      height: 50,
      borderColor: Colors[theme].input.border,
      borderWidth: 1,
      borderRadius: 10,
      paddingLeft: 15,
      backgroundColor: Colors[theme].input.background,
      color: Colors[theme].text,
      fontSize: 16,
    },
    button: {
      width: '100%',
      height: 50,
      backgroundColor: Colors.sender,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
    },
    buttonDisabled: {
      backgroundColor: Colors[theme].disabled,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 10,
    },
  })
}
