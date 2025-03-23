"use client";
import Nodes from "@/constants/nodes";
import { useAccountStore } from "@/stores/accountStore";
import { useUserStore } from "@/stores/userStore";
import { DotClient } from "dot.most.box";
import { HDNodeWallet } from "ethers";
import { useEffect } from "react";

export default function AppProvider() {
  const setItem = useUserStore((state) => state.setItem);
  const initWallet = useUserStore((state) => state.initWallet);
  const initAccount = useAccountStore((state) => state.initAccount);
  // profile
  const wallet = useUserStore((state) => state.wallet);
  const dotClient = useUserStore((state) => state.dotClient);

  useEffect(() => {
    initWallet();
    initAccount();
    setItem("firstPath", window.location.pathname);
    setItem("dotClient", new DotClient(Nodes));
  }, []);

  useEffect(() => {
    if (wallet && dotClient) {
      const signer = HDNodeWallet.fromPhrase(wallet.mnemonic);
      const dot = dotClient.dot(wallet.address);
      dot.setSigner(signer);
      dot.setPubKey(wallet.public_key);
      dot.setPrivKey(wallet.private_key);
      setItem("dot", dot);

      // 同步自己的公钥和用户名
      dot.on("info", (info) => {
        if (
          info?.username === wallet.username &&
          info?.public_key === wallet.public_key
        ) {
          dot.off("info");
        } else {
          dot.put("info", {
            username: wallet.username,
            public_key: wallet.public_key,
          });
          dot.off("info");
        }
      });
    }
  }, [wallet, dotClient]);
  return null;
}
