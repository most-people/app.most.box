"use client";
import { useState } from "react";
import { Tabs, Text } from "@mantine/core";
import { Icon } from "@/components/Icon";
import HomeMine from "@/components/home/mine";

import "./page.scss";

export default function PageHome() {
  const [activeTab, setActiveTab] = useState<string | null>("chat");

  return (
    <Tabs
      id="page-home"
      variant="pills"
      radius={0}
      value={activeTab}
      onChange={setActiveTab}
    >
      <Tabs.Panel keepMounted value="chat">
        Chat tab content
      </Tabs.Panel>

      <Tabs.Panel keepMounted value="note">
        Note tab content
      </Tabs.Panel>

      <Tabs.Panel keepMounted value="explore">
        Explore tab content
      </Tabs.Panel>

      <Tabs.Panel keepMounted value="mine">
        <HomeMine />
      </Tabs.Panel>

      <Tabs.List>
        <Tabs.Tab value="chat">
          <Icon name={activeTab === "chat" ? "chat-active" : "chat"} />
          <Text>聊天</Text>
        </Tabs.Tab>
        <Tabs.Tab value="note">
          <Icon name={activeTab === "note" ? "note-active" : "note"} />
          <Text>笔记</Text>
        </Tabs.Tab>
        <Tabs.Tab value="explore">
          <Icon name={activeTab === "explore" ? "explore-active" : "explore"} />
          <Text>探索</Text>
        </Tabs.Tab>
        <Tabs.Tab value="mine">
          <Icon name={activeTab === "mine" ? "mine-active" : "mine"} />
          <Text>我的</Text>
        </Tabs.Tab>
      </Tabs.List>
    </Tabs>
  );
}
