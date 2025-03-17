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
import { useState } from "react";
import mp from "@/constants/mp";
import { mostWallet } from "dot.most.box";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/userStore";

export default function LoginPage() {
  const router = useRouter();
  const [visible, { toggle }] = useDisclosure(true);

  const setItem = useUserStore((state) => state.setItem);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    if (username) {
      const wallet = mp.login(username, password);
      if (wallet) {
        setTimeout(() => {
          setItem("wallet", wallet);
        }, 0);
      }
    }

    if (window.history.length > 1) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  return (
    <div id="page-login">
      <Stack gap="md">
        <div className="header">
          <Text size="xl" fw={500}>
            Most.Box
          </Text>
          <br />
          <Avatar
            size="xl"
            radius="md"
            src={
              username
                ? mp.avatar(mostWallet(username, password).address)
                : "/icons/pwa-512x512.png"
            }
            alt="it's me"
          />
        </div>
        <Stack gap="md">
          <Input
            autoFocus
            placeholder="请输入用户名"
            value={username}
            onChange={(event) => setUsername(event.currentTarget.value)}
          />
          <PasswordInput
            placeholder="请输入密码"
            visible={visible}
            onVisibilityChange={toggle}
            value={password}
            onChange={(event) => setPassword(event.currentTarget.value)}
          />
          <Button fullWidth onClick={login}>
            {username ? "登录" : "游客"}
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
