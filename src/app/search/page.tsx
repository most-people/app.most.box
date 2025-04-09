"use client";
import { useSearchParams } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { Box, Center, Space, Text } from "@mantine/core";

export default function UpdatePage() {
  const query = useSearchParams();

  return (
    <Box>
      <AppHeader title="搜索" />
      <Center>
        <Text size="lg">Search</Text>
        <Space w={10}></Space>
        <Text c="dimmed">{query.get("q")}</Text>
      </Center>
    </Box>
  );
}
