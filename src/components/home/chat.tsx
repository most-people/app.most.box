import "./chat.scss";
import { useEffect, useState } from "react";
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
import Link from "next/link";
import { useTopicStore } from "@/stores/topicStore";
import { useUserStore } from "@/stores/userStore";
import mp from "@/constants/mp";
import { mostWallet } from "dot.most.box";
import dayjs from "dayjs";

interface ChatItem {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread?: number;
}

export default function HomeChat() {
  const [activeTab, setActiveTab] = useState<string | null>("friends");

  const dot = useUserStore((state) => state.dot);
  const initTopic = useTopicStore((state) => state.init);
  const topics = useTopicStore((state) => state.topics);

  useEffect(() => {
    if (dot) {
      initTopic(dot);
    }
  }, [dot]);

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
            width={140}
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
              <Menu.Item
                leftSection={<IconMessage size={24} />}
                component={Link}
                href="/topic"
              >
                <Text>加入话题</Text>
              </Menu.Item>
              <Menu.Item
                leftSection={<IconUserPlus size={24} />}
                component={Link}
                href="/friend"
              >
                <Text>添加好友</Text>
              </Menu.Item>
              <Menu.Item
                leftSection={<IconQrcode size={24} />}
                component={Link}
                href="/scan"
              >
                <Text>扫一扫</Text>
              </Menu.Item>
              <Menu.Item
                leftSection={<IconWallet size={24} />}
                component={Link}
                href="/pay"
              >
                <Text>收付款</Text>
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
          {topics.map((topic) => (
            <Group
              key={`${topic.name}-${topic.password}`}
              wrap="nowrap"
              justify="space-between"
              className="chat"
            >
              <Group wrap="nowrap">
                <Avatar
                  src={mp.topic(mostWallet(topic.name, topic.password).address)}
                  size="lg"
                  radius="md"
                />
                <Box>
                  <Group gap={8} wrap="nowrap">
                    <Text fw={500}>{topic.name}</Text>

                    <Badge color="red" size="xs" variant="filled">
                      99
                    </Badge>
                  </Group>
                  <Text size="sm" c="dimmed">
                    100 人参与
                  </Text>
                </Box>
              </Group>
              <Flex direction="column" align="flex-end" gap={5}>
                <Text size="xs" c="dimmed">
                  {dayjs(topic.timestamp).fromNow()}
                </Text>
              </Flex>
            </Group>
          ))}
        </Box>
      </Tabs.Panel>
    </Tabs>
  );
}
