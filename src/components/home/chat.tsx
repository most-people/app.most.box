import "./chat.scss";
import { useState } from "react";
import {
  Box,
  Text,
  Group,
  Avatar,
  Tabs,
  rem,
  Flex,
  Badge,
  ActionIcon,
  Menu,
} from "@mantine/core";
import {
  IconSearch,
  IconPlus,
  IconMessage,
  IconUserPlus,
  IconQrcode,
  IconWallet,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

interface ChatItem {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread?: number;
}

interface TopicItem {
  id: string;
  title: string;
  avatar: string;
  participants: number;
  lastActivity: string;
  unread?: number;
}

export default function HomeChat() {
  const [activeTab, setActiveTab] = useState<string | null>("friends");

  const chatList: ChatItem[] = [
    {
      id: "1",
      name: "赖雅娇",
      avatar: "https://i.pravatar.cc/150?img=1",
      lastMessage: "Totally, I do understand it",
      time: "10:24",
      unread: 1,
    },
    {
      id: "2",
      name: "张喜娟",
      avatar: "https://i.pravatar.cc/150?img=2",
      lastMessage: "Awesome!",
      time: "9:28",
      unread: 65,
    },
    {
      id: "3",
      name: "萧惠萍",
      avatar: "https://i.pravatar.cc/150?img=3",
      lastMessage: "Totally, I do understand it",
      time: "Yesterday",
    },
    {
      id: "4",
      name: "林佩瑜",
      avatar: "https://i.pravatar.cc/150?img=4",
      lastMessage: "Hey there! 👋",
      time: "03 Jul",
    },
    {
      id: "5",
      name: "吴世伟",
      avatar: "https://i.pravatar.cc/150?img=5",
      lastMessage: "Let me know",
      time: "03 Jul",
    },
  ];

  const topicList: TopicItem[] = [
    {
      id: "1",
      title: "前端开发交流",
      avatar: "https://i.pravatar.cc/150?img=20",
      participants: 328,
      lastActivity: "刚刚",
      unread: 10,
    },
    {
      id: "2",
      title: "React vs Vue 讨论",
      avatar: "https://i.pravatar.cc/150?img=21",
      participants: 156,
      lastActivity: "10分钟前",
      unread: 99,
    },
    {
      id: "3",
      title: "TypeScript 学习小组",
      avatar: "https://i.pravatar.cc/150?img=22",
      participants: 89,
      lastActivity: "30分钟前",
    },
    {
      id: "4",
      title: "设计模式分享",
      avatar: "https://i.pravatar.cc/150?img=23",
      participants: 42,
      lastActivity: "1小时前",
    },
    {
      id: "5",
      title: "产品经理吐槽大会",
      avatar: "https://i.pravatar.cc/150?img=24",
      participants: 213,
      lastActivity: "2小时前",
    },
    {
      id: "6",
      title: "移动端适配问题",
      avatar: "https://i.pravatar.cc/150?img=25",
      participants: 76,
      lastActivity: "昨天",
    },
    {
      id: "7",
      title: "后端架构讨论",
      avatar: "https://i.pravatar.cc/150?img=26",
      participants: 118,
      lastActivity: "昨天",
    },
    {
      id: "8",
      title: "UI/UX 设计趋势",
      avatar: "https://i.pravatar.cc/150?img=27",
      participants: 95,
      lastActivity: "前天",
    },
  ];

  return (
    <Tabs value={activeTab} onChange={setActiveTab} variant="outline">
      <Box className="chat-header">
        <Tabs.List>
          <Tabs.Tab
            value="friends"
            fw={500}
            rightSection={
              <Box style={{ position: "relative" }}>
                <Badge
                  color="red"
                  size="xs"
                  variant="filled"
                  style={{
                    position: "absolute",
                    top: -8,
                    right: -8,
                    padding: 0,
                    width: rem(8),
                    height: rem(8),
                    borderRadius: rem(4),
                  }}
                />
              </Box>
            }
          >
            好友
          </Tabs.Tab>
          <Tabs.Tab
            value="groups"
            fw={500}
            rightSection={
              <Box style={{ position: "relative" }}>
                <Badge
                  color="red"
                  size="xs"
                  variant="filled"
                  style={{
                    position: "absolute",
                    top: -8,
                    right: -8,
                    padding: 0,
                    width: rem(8),
                    height: rem(8),
                    borderRadius: rem(4),
                  }}
                />
              </Box>
            }
          >
            话题
          </Tabs.Tab>
        </Tabs.List>

        <Group className="action">
          <ActionIcon
            variant="subtle"
            color="gray"
            onClick={() =>
              notifications.show({
                message: "开发中",
                color: "gray",
              })
            }
          >
            <IconSearch size={24} stroke={1.5} />
          </ActionIcon>
          <Menu
            shadow="md"
            width={200}
            position="bottom-end"
            withArrow
            arrowPosition="center"
          >
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray">
                <IconPlus size={24} stroke={1.5} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item leftSection={<IconMessage size={20} />}>
                加入话题
              </Menu.Item>
              <Menu.Item leftSection={<IconUserPlus size={20} />}>
                添加好友
              </Menu.Item>
              <Menu.Item leftSection={<IconQrcode size={20} />}>
                扫一扫
              </Menu.Item>
              <Menu.Item leftSection={<IconWallet size={20} />}>
                收付款
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Box>

      <Tabs.Panel value="friends">
        <Box className="chats">
          {chatList.map((chat, index) => (
            <Group
              key={index}
              wrap="nowrap"
              justify="space-between"
              className="chat"
            >
              <Group wrap="nowrap">
                <Avatar src={chat.avatar} size="lg" radius="md" />
                <Box>
                  <Text fw={500}>{chat.name}</Text>
                  <Text size="sm" c="dimmed">
                    {chat.lastMessage}
                  </Text>
                </Box>
              </Group>
              <Flex direction="column" align="flex-end" gap={5}>
                <Text size="xs" c="dimmed">
                  {chat.time}
                </Text>
                {chat.unread && (
                  <Badge color="red" size="md" variant="filled" radius="xl">
                    {chat.unread}
                  </Badge>
                )}
              </Flex>
            </Group>
          ))}
        </Box>
      </Tabs.Panel>

      <Tabs.Panel value="groups">
        <Box className="chats">
          {topicList.map((topic, index) => (
            <Group
              key={index}
              wrap="nowrap"
              justify="space-between"
              className="chat"
            >
              <Group wrap="nowrap">
                <Avatar src={topic.avatar} size="lg" radius="md" />
                <Box>
                  <Group gap={8} wrap="nowrap">
                    <Text fw={500}>{topic.title}</Text>
                    {topic.unread && (
                      <Badge color="red" size="xs" variant="filled">
                        {topic.unread}
                      </Badge>
                    )}
                  </Group>
                  <Text size="sm" c="dimmed">
                    {topic.participants} 人参与
                  </Text>
                </Box>
              </Group>
              <Flex direction="column" align="flex-end" gap={5}>
                <Text size="xs" c="dimmed">
                  {topic.lastActivity}
                </Text>
              </Flex>
            </Group>
          ))}
        </Box>
      </Tabs.Panel>
    </Tabs>
  );
}
