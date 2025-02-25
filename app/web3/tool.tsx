import { Colors } from '@/constants/Colors'
import mp from '@/constants/mp'
import { SvgXml } from 'react-native-svg'
import QRCode from 'react-native-qrcode-svg'
import { useEffect, useState } from 'react'
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import { useUserStore } from '@/stores/userStore'
import Dot from 'dot.most.box'
import PageView from '@/components/PageView'
import { ThemeText, ThemeView } from '@/components/Theme'

export default function LoginPage() {
  const { theme } = useUserStore()
  const styles = createStyles(theme)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [address, setAddress] = useState(mp.ZeroAddress)
  const [mnemonic, setMnemonic] = useState('')
  const [showAddress, setShowAddress] = useState(true)
  const [showMnemonic, setShowMnemonic] = useState(false)

  useEffect(() => {
    if (username && password) {
      const danger = Dot.mostWallet(username, password, 'I know loss mnemonic will lose my wallet.')
      setAddress(danger.address)
      setMnemonic(danger.mnemonic)
    } else {
      setAddress(mp.ZeroAddress)
      setMnemonic('')
    }
  }, [username, password])

  return (
    <PageView title={'Web3'}>
      <SvgXml xml={mp.avatar(Dot.mostWallet(username, password).address)} style={styles.avatar} />

      <ThemeText style={styles.title}>账户查询</ThemeText>

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

      <TouchableOpacity onPress={() => setShowAddress(!showAddress)}>
        <ThemeText type="link">{showAddress ? '隐藏' : '二维码'}</ThemeText>
      </TouchableOpacity>

      {showAddress && (
        <ThemeView style={styles.qrCode}>
          <QRCode value={address} size={200} />
        </ThemeView>
      )}

      <ThemeText style={styles.title}>ETH 地址：{address}</ThemeText>

      <ThemeText style={styles.danger}>
        {showMnemonic
          ? mnemonic || ' '
          : '任何拥有您助记词的人都可以窃取您账户中的任何资产，切勿泄露！！！'}
      </ThemeText>

      <TouchableOpacity onPress={() => setShowMnemonic(!showMnemonic)}>
        <ThemeText type="link">{showMnemonic ? '隐藏' : '显示'}</ThemeText>
      </TouchableOpacity>

      {showMnemonic && (
        <ThemeView style={styles.qrCode}>
          <QRCode value={mnemonic || ' '} size={200} />
        </ThemeView>
      )}
    </PageView>
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
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 10,
    },
    danger: {
      color: Colors.tint,
      backgroundColor: Colors[theme].disabled,
      padding: 10,
      fontSize: 16,
      borderRadius: 10,
      fontWeight: 'thin',
      fontStyle: 'italic',
    },
    qrCode: {
      padding: 15,
      backgroundColor: '#fff',
      borderRadius: 10,
      width: 230,
      height: 230,
    },
  })
}
