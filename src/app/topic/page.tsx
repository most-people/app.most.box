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
import { useTopic } from "@/hooks/useTopic";
import { useUserStore } from "@/stores/userStore";

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
  const wallet = useUserStore((state) => state.wallet);

  const [hash] = useHash();
  const [topicWallet, setTopicWallet] = useState<MostWallet | null>(null);
  const init = (hash: string) => {
    try {
      const [name, password] = JSON.parse(mp.deBase64(hash.slice(1)));
      setTopicWallet(
        mostWallet(
          "most.box#" + name,
          password,
          "I know loss mnemonic will lose my wallet."
        )
      );
    } catch (error) {
      console.log("hash 解析错误", error);
    }
  };

  const { messages } = useTopic(topicWallet);
  useEffect(() => {
    if (hash) {
      init(hash);
    }
  }, [hash]);

  return (
    <Box id="page-chat">
      <AppHeader
        title={
          topicWallet
            ? `${topicWallet.username}#${topicWallet.address.slice(-4)}`
            : "话题"
        }
        right={
          <Avatar
            src={
              topicWallet
                ? mp.topic(topicWallet.address)
                : "/icons/pwa-512x512.png"
            }
          />
        }
      />
      {topicWallet ? (
        <>
          <Box className="messages">
            {messages.map((message) => (
              <Box
                key={message.timestamp}
                className={`message ${
                  message.address === wallet?.address ? "me" : ""
                }`}
              >
                <Box className="content">{message.text}</Box>
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
