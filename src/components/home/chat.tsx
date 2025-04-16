import "./chat.scss";
import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Text,
  Group,
  Avatar,
  Tabs,
  Flex,
  Badge,
  ActionIcon,
  Menu,
  Button,
  Center,
  Divider,
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
import mp from "@/constants/mp";
import dayjs from "dayjs";
import { useFriendStore } from "@/stores/friendStore";
import { useUserStore } from "@/stores/userStore";
import { Friend } from "@/hooks/useFriend";

interface FriendItemProps {
  friend: Friend;
}

export const FriendItem = ({ friend }: FriendItemProps) => {
  const notify = useUserStore((state) => state.notify);
  const readNotify = useUserStore((state) => state.readNotify);

  return (
    <Link
      onClick={() => readNotify(friend.address)}
      href={{
        pathname: "/friend",
        hash: friend.address,
      }}
    >
      <Group wrap="nowrap" justify="space-between" className="chat">
        <Group wrap="nowrap">
          <Avatar src={mp.avatar(friend.address)} size="lg" radius="md" />
          <Box>
            <Group gap={8} wrap="nowrap">
              <Text fw={500}>{friend.username}</Text>

              {notify[friend.address] && (
                <Box style={{ position: "relative" }}>
                  <Badge
                    color="red"
                    size="xs"
                    variant="filled"
                    className="badge-notify"
                  />
                </Box>
              )}
            </Group>
            <Text size="sm" c="dimmed">
              {notify[friend.address]
                ? notify[friend.address].value.text
                : mp.formatAddress(friend.address)}
            </Text>
          </Box>
        </Group>
        <Flex direction="column" align="flex-end" gap={5}>
          <Text size="xs" c="dimmed">
            {notify[friend.address] &&
              mp.formatDate(notify[friend.address].timestamp)}
          </Text>
        </Flex>
      </Group>
    </Link>
  );
};

export default function HomeChat() {
  const [chatTab, setChatTab] = useState<string | null>("friends");

  const topics = useTopicStore((state) => state.topics);
  const topicInfo = useTopicStore((state) => state.topicInfo);
  const friends = useFriendStore((state) => state.friends);
  const wallet = useUserStore((state) => state.wallet);
  const notify = useUserStore((state) => state.notify);

  const tabChange = (value: string | null) => {
    setChatTab(value);
    localStorage.setItem("chatTab", value || "friends");
  };

  useEffect(() => {
    const activeTab = localStorage.getItem("chatTab");
    setChatTab(activeTab || "friends");
  }, []);

  const friendNotify = useMemo(() => {
    for (const address in notify) {
      const item = notify[address];
      if (item.value.type === "friend") {
        return 1;
      }
    }
    return 0;
  }, [notify]);

  const greeters = useMemo(() => {
    const list: Friend[] = [];
    for (const address in notify) {
      const item = notify[address];
      if (item.value.type === "friend") {
        if (friends.some((friend) => friend.address === address) === false) {
          list.push({
            address,
            username: item.value.username,
            public_key: item.value.public_key,
            timestamp: item.timestamp,
          });
        }
      }
    }
    return list;
  }, [notify, friends]);

  return (
    <Tabs value={chatTab} onChange={tabChange} variant="outline">
      <Box className="chat-header">
        <Tabs.List>
          <Tabs.Tab
            value="friends"
            fw={500}
            rightSection={
              friendNotify > 0 && (
                <Box style={{ position: "relative" }}>
                  <Badge
                    color="red"
                    size="xs"
                    variant="filled"
                    className="badge-notify"
                  />
                </Box>
              )
            }
          >
            好友
          </Tabs.Tab>
          <Tabs.Tab
            value="topics"
            fw={500}
            rightSection={
              <Box style={{ position: "relative" }}>
                <Badge
                  color="red"
                  size="xs"
                  variant="filled"
                  className="badge-notify"
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
            onClick={() => notifications.show({ message: "开发中" })}
          >
            <IconSearch size={24} stroke={1.5} />
          </ActionIcon>
          <Menu
            shadow="md"
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
          {friends.map((friend) => (
            <FriendItem key={friend.address} friend={friend} />
          ))}
        </Box>
        {greeters.length > 0 && (
          <Divider my="lg" label="打招呼" labelPosition="center" />
        )}
        <Box className="chats">
          {greeters.map((friend) => (
            <FriendItem key={friend.address} friend={friend} />
          ))}
        </Box>
        {!wallet && (
          <Center>
            <Button variant="gradient" component={Link} href="/login">
              去登录
            </Button>
          </Center>
        )}

        {wallet && friends.length === 0 && greeters.length === 0 && (
          <Center>
            <Button variant="gradient" component={Link} href="/friend">
              添加好友
            </Button>
          </Center>
        )}
      </Tabs.Panel>

      <Tabs.Panel value="topics">
        <Box className="chats">
          {topics.map((topic) => (
            <Link
              key={topic.address}
              href={{
                pathname: "/topic",
                hash: mp.topicJoin(topic.name, topic.password),
              }}
            >
              <Group wrap="nowrap" justify="space-between" className="chat">
                <Group wrap="nowrap">
                  <Avatar src={mp.topic(topic.address)} size="lg" radius="md" />
                  <Box>
                    <Group gap={8} wrap="nowrap">
                      <Text fw={500}>{topic.name}</Text>
                      <Box style={{ position: "relative" }}>
                        <Badge
                          color="red"
                          size="xs"
                          variant="filled"
                          className="badge-notify"
                        />
                      </Box>
                    </Group>
                    {topicInfo[topic.address] && (
                      <Text size="sm" c="dimmed">
                        {Object.keys(topicInfo[topic.address]).length} 人参与
                      </Text>
                    )}
                  </Box>
                </Group>
                <Flex direction="column" align="flex-end" gap={5}>
                  <Text size="xs" c="dimmed">
                    {dayjs(topic.timestamp).fromNow()}
                  </Text>
                </Flex>
              </Group>
            </Link>
          ))}
        </Box>
        {!wallet && (
          <Center>
            <Button variant="gradient" component={Link} href="/login">
              去登录
            </Button>
          </Center>
        )}

        {wallet && topics.length === 0 && (
          <Center>
            <Button variant="gradient" component={Link} href="/topic">
              加入话题
            </Button>
          </Center>
        )}
      </Tabs.Panel>
    </Tabs>
  );
}
