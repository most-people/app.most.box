"use client";

import { useDisclosure } from "@mantine/hooks";
import {
  Text,
  Input,
  Button,
  Stack,
  Divider,
  PasswordInput,
  Avatar,
  Anchor,
} from "@mantine/core";

import "./login.scss";
import Link from "next/link";

export default function LoginPage() {
  const [visible, { toggle }] = useDisclosure(true);

  return (
    <div id="page-login">
      <Stack gap="md">
        <div className="header">
          <Text size="xl" fw={500}>
            Most.Box
          </Text>
          <br />
          <Avatar size="xl" src="/icons/most.png" alt="it's me" />
        </div>
        <Stack gap="md">
          <Input autoFocus placeholder="请输入用户名" />
          <PasswordInput
            placeholder="请输入密码"
            visible={visible}
            onVisibilityChange={toggle}
          />
          <Button fullWidth component={Link} href="/">
            登录
          </Button>
          <Divider label="Or" labelPosition="center" />
          <Button variant="default" loading loaderProps={{ type: "dots" }}>
            连接钱包
          </Button>
          <Anchor
            component={Link}
            href="/about"
            style={{ textAlign: "center" }}
          >
            完全去中心化，无需注册
          </Anchor>
        </Stack>
      </Stack>
    </div>
  );
}
