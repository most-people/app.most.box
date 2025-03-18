"use client";
import { useUserStore } from "@/stores/userStore";
import { useEffect } from "react";

export default function AppProvider() {
  const setItem = useUserStore((state) => state.setItem);
  const initWallet = useUserStore((state) => state.initWallet);

  useEffect(() => {
    initWallet();
    setItem("firstPath", window.location.pathname);
  }, []);
  return null;
}
