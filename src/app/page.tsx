"use client";
import { useEffect, useState } from "react";
import { Tabs, Text } from "@mantine/core";
import { Icon } from "@/components/Icon";
import HomeMine from "@/components/home/mine";
import HomeChat from "@/components/home/chat";

import "./page.scss";
import HomeNote from "@/components/home/note";
import HomeExplore from "@/components/home/explore";

export default function PageHome() {
  const [homeTab, setHomeTab] = useState<string | null>(null);

  const tabChange = (value: string | null) => {
    setHomeTab(value);
    localStorage.setItem("homeTab", value || "chat");
  };

  useEffect(() => {
    const activeTab = localStorage.getItem("homeTab");
    setHomeTab(activeTab || "chat");
  }, []);

  return (
    <Tabs
      id="page-home"
      variant="pills"
      radius={0}
      value={homeTab}
      onChange={tabChange}
    >
      <Tabs.Panel keepMounted value="chat">
        <HomeChat />
      </Tabs.Panel>

      <Tabs.Panel keepMounted value="note">
        <HomeNote />
      </Tabs.Panel>

      <Tabs.Panel keepMounted value="explore">
        <HomeExplore />
      </Tabs.Panel>

      <Tabs.Panel keepMounted value="mine">
        <HomeMine />
      </Tabs.Panel>

      <Tabs.List>
        <Tabs.Tab value="chat">
          <Icon name={homeTab === "chat" ? "chat-active" : "chat"} />
          <Text>聊天</Text>
        </Tabs.Tab>
        <Tabs.Tab value="note">
          <Icon name={homeTab === "note" ? "note-active" : "note"} />
          <Text>笔记</Text>
        </Tabs.Tab>
        <Tabs.Tab value="explore">
          <Icon name={homeTab === "explore" ? "explore-active" : "explore"} />
          <Text>探索</Text>
        </Tabs.Tab>
        <Tabs.Tab value="mine">
          <Icon name={homeTab === "mine" ? "mine-active" : "mine"} />
          <Text>我的</Text>
        </Tabs.Tab>
      </Tabs.List>
    </Tabs>
  );
}
