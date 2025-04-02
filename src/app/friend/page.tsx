"use client";

import {
  Text,
  Button,
  Stack,
  Avatar,
  Box,
  Space,
  Textarea,
  ActionIcon,
  Group,
} from "@mantine/core";
import { IconMicrophone, IconMoodSmile, IconPlus } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import mp from "@/constants/mp";
import { AppHeader } from "@/components/AppHeader";
import { useRouter } from "next/navigation";
import "@/app/friend/chat.scss";
import { getAddress, isAddress, ZeroAddress } from "ethers";
import { useFriendStore } from "@/stores/friendStore";
import { useUserStore } from "@/stores/userStore";
import { useEffect, useState } from "react";
import { useHash } from "@mantine/hooks";

const AddFriend = () => {
  const router = useRouter();
  const dotClient = useUserStore((state) => state.dotClient);
  const addFriend = useFriendStore((state) => state.addFriend);

  const form = useForm({
    initialValues: {
      address: "",
    },
    validate: {
      address: (value) => (!isAddress(value) ? "请输入有效的以太坊地址" : null),
    },
  });

  const submit = () => {
    if (!form.validate().hasErrors) {
      const address = getAddress(form.values.address);
      const dot = dotClient?.dot(address);
      if (dot) {
        dot.on("info", (info) => {
          if (info.username && info.public_key) {
            dot.off("info");
            router.replace(`/friend#${address}`);
            addFriend(info.username, address, info.public_key);
          }
        });
      }
    }
  };

  return (
    <Stack gap="md" className="add-box">
      <Box className="header">
        <Text size="xl" fw={500}></Text>
        <Space h="sx" />
        <Avatar
          size="xl"
          radius="md"
          src={
            isAddress(form.values.address)
              ? mp.avatar(form.values.address)
              : "/icons/pwa-512x512.png"
          }
          alt="it's me"
        />
      </Box>
      <form onSubmit={form.onSubmit(submit)}>
        <Stack gap="md">
          <Textarea
            withAsterisk
            label="好友地址"
            placeholder={ZeroAddress}
            rows={2}
            maxLength={42}
            {...form.getInputProps("address")}
          />
          <Button type="submit" disabled={!form.values.address}>
            查找好友
          </Button>
        </Stack>
      </form>
    </Stack>
  );
};

export default function PageFriend() {
  const [hash] = useHash();
  const [info, setInfo] = useState({
    username: "",
    public_key: "",
  });
  const [address, setAddress] = useState("");
  const dotClient = useUserStore((state) => state.dotClient);
  const addFriend = useFriendStore((state) => state.addFriend);

  interface Message {
    id: string;
    content: string;
    isMe: boolean;
    timestamp: string;
  }

  // 聊天消息数据
  const [messages] = useState<Message[]>([
    {
      id: "1",
      content: "Nadal, Can you please let me know the price of that condo?",
      isMe: false,
      timestamp: "09:15",
    },
    {
      id: "2",
      content: "I am thinking to take it!!",
      isMe: false,
      timestamp: "09:16",
    },
    {
      id: "3",
      content: "Hey Melvin. I need to check. That post is quite old. 🐒",
      isMe: true,
      timestamp: "09:20",
    },
    {
      id: "4",
      content: "No problem, take your time.",
      isMe: false,
      timestamp: "09:22",
    },
    {
      id: "5",
      content:
        "Yes, it includes one underground parking spot. There's also visitor parking available.You're welcome! I'll send you the address details shortly. Looking forward to seeing you on Saturday.I just checked with the owner. The condo is still available but the price has increased to $450,000.The owner might consider offers around $430,000. Would you like me to ask? Yes, it includes one underground parking spot. There's also visitor parking available.You're welcome! I'll send you the address details shortly. Looking forward to seeing you on Saturday.I just checked with the owner. The condo is still available but the price has increased to $450,000.The owner might consider offers around $430,000. Would you like me to ask?",
      isMe: true,
      timestamp: "09:30",
    },
    {
      id: "6",
      content:
        "That's a bit higher than I expected. Is there any room for negotiation?",
      isMe: false,
      timestamp: "09:32",
    },
    {
      id: "7",
      content:
        "The owner might consider offers around $430,000. Would you like me to ask?",
      isMe: true,
      timestamp: "09:35",
    },
    {
      id: "8",
      content:
        "Yes, please! That would be great. Also, can I see it again this weekend?",
      isMe: false,
      timestamp: "09:37",
    },
    {
      id: "9",
      content:
        "Sure, I can arrange a viewing for Saturday afternoon. How does 2pm sound?",
      isMe: true,
      timestamp: "09:40",
    },
    {
      id: "10",
      content: "Perfect! I'll be there. Thanks for your help! 😊",
      isMe: false,
      timestamp: "09:42",
    },
    {
      id: "11",
      content:
        "You're welcome! I'll send you the address details shortly. Looking forward to seeing you on Saturday.",
      isMe: true,
      timestamp: "09:45",
    },
    {
      id: "12",
      content: "By the way, does the condo come with parking?",
      isMe: false,
      timestamp: "10:15",
    },
    {
      id: "13",
      content:
        "Yes, it includes one underground parking spot. There's also visitor parking available.",
      isMe: true,
      timestamp: "10:20",
    },
  ]);

  useEffect(() => {
    if (hash) {
      if (isAddress(hash.slice(1))) {
        setAddress(hash.slice(1));
      }
    }
  }, [hash]);

  useEffect(() => {
    if (dotClient && address) {
      const dot = dotClient.dot(address);
      dot.on("info", (data) => {
        if (data.username && data.public_key) {
          addFriend(data.username, address, data.public_key);
          setInfo(data);
          dot.off("info");
        }
      });
    }
  }, [dotClient, address]);
  return (
    <Box id="page-chat">
      <AppHeader
        title={`${info.username}#${address.slice(-4)}` || "好友"}
        right={
          <Avatar
            src={address ? mp.avatar(address) : "/icons/pwa-512x512.png"}
          />
        }
      />
      {info.public_key ? (
        <>
          <Box className="messages">
            {messages.map((message) => (
              <Box
                key={message.id}
                className={`message ${message.isMe ? "me" : ""}`}
              >
                <Box className="content">{message.content}</Box>
              </Box>
            ))}
          </Box>

          <Group gap="xs" className="message-input">
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
            <ActionIcon variant="subtle" color="gray" size="lg">
              <IconMicrophone size={24} />
            </ActionIcon>
            <ActionIcon variant="subtle" color="gray" size="lg">
              <IconPlus size={24} />
            </ActionIcon>
          </Group>
        </>
      ) : (
        <AddFriend />
      )}
    </Box>
  );
}
