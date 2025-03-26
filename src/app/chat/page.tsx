"use client";
import { AppHeader } from "@/components/AppHeader";
import mp from "@/constants/mp";
import { useUserStore } from "@/stores/userStore";
import { Box } from "@mantine/core";
import { useHash } from "@mantine/hooks";
import { useEffect, useState } from "react";

export default function ChatPage() {
  const [hash] = useHash();
  const address = hash.split("#")[1];
  const [username, setUsername] = useState("");

  const dotClient = useUserStore((state) => state.dotClient);

  useEffect(() => {
    if (dotClient && address) {
      const dot = dotClient.dot(address);
      dot.on("info", (info) => {
        if (info) {
          setUsername(info.username);
          dot.off("info");
        }
      });
    }
  }, [dotClient, address]);

  return (
    <Box>
      <AppHeader title={`${mp.formatAddress(address)}`} />
      <h1>
        与【{username}】{mp.formatAddress(address)} 的聊天
      </h1>
    </Box>
  );
}
