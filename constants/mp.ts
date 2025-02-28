import 'react-native-get-random-values'
import nacl from 'tweetnacl'
import CryptoJS from 'crypto-js'
import { toUtf8Bytes, encodeBase64, decodeBase64, toUtf8String, ZeroAddress } from 'ethers'
import asyncStorage from '@/stores/asyncStorage'
import { createAvatar } from '@dicebear/core'
import { botttsNeutral } from '@dicebear/collection'
import { type MostWallet, mostWallet } from 'dot.most.box'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const avatar = (address = 'Most') => {
  return createAvatar(botttsNeutral, {
    seed: 'most.box@' + address,
    flip: true,
    radius: 10,
  }).toString()
}
// 格式化时间
const formatTime = (time: string) => {
  if (!time) {
    return ''
  }
  const date = dayjs(Number(time))
  const hour = date.hour()
  // 判断当前时间段
  let timeOfDay
  if (hour >= 0 && hour < 3) {
    timeOfDay = '凌晨'
  } else if (hour >= 3 && hour < 6) {
    timeOfDay = '拂晓'
  } else if (hour >= 6 && hour < 9) {
    timeOfDay = '早晨'
  } else if (hour >= 9 && hour < 12) {
    timeOfDay = '上午'
  } else if (hour >= 12 && hour < 15) {
    timeOfDay = '下午'
  } else if (hour >= 15 && hour < 18) {
    timeOfDay = '傍晚'
  } else if (hour >= 18 && hour < 21) {
    timeOfDay = '薄暮'
  } else {
    timeOfDay = '深夜'
  }
  return date.format(`YYYY年M月D日 ${timeOfDay}h点m分`)
}

const getHash = (message: string) => {
  // return sha256(toUtf8Bytes(message))
  let hash = 0
  for (let i = 0; i < message.length; i++) {
    const char = message.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // 转换为32位整数
  }
  return Math.abs(hash).toString(36) // 转换为36进制并取正数
}

const formatAddress = (address?: string) => {
  if (address) {
    return address.slice(0, 6) + '...' + address.slice(-4)
  } else {
    return ''
  }
}

// Base64 编码
const enBase64 = (str: string) => {
  // 将字符串转换为字节数组
  const bytes = toUtf8Bytes(str)
  // 将字节数组编码为 Base64 字符串
  return encodeBase64(bytes)
}

// Base64 解码
const deBase64 = (str: string) => {
  // 解码 Base64
  const bytes = decodeBase64(str)
  // 将字节转换为 UTF-8 字符串
  return toUtf8String(bytes)
}

// 生成 JWT
const createJWT = (data: any, secret: string, exp = 60) => {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  }

  const payload = { exp: dayjs().unix() + exp, data }

  const encodedHeader = enBase64(JSON.stringify(header))
  const encodedPayload = enBase64(JSON.stringify(payload))

  // 使用 HMAC-SHA256 签名
  const signature = CryptoJS.HmacSHA256(
    `${encodedHeader}.${encodedPayload}`,
    CryptoJS.enc.Base64.parse(secret),
  )
  const encodedSignature = enBase64(signature.toString(CryptoJS.enc.Base64))
  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`
}

// 验证 JWT
const verifyJWT = (token: string, secret: string) => {
  const parts = token.split('.')
  if (parts.length !== 3) {
    console.log('Invalid JWT format')
    return null
  }

  const [encodedHeader, encodedPayload, encodedSignature] = parts
  const data = `${encodedHeader}.${encodedPayload}`

  // 验证签名
  const signature = CryptoJS.HmacSHA256(data, CryptoJS.enc.Base64.parse(secret))
  const validSignature = enBase64(signature.toString(CryptoJS.enc.Base64))

  if (validSignature !== encodedSignature) {
    console.log('Invalid signature')
    return null
  }

  // 检查是否过期
  const payload = JSON.parse(deBase64(encodedPayload))
  const now = Math.floor(Date.now() / 1000)
  if (payload.exp && now > payload.exp) {
    console.log('Token has expired')
    return null
  }

  return payload.data
}

const randomKeyBase64 = (bytes = 32) => {
  const buffer = nacl.randomBytes(bytes)
  return encodeBase64(buffer)
}

const login = (username: string, password: string): MostWallet | null => {
  const time = dayjs(0).add(1, 'day').unix()
  const wallet = mostWallet(username, password, 'I know loss mnemonic will lose my wallet.')
  // 生成 32 字节（256 位）密钥
  const tokenSecret = randomKeyBase64()
  const token = createJWT(wallet, tokenSecret, time)
  try {
    const data = verifyJWT(token, tokenSecret) as MostWallet | null
    if (data?.address === wallet.address) {
      asyncStorage.setItem('token', token)
      asyncStorage.setItem('tokenSecret', tokenSecret)
      return wallet
    }
  } catch (error: any) {
    console.log(error.message)
  }
  return null
}

export default {
  avatar,
  getHash,
  formatTime,
  formatAddress,
  enBase64,
  deBase64,
  createJWT,
  verifyJWT,
  login,
  ZeroAddress,
}
