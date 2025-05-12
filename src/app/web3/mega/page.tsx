"use client";

import { AppHeader } from "@/components/AppHeader";
import { Box, Button, Tabs } from "@mantine/core";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Link from "next/link";
import { notifications } from "@mantine/notifications";
import "./mega.scss";
import { useUserStore } from "@/stores/userStore";

// 定义网络类型
type NetworkType = "mega" | "monad";

export default function Web3MegaPage() {
  const wallet = useUserStore((state) => state.wallet);
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const [network, setNetwork] = useState<NetworkType>("mega");

  // 网络配置
  const networkConfig = {
    mega: {
      rpc: "https://carrot.megaeth.com/rpc",
      explorer: "https://www.megaexplorer.xyz",
      faucet: "https://testnet.megaeth.com/#2",
      name: "Mega ETH",
    },
    monad: {
      rpc: "https://testnet-rpc.monad.xyz",
      explorer: "https://testnet.monadexplorer.com",
      faucet: "https://faucet.monad.xyz",
      name: "Monad",
    },
  };

  // 监听键盘事件
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)
      ) {
        setPressedKey(event.key);
        // 防止页面滚动
        event.preventDefault();
      }
    };

    const handleKeyUp = () => {
      setPressedKey(null);
    };

    // 添加事件监听
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // 组件卸载时移除事件监听
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // 添加鼠标按下事件处理
  const handleMouseDown = (key: string) => {
    setPressedKey(key);
  };

  // 添加鼠标松开事件处理
  const handleMouseUp = () => {
    setPressedKey(null);
  };

  const [signer, setSigner] = useState<ethers.HDNodeWallet | null>(null);
  const [provider, setProvider] = useState<ethers.JsonRpcProvider | null>(null);

  // 当网络变化时更新 provider
  useEffect(() => {
    const newProvider = new ethers.JsonRpcProvider(networkConfig[network].rpc);
    setProvider(newProvider);
  }, [network]);

  // 当 provider 或 wallet 变化时更新 signer
  useEffect(() => {
    if (wallet && provider) {
      // 通过助记词 创建钱包实例
      const w = ethers.Wallet.fromPhrase(wallet.mnemonic);
      // 通过RPC 连接到以太坊网络
      const signer = w.connect(provider);
      setSigner(signer);
    }
  }, [wallet, provider]);

  const sendTransaction = async () => {
    if (signer) {
      try {
        // 发送一笔交易
        const tx = await signer.sendTransaction({
          to: signer.address,
          value: ethers.parseEther("0"),
        });
        console.log("交易哈希:", tx.hash);
        notifications.show({
          color: "green",
          title: `${networkConfig[network].name} 交易哈希`,
          message: tx.hash,
        });
      } catch (error) {
        console.error("交易失败:", error);
        notifications.show({
          color: "red",
          title: "交易失败",
          message: (error as Error).message,
        });
      }
    }
  };

  useEffect(() => {
    if (pressedKey) {
      console.log("按下按键:", pressedKey);
      notifications.show({
        title: "按下按键",
        message: pressedKey,
      });
      // 发送一笔交易
      sendTransaction();
    }
  }, [pressedKey]);

  return (
    <Box id="page-mega">
      <AppHeader title={`${networkConfig[network].name} 测试网`} />

      <Tabs
        value={network}
        onChange={(value) => setNetwork(value as NetworkType)}
        mb="md"
      >
        <Tabs.List>
          <Tabs.Tab value="mega">Mega ETH</Tabs.Tab>
          <Tabs.Tab value="monad">Monad</Tabs.Tab>
        </Tabs.List>
      </Tabs>

      {signer && (
        <p>
          {networkConfig[network].explorer}
          {signer.address}
        </p>
      )}
      <p>{networkConfig[network].rpc}</p>
      <p>
        <Link href={networkConfig[network].faucet} target="_blank">
          {networkConfig[network].name} 水龙头
        </Link>
      </p>

      <div className="keyboard-container">
        {/* 上下左右按键 */}
        <div className="key-pad">
          {/* 上键 */}
          <Button
            className={`direction-key up ${
              pressedKey === "ArrowUp" ? "pressed" : ""
            }`}
            onMouseDown={() => handleMouseDown("ArrowUp")}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp} // 添加鼠标离开事件，防止鼠标拖出按钮时按钮仍保持按下状态
          >
            ↑
          </Button>

          {/* 左键 */}
          <Button
            className={`direction-key left ${
              pressedKey === "ArrowLeft" ? "pressed" : ""
            }`}
            onMouseDown={() => handleMouseDown("ArrowLeft")}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            ←
          </Button>

          {/* 下键 */}
          <Button
            className={`direction-key down ${
              pressedKey === "ArrowDown" ? "pressed" : ""
            }`}
            onMouseDown={() => handleMouseDown("ArrowDown")}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            ↓
          </Button>

          {/* 右键 */}
          <Button
            className={`direction-key right ${
              pressedKey === "ArrowRight" ? "pressed" : ""
            }`}
            onMouseDown={() => handleMouseDown("ArrowRight")}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            →
          </Button>
        </div>
      </div>
    </Box>
  );
}
