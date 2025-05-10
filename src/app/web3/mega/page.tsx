"use client";

import { AppHeader } from "@/components/AppHeader";
import { Box, Button } from "@mantine/core";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { notifications } from "@mantine/notifications";
import "./mega.scss";
import { useUserStore } from "@/stores/userStore";

export default function Web3MegaPage() {
  const wallet = useUserStore((state) => state.wallet);
  const [pressedKey, setPressedKey] = useState<string | null>(null);

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

  const sendTransaction = async () => {
    if (signer) {
      // 发送一笔交易
      const tx = await signer.sendTransaction({
        to: signer.address,
        value: ethers.parseEther("0"),
      });
      console.log("交易哈希:", tx.hash);
      notifications.show({
        color: "green",
        title: "交易哈希",
        message: tx.hash,
      });
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

  const [signer, setSigner] = useState<ethers.HDNodeWallet | null>(null);

  // 通过 RPC 连接到以太坊网络
  const provider = new ethers.JsonRpcProvider("https://carrot.megaeth.com/rpc");
  useEffect(() => {
    if (wallet) {
      // 通过助记词 创建钱包实例
      const w = ethers.Wallet.fromPhrase(wallet.mnemonic);
      // 通过RPC 连接到以太坊网络
      const signer = w.connect(provider);
      setSigner(signer);
    }
  }, [wallet]);

  return (
    <Box id="page-mega">
      <AppHeader title="Mega ETH" />
      <p>
        https://www.megaexplorer.xyz/address/0xBb2568557284b1daa75698c3B71A5dd7FC7Bc1bC
      </p>
      <p>https://carrot.megaeth.com/rpc</p>
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
