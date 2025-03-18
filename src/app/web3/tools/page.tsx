"use client";
import { useEffect, useState } from "react";
import {
  Container,
  TextInput,
  Button,
  Text,
  Paper,
  Stack,
  Table,
  Avatar,
  Input,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { mostWallet } from "dot.most.box";
import { HDNodeWallet } from "ethers";
import { QRCodeCanvas } from "qrcode.react";
import { AppHeader } from "@/components/AppHeader";
import mp from "@/constants/mp";

interface DeriveAddress {
  index: number;
  address: string;
  privateKey: string;
}

export default function Web3ToolPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState(mp.ZeroAddress);
  const [mnemonic, setMnemonic] = useState("");
  const [showAddress, setShowAddress] = useState(false);
  const [showMnemonic, setShowMnemonic] = useState(false);

  const [deriveAddressList, setDeriveAddressList] = useState<DeriveAddress[]>(
    []
  );
  const [deriveIndex, setDeriveIndex] = useState(0);
  const [deriveShowIndex, setDeriveShowIndex] = useState(true);
  const [deriveShowAddress, setDeriveShowAddress] = useState(true);
  const [deriveShowPrivateKey, setDeriveShowPrivateKey] = useState(false);

  useEffect(() => {
    if (username) {
      const danger = mostWallet(
        username,
        password,
        "I know loss mnemonic will lose my wallet."
      );
      setAddress(danger.address);
      setMnemonic(danger.mnemonic);
    } else {
      setAddress(mp.ZeroAddress);
      setMnemonic("");
    }
    setDeriveAddressList([]);
    setDeriveIndex(0);
    setDeriveShowAddress(true);
    setDeriveShowAddress(true);
    setDeriveShowPrivateKey(false);
  }, [username, password]);

  const deriveAddress = () => {
    const list: DeriveAddress[] = [];
    for (let i = deriveIndex; i < deriveIndex + 10; i++) {
      const path = `m/44'/60'/0'/0/${i}`;
      const wallet = HDNodeWallet.fromPhrase(mnemonic, undefined, path);
      list.push({
        index: i,
        address: wallet.address,
        privateKey: wallet.privateKey,
      });
    }
    setDeriveAddressList((prev) => [...prev, ...list]);
    setDeriveIndex(deriveIndex + 10);
    notifications.show({ message: "已派生10个地址" });
  };

  return (
    <Container maw={1200} w="100%" mt={64} p={20}>
      <AppHeader title="工具集" />
      <Stack gap="md">
        <Avatar
          size={100}
          radius="sm"
          src={
            username
              ? mp.avatar(mostWallet(username, password).address)
              : "/icons/pwa-512x512.png"
          }
          alt="it's me"
        />

        <Text size="xl">Most Wallet 账户查询</Text>

        <Text>
          开源代码：https://www.npmjs.com/package/dot.most.box?activeTab=code
        </Text>

        <Input
          placeholder="请输入用户名"
          maxLength={36}
          value={username}
          onChange={(e) => setUsername(e.currentTarget.value)}
          rightSectionPointerEvents="auto"
          rightSection={
            username ? (
              <Input.ClearButton onClick={() => setUsername("")} />
            ) : undefined
          }
        />

        <Input
          placeholder="请输入密码"
          maxLength={100}
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          rightSectionPointerEvents="auto"
          rightSection={
            password ? (
              <Input.ClearButton onClick={() => setPassword("")} />
            ) : undefined
          }
        />

        <Button
          color="gray"
          variant="outline"
          disabled={!username}
          onClick={() => setShowAddress(!showAddress)}
        >
          {showAddress ? "隐藏二维码" : "显示二维码"}
        </Button>

        {showAddress && (
          <Paper
            p={10}
            withBorder
            style={{
              display: "flex",
              alignSelf: "center",
              backgroundColor: "white",
            }}
          >
            <QRCodeCanvas value={address} size={200} />
          </Paper>
        )}

        <Text size="lg">ETH 地址：{address}</Text>

        <Button
          color="gray"
          onClick={() => setShowMnemonic(!showMnemonic)}
          disabled={!username}
        >
          {showMnemonic ? "隐藏助记词" : "显示助记词"}
        </Button>

        <Paper p="md" bg="red.1" c="var(--red)">
          {showMnemonic
            ? mnemonic || "请输入用户名"
            : "任何拥有您助记词的人都可以窃取您账户中的任何资产，切勿泄露！！！"}
        </Paper>

        {showMnemonic && (
          <Paper
            p={10}
            withBorder
            style={{
              display: "flex",
              alignSelf: "center",
              backgroundColor: "white",
            }}
          >
            <QRCodeCanvas value={mnemonic || " "} size={260} />
          </Paper>
        )}

        {showMnemonic && mnemonic && (
          <Stack gap="md" w="100%">
            <Button color="gray" variant="light" onClick={deriveAddress}>
              派生 10 个地址
            </Button>

            <Text c="var(--red)">
              任何拥有您私钥的人都可以窃取您地址中的任何资产，切勿泄露！！！
            </Text>

            <Table withColumnBorders highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th
                    onClick={() => setDeriveShowIndex(!deriveShowIndex)}
                    style={{ cursor: "pointer" }}
                    w="10%"
                    miw={50}
                  >
                    账户
                  </Table.Th>
                  <Table.Th
                    onClick={() => setDeriveShowAddress(!deriveShowAddress)}
                    style={{ cursor: "pointer" }}
                    w="40%"
                  >
                    地址
                  </Table.Th>
                  <Table.Th
                    onClick={() =>
                      setDeriveShowPrivateKey(!deriveShowPrivateKey)
                    }
                    style={{ cursor: "pointer", color: "var(--red)" }}
                    w="50%"
                  >
                    私钥（点击{deriveShowPrivateKey ? "隐藏" : "显示"}）
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {deriveAddressList.map((item) => (
                  <Table.Tr key={item.index}>
                    <Table.Td>{deriveShowIndex ? item.index + 1 : ""}</Table.Td>
                    <Table.Td>{deriveShowAddress ? item.address : ""}</Table.Td>
                    <Table.Td style={{ color: "var(--red)" }}>
                      {deriveShowPrivateKey ? item.privateKey : ""}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
