"use client";
import Nodes from "@/constants/nodes";
import { useAccountStore } from "@/stores/accountStore";
import { useUserStore } from "@/stores/userStore";
import { DotClient } from "dot.most.box";
import { HDNodeWallet } from "ethers";
import { useEffect } from "react";

const OnlineContract = "0x022B0D0323F789f603220c7ADb694Cb5bb64Ba21"; // MOST

export default function AppProvider() {
  const setItem = useUserStore((state) => state.setItem);
  const initWallet = useUserStore((state) => state.initWallet);
  const initAccount = useAccountStore((state) => state.initAccount);
  // profile
  const wallet = useUserStore((state) => state.wallet);
  const dotClient = useUserStore((state) => state.dotClient);
  const onlineUpdate = useUserStore((state) => state.onlineUpdate);

  useEffect(() => {
    initWallet();
    initAccount();
    setItem("firstPath", window.location.pathname);
    setItem("dotClient", new DotClient(Nodes));
  }, []);

  const initOnline = (dotClient: DotClient) => {
    const onlineDot = dotClient.dot(OnlineContract);
    onlineDot.on("notify", (data) => {
      onlineUpdate(data);
    });
  };

  useEffect(() => {
    if (dotClient) {
      initOnline(dotClient);
      // 已登录
      if (wallet) {
        const signer = HDNodeWallet.fromPhrase(wallet.mnemonic);
        const dot = dotClient.dot(wallet.address);
        dot.setSigner(signer);
        dot.setPubKey(wallet.public_key);
        dot.setPrivKey(wallet.private_key);
        setItem("dot", dot);

        const heartbeat = () => {
          dot.notify(OnlineContract, wallet.username);
        };

        // 立即执行一次
        heartbeat();
        // 然后每分钟执行一次
        setInterval(heartbeat, 60000);

        // 同步自己的公钥和用户名
        dot.on("info", (info) => {
          const { username, public_key } = info || {};
          if (
            username !== wallet.username ||
            public_key !== wallet.public_key
          ) {
            dot.put("info", {
              username: wallet.username,
              public_key: wallet.public_key,
            });
          }
          dot.off("info");
        });
      }
    }
  }, [wallet, dotClient]);
  return null;
}
