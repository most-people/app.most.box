import { DialogPrompt } from '@/components/Dialog'
import PageView from '@/components/PageView'
import { ThemeText, ThemeView } from '@/components/Theme'
import { Colors } from '@/constants/Colors'
import Dot from 'dot.most.box'
import { useUserStore } from '@/stores/userStore'
import { useToast } from 'expo-toast'
import { useRef, useState } from 'react'
import { Switch, TouchableOpacity, StyleSheet } from 'react-native'

export default function Web3Page() {
  const { wallet, theme, setItem } = useUserStore()
  const styles = createStyles(theme)
  const [showMnemonic, setShowMnemonic] = useState(false)
  const [mnemonic, setMnemonic] = useState('')
  const toast = useToast()

  const createTopicRef = useRef<any>()
  const getMnemonic = (password: string) => {
    if (!password) return toast.show('密码不能为空')
    if (wallet) {
      const danger = Dot.mostWallet(
        wallet.username,
        password,
        'I know loss mnemonic will lose my wallet.',
      )
      if (danger.address === wallet.address) {
        setMnemonic(danger.mnemonic)
        setShowMnemonic(true)
      } else {
        return toast.show('密码错误')
      }
    }
  }
  const toggle = () => {
    if (wallet) {
      if (showMnemonic) {
        setMnemonic('')
        setShowMnemonic(false)
      } else {
        createTopicRef.current.openModal()
      }
    } else {
      toast.show('请先登录')
    }
  }

  return (
    <PageView title={'设置'}>
      <ThemeText type="subtitle">主题</ThemeText>
      <ThemeView
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <ThemeText>{theme === 'dark' ? '深色' : '浅色'}</ThemeText>
        <Switch
          onValueChange={() => setItem('theme', theme === 'dark' ? 'light' : 'dark')}
          value={theme === 'dark'}
        />
      </ThemeView>
      <ThemeText type="subtitle">令牌过期时间</ThemeText>
      <ThemeText>1天</ThemeText>

      <ThemeText type="subtitle">助记词</ThemeText>
      <ThemeText>任何拥有您助记词的人都可以窃取您账户中的任何资产，切勿泄露！！！</ThemeText>
      {showMnemonic && <ThemeText style={styles.danger}>{mnemonic}</ThemeText>}
      <TouchableOpacity onPress={toggle}>
        <ThemeText type="link">{showMnemonic ? '立刻删除' : '输入密码获取'}</ThemeText>
      </TouchableOpacity>

      <DialogPrompt ref={createTopicRef} title="输入密码获取" onConfirm={getMnemonic} />
    </PageView>
  )
}

const createStyles = (theme: 'light' | 'dark') => {
  return StyleSheet.create({
    danger: {
      color: Colors.tint,
      backgroundColor: Colors[theme].disabled,
      padding: 10,
      fontSize: 16,
      borderRadius: 10,
      fontWeight: 'thin',
      fontStyle: 'italic',
    },
  })
}
