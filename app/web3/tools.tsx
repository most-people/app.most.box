import { Colors } from '@/constants/Colors'
import mp from '@/constants/mp'
import { SvgXml } from 'react-native-svg'
import QRCode from 'react-native-qrcode-svg'
import { useEffect, useState } from 'react'
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import { useUserStore } from '@/stores/userStore'
import { mostWallet } from 'dot.most.box'
import PageView from '@/components/PageView'
import { ThemeText, ThemeView } from '@/components/Theme'
import { HDNodeWallet } from 'ethers'
import { useToast } from 'expo-toast'

interface DeriveAddress {
  index: number
  address: string
  privateKey: string
}
export default function Web3ToolPage() {
  const toast = useToast()
  const theme = useUserStore((state) => state.theme)
  const styles = createStyles(theme)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [address, setAddress] = useState(mp.ZeroAddress)
  const [mnemonic, setMnemonic] = useState('')
  const [showAddress, setShowAddress] = useState(true)
  const [showMnemonic, setShowMnemonic] = useState(false)

  // 派生地址
  const [deriveAddressList, setDeriveAddressList] = useState<DeriveAddress[]>([])
  const [deriveIndex, setDeriveIndex] = useState(0)
  const [deriveShowIndex, setDeriveShowIndex] = useState(true)
  const [deriveShowAddress, setDeriveShowAddress] = useState(true)
  const [deriveShowPrivateKey, setDeriveShowPrivateKey] = useState(false)

  useEffect(() => {
    if (username && password) {
      const danger = mostWallet(username, password, 'I know loss mnemonic will lose my wallet.')
      setAddress(danger.address)
      setMnemonic(danger.mnemonic)
      setDeriveAddressList([])
      setDeriveIndex(0)
    } else {
      setAddress(mp.ZeroAddress)
      setMnemonic('')
      setDeriveAddressList([])
      setDeriveIndex(0)
    }
  }, [username, password])

  // const customExport = () => {
  //   // 密码 1-100 账号 3
  //   if (!username) return
  //   const addresses = []
  //   for (let i = 1; i <= 100; i++) {
  //     const danger = Dot.mostWallet(
  //       username,
  //       String(i),
  //       'I know loss mnemonic will lose my wallet.',
  //     )
  //     const wallet = HDNodeWallet.fromPhrase(danger.mnemonic, undefined, `m/44'/60'/0'/0/2`)

  //     addresses.push({
  //       index: i,
  //       address: wallet.address,
  //       privateKey: wallet.privateKey,
  //     })
  //   }
  //   console.log(addresses.map((e) => e.address).join('\n'))
  //   console.log(addresses.map((e) => e.privateKey).join('\n'))
  // }
  const deriveAddress = () => {
    const list: DeriveAddress[] = []
    for (let i = deriveIndex; i < deriveIndex + 10; i++) {
      const path = `m/44'/60'/0'/0/${i}`
      const wallet = HDNodeWallet.fromPhrase(mnemonic, undefined, path)
      list.push({
        index: i,
        address: wallet.address,
        privateKey: wallet.privateKey,
      })
    }
    setDeriveAddressList((prev) => [...prev, ...list])
    setDeriveIndex(deriveIndex + 10)
    toast.show('已派生10个地址')
  }

  return (
    <PageView title="工具集">
      <SvgXml
        xml={mp.avatar(username && password ? mostWallet(username, password).address : undefined)}
        style={styles.avatar}
      />

      <ThemeText type="subtitle">Most Wallet 账户查询</ThemeText>

      <ThemeText>开源代码：https://www.npmjs.com/package/dot.most.box?activeTab=code</ThemeText>

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

      <ThemeText type="subtitle">ETH 地址：{address}</ThemeText>

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

      {/* <TouchableOpacity onPress={customExport}>
        <ThemeText type="link">自定义导出</ThemeText>
      </TouchableOpacity> */}

      {showMnemonic && mnemonic && (
        <>
          <TouchableOpacity onPress={deriveAddress}>
            <ThemeText type="link">派生10个地址</ThemeText>
          </TouchableOpacity>
          <ThemeText style={{ color: Colors.tint }}>
            任何拥有您私钥的人都可以窃取您地址中的任何资产，切勿泄露！！！
          </ThemeText>
          <ThemeView style={styles.table}>
            <ThemeView style={styles.tableHeader}>
              <TouchableOpacity
                style={[styles.tableCell, { flex: 0.15 }]}
                onPress={() => setDeriveShowIndex(!deriveShowIndex)}
              >
                <ThemeText style={[styles.headerCell]}>账户</ThemeText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tableCell, { flex: 0.35 }]}
                onPress={() => setDeriveShowAddress(!deriveShowAddress)}
              >
                <ThemeText style={[styles.headerCell]}>地址</ThemeText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tableCell, { flex: 0.5 }]}
                onPress={() => setDeriveShowPrivateKey(!deriveShowPrivateKey)}
              >
                <ThemeText style={[styles.headerCell, { color: Colors.tint }]}>
                  私钥（点击{deriveShowPrivateKey ? '隐藏' : '显示'}）
                </ThemeText>
              </TouchableOpacity>
            </ThemeView>

            {deriveAddressList.map((item) => (
              <ThemeView key={item.index} style={styles.tableRow}>
                <ThemeText style={[styles.tableCell, { flex: 0.15 }]}>
                  {deriveShowIndex ? item.index + 1 : ''}
                </ThemeText>
                <ThemeText style={[styles.tableCell, { flex: 0.35 }]} numberOfLines={1}>
                  {deriveShowAddress ? item.address : ''}
                </ThemeText>
                <ThemeText
                  style={[styles.tableCell, { flex: 0.5, color: Colors.tint }]}
                  numberOfLines={1}
                >
                  {deriveShowPrivateKey ? item.privateKey : ''}
                </ThemeText>
              </ThemeView>
            ))}
          </ThemeView>
        </>
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
      margin: 'auto',
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
    // table
    table: {
      width: '100%',
      borderTopWidth: 1,
      borderLeftWidth: 1,
      borderRightWidth: 1,
      borderColor: Colors[theme].border,
    },
    tableHeader: {
      flexDirection: 'row',
      backgroundColor: Colors[theme].background,
      borderBottomWidth: 1,
      borderColor: Colors[theme].border,
      paddingVertical: 8,
    },
    tableRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: Colors[theme].border,
      paddingVertical: 8,
    },
    tableCell: {
      paddingHorizontal: 8,
    },
    headerCell: {
      fontWeight: 'bold',
      fontSize: 14,
      color: Colors[theme].text,
    },
  })
}
