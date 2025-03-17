import nacl from "tweetnacl";
import {
  toUtf8Bytes,
  encodeBase64,
  decodeBase64,
  toUtf8String,
  ZeroAddress,
  computeHmac,
} from "ethers";
import { createAvatar } from "@dicebear/core";
import { botttsNeutral } from "@dicebear/collection";
import { type MostWallet, mostWallet } from "dot.most.box";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-cn";

dayjs.extend(relativeTime);
dayjs.locale("zh-cn");

// 头像生成
const avatar = (address = "Most") => {
  return createAvatar(botttsNeutral, {
    seed: "most.box@" + address,
    flip: true,
    backgroundType: ["gradientLinear"],
  }).toDataUri();
};

// 时间格式化
const formatTime = (time: string) => {
  if (!time) return "";
  const date = dayjs(Number(time));
  const hour = date.hour();
  // 判断当前时间段
  let timeOfDay;
  if (hour >= 0 && hour < 3) {
    timeOfDay = "凌晨";
  } else if (hour >= 3 && hour < 6) {
    timeOfDay = "拂晓";
  } else if (hour >= 6 && hour < 9) {
    timeOfDay = "早晨";
  } else if (hour >= 9 && hour < 12) {
    timeOfDay = "上午";
  } else if (hour >= 12 && hour < 15) {
    timeOfDay = "下午";
  } else if (hour >= 15 && hour < 18) {
    timeOfDay = "傍晚";
  } else if (hour >= 18 && hour < 21) {
    timeOfDay = "薄暮";
  } else {
    timeOfDay = "深夜";
  }
  return date.format(`YYYY年M月D日 ${timeOfDay}h点m分`);
};

const getHash = (message: string) => {
  // return sha256(toUtf8Bytes(message))
  let hash = 0;
  for (let i = 0; i < message.length; i++) {
    const char = message.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // 转换为32位整数
  }
  return Math.abs(hash).toString(36); // 转换为36进制并取正数
};

const formatAddress = (address?: string) => {
  if (address) {
    return address.slice(0, 6) + "..." + address.slice(-4);
  } else {
    return "";
  }
};

// Base64 编码
const enBase64 = (str: string) => encodeBase64(toUtf8Bytes(str));

// Base64 解码
const deBase64 = (str: string) => toUtf8String(decodeBase64(str));

// JWT 生成
const createJWT = (data: any, secret: string, exp = 60) => {
  const header = { alg: "HS256", typ: "JWT" };
  const payload = {
    exp: dayjs().add(exp, "second").unix(),
    data,
  };

  const encodedHeader = enBase64(JSON.stringify(header));
  const encodedPayload = enBase64(JSON.stringify(payload));
  const dataToSign = `${encodedHeader}.${encodedPayload}`;

  // HMAC-SHA256 签名
  const signature = computeHmac(
    "sha256",
    decodeBase64(secret),
    toUtf8Bytes(dataToSign)
  );

  return `${encodedHeader}.${encodedPayload}.${encodeBase64(signature)}`;
};

// JWT 验证
const verifyJWT = (token: string, secret: string) => {
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [encodedHeader, encodedPayload, encodedSignature] = parts;
  const dataToSign = `${encodedHeader}.${encodedPayload}`;

  try {
    // 计算签名
    const calculatedSig = encodeBase64(
      computeHmac("sha256", decodeBase64(secret), toUtf8Bytes(dataToSign))
    );

    // 签名比对
    if (calculatedSig !== encodedSignature) return null;

    // 解码载荷
    const payload = JSON.parse(deBase64(encodedPayload));

    // 检查过期时间
    if (dayjs().unix() > payload.exp) return null;

    return payload.data;
  } catch (error) {
    console.log("JWT 验证失败:", error);
    return null;
  }
};

// 生成随机密钥
const randomKeyBase64 = (bytes = 32) => encodeBase64(nacl.randomBytes(bytes));

// 登录
const login = (username: string, password: string): MostWallet | null => {
  try {
    const wallet = mostWallet(
      username,
      password,
      "I know loss mnemonic will lose my wallet."
    );
    const tokenSecret = randomKeyBase64();
    const token = createJWT(wallet, tokenSecret, 24 * 60 * 60); // 24小时有效期

    // 验证并存储
    if (verifyJWT(token, tokenSecret)?.address === wallet.address) {
      localStorage.setItem("token", token);
      localStorage.setItem("tokenSecret", tokenSecret);
      return wallet;
    }
  } catch (error) {
    console.log("登录失败:", error);
  }
  return null;
};

const open = (url: string) => {
  //   Linking.openURL(url)
};

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
  open,
};
