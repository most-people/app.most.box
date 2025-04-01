"use client";

import { useDisclosure } from "@mantine/hooks";
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

import "./login.scss";
import { useState } from "react";
import mp from "@/constants/mp";
import { mostWallet } from "dot.most.box";
import { AppHeader } from "@/components/AppHeader";
import { useRouter } from "next/navigation";
import { useTopicStore } from "@/stores/topicStore";

export default function PageLogin() {
  const router = useRouter();
  const [visible, { toggle }] = useDisclosure(false);

  const join = useTopicStore((state) => state.join);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isEncrypted, setIsEncrypted] = useState(false);

  const submit = () => {
    const query = new URLSearchParams();
    query.set("name", name);
    if (isEncrypted && password) {
      query.set("password", password);
    }
    router.replace(`/topic?${query.toString()}`);
    join(name, password);
  };

  return (
    <Box id="page-topic">
      <AppHeader title="话题" />
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
    </Box>
  );
}
