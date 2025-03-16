"use client";
import { Button, Tabs, Text } from "@mantine/core";
import "./home.scss";

import {
  IconHome,
  IconMessage,
  IconUsers,
  IconUser,
} from "@tabler/icons-react";
import Link from "next/link";

export default function PageHome() {
  return (
    <Tabs id="page-home" variant="pills" radius={0} defaultValue="chat">
      <Tabs.Panel keepMounted value="chat">
        <Button variant="gradient" component={Link} href="/login">
          去登录
        </Button>
      </Tabs.Panel>

      <Tabs.Panel keepMounted value="note">
        Note tab content
      </Tabs.Panel>

      <Tabs.Panel keepMounted value="explore">
        Explore tab content
      </Tabs.Panel>

      <Tabs.Panel keepMounted value="mine">
        Mine tab content
      </Tabs.Panel>

      <Tabs.List>
        <Tabs.Tab value="chat">
          <IconMessage />
          <Text>聊天</Text>
        </Tabs.Tab>
        <Tabs.Tab value="note">
          <IconUsers />
          <Text>笔记</Text>
        </Tabs.Tab>
        <Tabs.Tab value="explore">
          <IconHome />
          <Text>探索</Text>
        </Tabs.Tab>
        <Tabs.Tab value="mine">
          <IconUser />
          <Text>我的</Text>
        </Tabs.Tab>
      </Tabs.List>
    </Tabs>
  );
}
