"use client";
import { AppHeader } from "@/components/AppHeader";
import { useUserStore } from "@/stores/userStore";
import { ActionIcon, Avatar, Box, Group, Textarea } from "@mantine/core";
import { useHash } from "@mantine/hooks";
import { useEffect, useState } from "react";
import "./chat.scss";
import { IconMicrophone, IconMoodSmile, IconPlus } from "@tabler/icons-react";
import mp from "@/constants/mp";

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
    <Box id="page-chat">
      <AppHeader
        title={username}
        right={
          <Avatar
            src={address ? mp.avatar(address) : "/icons/pwa-512x512.png"}
          />
        }
      />
      <Group gap="xs" className="input-box">
        <ActionIcon variant="subtle" color="gray" size="lg">
          <IconMoodSmile size={24} />
        </ActionIcon>
        <Textarea
          placeholder="输入消息..."
          size="md"
          radius="md"
          autosize
          maxRows={4}
          style={{ flex: 1 }}
        />
        <ActionIcon variant="subtle" color="gray" size="lg" disabled>
          <IconMicrophone size={24} />
        </ActionIcon>
        <ActionIcon variant="subtle" color="gray" size="lg">
          <IconPlus size={24} />
        </ActionIcon>
      </Group>
    </Box>
  );
}
