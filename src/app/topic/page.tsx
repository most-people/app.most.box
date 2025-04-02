"use client";

import { useDisclosure, useHash } from "@mantine/hooks";
import {
  Text,
  Input,
  Button,
  Stack,
  PasswordInput,
  Avatar,
  Box,
  Space,
  Switch,
  ActionIcon,
  Group,
  Textarea,
} from "@mantine/core";
import { useEffect, useState } from "react";
import mp from "@/constants/mp";
import { MostWallet, mostWallet } from "dot.most.box";
import { AppHeader } from "@/components/AppHeader";
import { useRouter } from "next/navigation";
import { useTopicStore } from "@/stores/topicStore";
import "@/app/friend/chat.scss";
import { IconMicrophone, IconMoodSmile, IconPlus } from "@tabler/icons-react";

const JoinTopic = ({ onUpdate }: { onUpdate: (hash: string) => void }) => {
  const router = useRouter();
  const [visible, { toggle }] = useDisclosure(false);

  const join = useTopicStore((state) => state.join);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isEncrypted, setIsEncrypted] = useState(false);

  const submit = () => {
    const hash = "#" + mp.enBase64(JSON.stringify([name, password]));
    router.replace(`/topic${hash}`);
    onUpdate(hash);
    join(name, password);
  };
  return (
    <Stack gap="md" className="add-box">
      <Box className="header">
        <Text size="xl" fw={500}></Text>
        <Space h="sx" />
        <Avatar
          size="xl"
          radius="md"
          src={mp.topic(mostWallet(name, password).address)}
          alt="it's me"
        />
      </Box>
      <Stack gap="md">
        <Input
          autoFocus
          placeholder="话题名称"
          value={name}
          onChange={(event) => setName(event.currentTarget.value)}
        />

        <Group justify="flex-end">
          <Switch
            label="加密"
            size="md"
            labelPosition="left"
            checked={isEncrypted}
            onChange={(event) => {
              setIsEncrypted(event.currentTarget.checked);
              setPassword("");
            }}
          />
        </Group>

        <PasswordInput
          placeholder="话题密码"
          visible={visible}
          onVisibilityChange={toggle}
          value={password}
          disabled={!isEncrypted}
          onChange={(event) => setPassword(event.currentTarget.value)}
        />

        <Button onClick={submit} disabled={!name}>
          加入话题
        </Button>
      </Stack>
    </Stack>
  );
};

export default function PageTopic() {
  const [hash] = useHash();
  const [wallet, setWallet] = useState<MostWallet | null>(null);
  const init = (hash: string) => {
    try {
      const [name, password] = JSON.parse(mp.deBase64(hash.slice(1)));
      setWallet(mostWallet(name, password));
    } catch (error) {
      console.log("hash 解析错误", error);
    }
  };
  useEffect(() => {
    if (hash) {
      init(hash);
    }
  }, [hash]);

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
  return (
    <Box id="page-chat">
      <AppHeader
        title={
          wallet?.username
            ? `${wallet.username}#${wallet.address.slice(-4)}`
            : "话题"
        }
        right={
          <Avatar
            src={
              wallet?.address
                ? mp.topic(wallet.address)
                : "/icons/pwa-512x512.png"
            }
          />
        }
      />
      {wallet ? (
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
        <JoinTopic onUpdate={init} />
      )}
    </Box>
  );
}
