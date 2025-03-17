"use client";

import {
  Avatar,
  Text,
  Stack,
  Group,
  Box,
  Button,
  ActionIcon,
} from "@mantine/core";
import { Icon, type IconName } from "@/components/Icon";
import { notifications } from "@mantine/notifications";
import Link from "next/link";
import "./mine.scss";

export default function HomeMine() {
  return (
    <div id="home-mine">
      <div className="header">
        <Group>
          <Avatar size="md" src="/icons/pwa-512x512.png" alt="most.box" />
          <div>
            <Text size="lg" fw={500}>
              Most.Box
            </Text>
            <Text size="sm" c="dimmed">
              地址: 0x0000...0000
            </Text>
          </div>

          <ActionIcon
            ml={"auto"}
            variant="transparent"
            color="inherit"
            onClick={() =>
              notifications.show({
                title: "二维码",
                message: "开发中，快催我们",
                color: "gray",
              })
            }
          >
            <Icon name="qr-code" size={18} />
          </ActionIcon>
        </Group>
      </div>
      <Stack className="menu-list" mb="xs">
        <MenuItem icon="web3" label="Web3" link="/web3" />
      </Stack>
      <Stack className="menu-list" gap={0}>
        <MenuItem icon="about" label="关于" link="/about" />
        <MenuItem icon="setting" label="设置" link="/setting" />
        <MenuItem icon="join" label="志同道合" link="/join" />
        <MenuItem icon="download" label="应用更新" link="/update" />
      </Stack>
      <Stack className="menu-list" mt="xs">
        <MenuItem icon="exit" label="去登录" link="/login" />
      </Stack>
    </div>
  );
}

interface MenuItemProps {
  icon: IconName;
  label: string;
  link: string;
}

function MenuItem({ icon, label, link }: MenuItemProps) {
  return (
    <Box component={Link} href={link} className="menu-item">
      <Group>
        <Icon name={icon} size={32} />
        <Text>{label}</Text>
      </Group>
      <Icon name="arrow" size={18} />
    </Box>
  );
}
