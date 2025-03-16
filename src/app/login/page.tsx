import { Text, TextInput, Button, Stack, Group, Divider } from "@mantine/core";
import "./login.scss";

export default function LoginPage() {
  return (
    <div id="page-login">
      <Stack gap="md">
        <div className="header">
          <Text size="lg" fw={700}>
            Most.Box
          </Text>
          <Text>完全去中心化，无需注册</Text>
        </div>

        <Stack gap="md">
          <TextInput placeholder="请输入用户名" type="email" required />
          <TextInput placeholder="请输入密码" type="email" required />

          <Button fullWidth>登录</Button>

          <Divider label="Or" labelPosition="center" />

          <Button variant="default">连接钱包</Button>
        </Stack>
      </Stack>
    </div>
  );
}
