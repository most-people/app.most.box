import type { PropsWithChildren } from "react";
import { AppHeader } from "@/components/AppHeader";

interface PageTabViewProps {
  title: string | string[];
  action?: React.ReactNode;
}

export default function Page({
  children,
  title,
  action,
}: PropsWithChildren<PageTabViewProps>) {
  return (
    <>
      <AppHeader title={title} action={action} />
      {children}
    </>
  );
}
