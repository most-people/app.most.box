import Link from "next/link";
import { Button } from "@mantine/core";

export default function HomePage() {
  return (
    <>
      <Button component={Link} href="/login">
        Login
      </Button>
    </>
  );
}
