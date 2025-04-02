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
  Group,
} from "@mantine/core";
import { useEffect, useState } from "react";
import mp from "@/constants/mp";
import { MostWallet, mostWallet } from "dot.most.box";
import { AppHeader } from "@/components/AppHeader";
import { useRouter } from "next/navigation";
import { useTopicStore } from "@/stores/topicStore";
import "./topic.scss";

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
    <Stack gap="md">
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
  return (
    <Box id="page-topic">
      <AppHeader
        title={wallet?.username || "话题"}
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
      {wallet ? <h1>{wallet.address}</h1> : <JoinTopic onUpdate={init} />}
    </Box>
  );
}
