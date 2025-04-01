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
} from "@mantine/core";

import "./login.scss";
import { useState } from "react";
import mp from "@/constants/mp";
import { mostWallet } from "dot.most.box";
import { AppHeader } from "@/components/AppHeader";

export default function PageLogin() {
  const [visible, { toggle }] = useDisclosure(true);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const login = (name: string, password: string) => {
    // back();
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
          <PasswordInput
            placeholder="话题密码"
            visible={visible}
            onVisibilityChange={toggle}
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
          />
          <Button onClick={() => login(name, password)}>加入话题</Button>
        </Stack>
      </Stack>
    </Box>
  );
}
