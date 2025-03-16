import Link from "next/link";
import { Button } from "@mantine/core";

export default function HomePage() {
  return (
    <div id="page-home">
      <Button variant="gradient" component={Link} href="/login">
        Login
      </Button>
    </div>
  );
}
