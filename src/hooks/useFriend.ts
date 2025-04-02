import { useUserStore } from "@/stores/userStore";
import { DotMethods, mostDecode, mostEncode } from "dot.most.box";
import { startTransition, useEffect, useState } from "react";

export interface Message {
  text: string;
  address: string;
  timestamp: number;
}

export interface Friend {
  address: string;
  username: string;
  public_key: string;
  timestamp?: number;
}

export const useFriend = (friendAddress: string) => {
  const wallet = useUserStore((state) => state.wallet);
  const dotClient = useUserStore((state) => state.dotClient);
  const dot = useUserStore((state) => state.dot);

  const [myMessages, setMyMessages] = useState<Message[]>([]);
  const [friendMessages, setFriendMessages] = useState<Message[]>([]);

  const messages = [...myMessages, ...friendMessages];

  const [friend, setFriend] = useState<Friend | null>(null);
  const [friendDot, setFriendDot] = useState<DotMethods | null>(null);

  useEffect(() => {
    if (dot && friend && friendDot && wallet) {
      // 监听消息
      let t = 0;
      dot.on(friend.address, (data, timestamp) => {
        if (timestamp > t) {
          t = timestamp;
          // 检查数据
          try {
            data = JSON.parse(
              mostDecode(data, friend.public_key, wallet.private_key)
            );
            if (
              Array.isArray(data) &&
              data.every((item) => typeof item?.timestamp === "number")
            ) {
              startTransition(() => setMyMessages(data));
            }
          } catch (error) {
            console.log("解析json失败", error);
          }
        }
      });

      // 判断是否是自己
      if (friend.address !== wallet.address) {
        let t = 0;
        friendDot.on(wallet.address, (data, timestamp) => {
          if (timestamp > t) {
            t = timestamp;
            // 检查数据
            try {
              data = JSON.parse(
                mostDecode(data, friend.public_key, wallet.private_key)
              );
              if (
                Array.isArray(data) &&
                data.every((item) => typeof item?.timestamp === "number")
              ) {
                startTransition(() => setFriendMessages(data));
              }
            } catch (error) {
              console.log("解析json失败", error);
            }
          }
        });
      }

      // 清理监听器，防止内存泄漏
      return () => {
        dot.off(friend.address);
        friendDot.off(wallet.address);
      };
    }
  }, [dot, friend, friendDot, wallet]);

  useEffect(() => {
    if (friendAddress && dotClient) {
      const friendDot = dotClient.dot(friendAddress);
      setFriendDot(friendDot);
      let t = 0;
      friendDot.on("info", (info, timestamp) => {
        if (timestamp > t) {
          t = timestamp;
          const username = info?.username;
          const public_key = info?.public_key;
          if (username && public_key) {
            // 成功获取，停止监听
            friendDot.off("info");
            setFriend({ address: friendAddress, username, public_key });
          }
        }
      });

      return () => {
        friendDot.off("info");
      };
    }
  }, [friendAddress, dotClient]);

  const send = (text: string) => {
    if (wallet && dot && friend) {
      const timestamp = Date.now();
      const newMessage = {
        text,
        address: wallet.address,
        timestamp,
      };
      // 更新数据
      const data = JSON.stringify([...myMessages, newMessage]);
      dot.put(
        friendAddress,
        mostEncode(data, friend.public_key, wallet.private_key)
      );
    }
  };

  const del = (timestamp: number) => {
    if (wallet && dot && friend) {
      // 更新数据
      const data = JSON.stringify(
        myMessages.filter((item) => item.timestamp !== timestamp)
      );
      dot.put(
        friendAddress,
        mostEncode(data, friend.public_key, wallet.private_key)
      );
    }
  };

  return { friend, messages, send, del };
};
