import "./chat.scss";
import { useState } from "react";
import {
  Box,
  Text,
  Group,
  Avatar,
  Stack,
  Tabs,
  rem,
  Flex,
  Badge,
} from "@mantine/core";
import { IconSearch, IconPlus } from "@tabler/icons-react";

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
          <IconSearch size={24} stroke={1.5} />
          <IconPlus size={24} stroke={1.5} />
        </Group>
      </Box>

      <Tabs.Panel value="friends">
        <Stack gap="xs" mt="md">
          {chatList.map((chat, index) => (
            <Group key={index} wrap="nowrap" justify="space-between">
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
        </Stack>
      </Tabs.Panel>

      <Tabs.Panel value="groups">
        <Stack gap="xs" mt="md">
          {chatList.map((chat, index) => (
            <Group key={index} wrap="nowrap" justify="space-between">
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
        </Stack>
      </Tabs.Panel>
    </Tabs>
  );
}
