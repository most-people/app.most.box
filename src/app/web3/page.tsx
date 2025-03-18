"use client";
import { useState } from "react";
import {
  Container,
  Text,
  Title,
  Stack,
  Anchor,
  ActionIcon,
} from "@mantine/core";
import { useUserStore } from "@/stores/userStore";
import { AppHeader } from "@/components/AppHeader";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import Link from "next/link";

export default function Web3Page() {
  const wallet = useUserStore((state) => state.wallet);
  const [showX25519, setShowX25519] = useState(false);

  return (
    <Container>
      <AppHeader title="web3" />
      <Stack gap="md">
        <Title order={2}>Web3</Title>
        <Text>
          旨在重塑互联网生态，将用户的控制权和数据所有权还给个人，推动更加公平和透明的人类社会发展。
        </Text>

        <Anchor component={Link} href="/web3/tools">
          <Text>工具集</Text>
        </Anchor>

        <Title order={3}>ETH 地址</Title>
        <Text>{wallet?.address}</Text>

        <Title order={3}>x25519 公钥</Title>
        <Text>{wallet?.public_key}</Text>

        <Title order={3}>
          x25519 私钥
          <ActionIcon
            variant="subtle"
            size="sm"
            ml="xs"
            onClick={() => setShowX25519(!showX25519)}
          >
            {showX25519 ? <IconEye size={16} /> : <IconEyeOff size={16} />}
          </ActionIcon>
        </Title>
        <Text>{showX25519 ? wallet?.private_key : "-"}</Text>
      </Stack>
    </Container>
  );
}
