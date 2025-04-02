import { Box, Group, ActionIcon, Textarea } from "@mantine/core";
import { IconMicrophone, IconMoodSmile, IconPlus } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import { Message } from "@/hooks/useFriend";
import { useUserStore } from "@/stores/userStore";

interface MessagesProps {
  messages: Message[];
  onSend: (text: string) => void;
}

export const Messages = ({ messages, onSend }: MessagesProps) => {
  const [text, setText] = useState("");
  const wallet = useUserStore((state) => state.wallet);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 消息列表更新时自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
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
        <Box ref={messagesEndRef} />
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
          value={text}
          onChange={(event) => setText(event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              if (event.shiftKey) return;
              event.preventDefault();
              if (text.trim()) {
                onSend(text);
                setText("");
              }
            }
          }}
        />
        <ActionIcon variant="subtle" color="gray" size="lg">
          <IconMicrophone size={24} />
        </ActionIcon>
        <ActionIcon variant="subtle" color="gray" size="lg">
          <IconPlus size={24} />
        </ActionIcon>
      </Group>
    </>
  );
};
