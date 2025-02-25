import { useState } from 'react'
import PageView from '@/components/PageView'
import { ThemeText } from '@/components/Theme'
import { useUserStore } from '@/stores/userStore'
import { TouchableOpacity } from 'react-native'
import { Link } from 'expo-router'

export default function Web3Page() {
  const { wallet } = useUserStore()
  const [showX25519, setShowX25519] = useState(false)
  return (
    <PageView title={'Web3'}>
      <ThemeText type="subtitle">Web3</ThemeText>
      <ThemeText>
        旨在重塑互联网生态，将用户的控制权和数据所有权还给个人，推动更加公平和透明的人类社会发展。
      </ThemeText>
      <Link href="/web3/tool">
        <ThemeText type="link">工具集</ThemeText>
      </Link>
      <ThemeText type="subtitle">ETH 地址</ThemeText>
      <ThemeText>{wallet?.address}</ThemeText>
      <ThemeText type="subtitle">x25519 公钥</ThemeText>
      <ThemeText>{wallet?.public_key}</ThemeText>
      <ThemeText type="subtitle">x25519 私钥</ThemeText>

      {showX25519 && <ThemeText>{wallet?.private_key}</ThemeText>}
      <TouchableOpacity onPress={() => setShowX25519(!showX25519)}>
        <ThemeText type="link">{showX25519 ? '隐藏' : '显示'}</ThemeText>
      </TouchableOpacity>
    </PageView>
  )
}
