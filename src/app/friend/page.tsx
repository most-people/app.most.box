"use client";

import {
  Text,
  Button,
  Stack,
  Avatar,
  Box,
  Space,
  Textarea,
  ActionIcon,
  Group,
} from "@mantine/core";
import { IconMicrophone, IconMoodSmile, IconPlus } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import mp from "@/constants/mp";
import { AppHeader } from "@/components/AppHeader";
import { useRouter } from "next/navigation";
import "@/app/friend/chat.scss";
import { getAddress, isAddress, ZeroAddress } from "ethers";
import { useFriendStore } from "@/stores/friendStore";
import { useUserStore } from "@/stores/userStore";
import { useEffect, useState } from "react";
import { useHash } from "@mantine/hooks";
import { useFriend } from "@/hooks/useFriend";

const AddFriend = () => {
  const router = useRouter();
  const dotClient = useUserStore((state) => state.dotClient);
  const addFriend = useFriendStore((state) => state.addFriend);

  const form = useForm({
    initialValues: {
      address: "",
    },
    validate: {
      address: (value) => (!isAddress(value) ? "请输入有效的以太坊地址" : null),
    },
  });

  const submit = () => {
    if (!form.validate().hasErrors) {
      const address = getAddress(form.values.address);
      const dot = dotClient?.dot(address);
      if (dot) {
        dot.on("info", (info) => {
          if (info.username && info.public_key) {
            dot.off("info");
            router.replace(`/friend#${address}`);
            addFriend(info.username, address, info.public_key);
          }
        });
      }
    }
  };

  return (
    <Stack gap="md" className="add-box">
      <Box className="header">
        <Text size="xl" fw={500}></Text>
        <Space h="sx" />
        <Avatar
          size="xl"
          radius="md"
          src={
            isAddress(form.values.address)
              ? mp.avatar(form.values.address)
              : "/icons/pwa-512x512.png"
          }
          alt="it's me"
        />
      </Box>
      <form onSubmit={form.onSubmit(submit)}>
        <Stack gap="md">
          <Textarea
            withAsterisk
            label="好友地址"
            placeholder={ZeroAddress}
            rows={2}
            maxLength={42}
            {...form.getInputProps("address")}
          />
          <Button type="submit" disabled={!form.values.address}>
            查找好友
          </Button>
        </Stack>
      </form>
    </Stack>
  );
};

export default function PageFriend() {
  const [hash] = useHash();
  const [friendAddress, setFriendAddress] = useState("");
  const wallet = useUserStore((state) => state.wallet);
  const { friend, messages } = useFriend(friendAddress);

  useEffect(() => {
    if (hash) {
      if (isAddress(hash.slice(1))) {
        setFriendAddress(hash.slice(1));
      }
    }
  }, [hash]);

  return (
    <Box id="page-chat">
      <AppHeader
        title={
          friend ? `${friend.username}#${friendAddress.slice(-4)}` : "好友"
        }
        right={
          <Avatar
            src={
              friendAddress
                ? mp.avatar(friendAddress)
                : "/icons/pwa-512x512.png"
            }
          />
        }
      />
      {friend?.public_key ? (
        <>
          <Box className="messages">
            {messages.map((message) => (
              <Box
                key={message.timestamp}
                className={`message ${
                  message.address === wallet?.address ? "me" : ""
                }`}
              >
                <Box className="content">{message.text}</Box>
              </Box>
            ))}
          </Box>

          <Group gap="xs" className="message-input">
            <ActionIcon variant="subtle" color="gray" size="lg">
              <IconMoodSmile size={24} />
            </ActionIcon>
            <Textarea
              placeholder="输入消息..."
              size="md"
              radius="md"
              autosize
              maxRows={4}
              style={{ flex: 1 }}
            />
            <ActionIcon variant="subtle" color="gray" size="lg">
              <IconMicrophone size={24} />
            </ActionIcon>
            <ActionIcon variant="subtle" color="gray" size="lg">
              <IconPlus size={24} />
            </ActionIcon>
          </Group>
        </>
      ) : (
        <AddFriend />
      )}
    </Box>
  );
}
