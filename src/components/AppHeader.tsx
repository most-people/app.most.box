"use client";
import { Text, Group, ActionIcon } from "@mantine/core";
import { Icon } from "@/components/Icon";
import { useUserStore } from "@/stores/userStore";
import { useRouter, usePathname } from "next/navigation";

interface AppHeaderProps {
  title: string | string[];
  action?: React.ReactNode;
}
export const AppHeader = ({ title, action }: AppHeaderProps) => {
  const firstPath = useUserStore((state) => state.firstPath);
  const setItem = useUserStore((state) => state.setItem);
  const router = useRouter();
  const pathname = usePathname();
  const back = () => {
    if (firstPath === pathname) {
      setItem("firstPath", "/");
      router.replace("/");
    } else {
      router.back();
    }
  };

  return (
    <Group maw={404} p={20} w={"100%"} justify="space-between">
      <ActionIcon variant="transparent" onClick={back} color="--text-color">
        <Icon name="back" size={24} />
      </ActionIcon>
      <Text>{title}</Text>
      <ActionIcon variant="transparent" color="--text-color">
        <Icon name="more" size={24} />
      </ActionIcon>
    </Group>
  );
};
