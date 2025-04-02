"use client";

import {
  Text,
  Button,
  Stack,
  Avatar,
  Box,
  Space,
  Textarea,
} from "@mantine/core";
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
  const [info, setInfo] = useState({
    username: "",
    public_key: "",
  });
  const [address, setAddress] = useState("");
  const dotClient = useUserStore((state) => state.dotClient);

  useEffect(() => {
    if (hash) {
      if (isAddress(hash.slice(1))) {
        setAddress(hash.slice(1));
      }
    }
  }, [hash]);

  useEffect(() => {
    if (dotClient && address) {
      const dot = dotClient.dot(address);
      dot.on("info", (data) => {
        if (data.username && data.public_key) {
          setInfo(data);
          dot.off("info");
        }
      });
    }
  }, [dotClient, address]);
  return (
    <Box id="page-chat">
      <AppHeader
        title={`${info.username}#${address.slice(-4)}` || "好友"}
        right={
          <Avatar
            src={address ? mp.avatar(address) : "/icons/pwa-512x512.png"}
          />
        }
      />
      {info.public_key ? <h1>{address}</h1> : <AddFriend />}
    </Box>
  );
}
