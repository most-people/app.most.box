"use client";

import { useDisclosure } from "@mantine/hooks";
import {
  Text,
  Input,
  Button,
  Stack,
  Divider,
  PasswordInput,
} from "@mantine/core";

import "./login.scss";

export default function LoginPage() {
  const [visible, { toggle }] = useDisclosure(true);

  return (
    <div id="page-login">
      <Stack gap="md">
        <div className="header">
          <Text size="xl" fw={500}>
            Most.Box
          </Text>
          <Text>完全去中心化，无需注册</Text>
        </div>
        <Stack gap="md">
          <Input placeholder="请输入用户名" />
          <PasswordInput
            placeholder="请输入密码"
            visible={visible}
            onVisibilityChange={toggle}
          />
          <Button fullWidth>登录</Button>
          <Divider label="Or" labelPosition="center" />
          <Button variant="default">连接钱包</Button>
        </Stack>
      </Stack>
    </div>
  );
}
