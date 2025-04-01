import { create } from "zustand";
import { useUserStore } from "@/stores/userStore";
import { startTransition } from "react";
import { DotMethods } from "dot.most.box";

export interface Topic {
  name: string;
  password: string;
  timestamp: number;
}

interface TopicStore {
  inited: boolean;
  topics: Topic[];
  join: (name: string, password: string) => void;
  quit: (name: string) => void;
  init: (dot: DotMethods) => void;
  reset: () => void;
}

interface State extends TopicStore {
  setItem: <K extends keyof State>(key: K, value: State[K]) => void;
  pushItem: <K extends keyof State>(
    key: K,
    value: State[K] extends unknown[]
      ? State[K] extends (infer T)[]
        ? T
        : never
      : never
  ) => void;
}

export const useTopicStore = create<State>((set, get) => ({
  inited: false,
  topics: [],
  setItem: (key, value) => set((state) => ({ ...state, [key]: value })),
  pushItem: (key, value) =>
    set((state) => {
      const prev = state[key];
      if (!Array.isArray(prev)) {
        console.log(`${key} 不是数组`);
        return state;
      }
      return {
        ...state,
        [key]: [value, ...prev],
      };
    }),
  join(name: string, password: string) {
    // 检查登录
    const dot = useUserStore.getState().dot;
    if (dot) {
      // 检查是否已经存在，避免重复添加
      const topics = get().topics;
      if (!topics.some((e) => e.name === name && e.password === password)) {
        const timestamp = Date.now();
        const data: Topic = { name, password, timestamp };
        const list = get().topics;
        dot.put("topics", [data, ...list], true);
      }
    }
  },
  quit(name: string) {
    // 检查登录
    const dot = useUserStore.getState().dot;
    if (dot) {
      // 检查是否已经删除，避免重复删除
      const topics = get().topics;
      const filter = topics.filter((e) => e.name !== name);
      if (filter.length < topics.length) {
        dot.put("topics", filter, true);
      }
    }
  },
  init(dot: DotMethods) {
    if (get().inited) return;
    set({ inited: true });
    let t = 0;
    dot.on(
      "topics",
      (data, timestamp) => {
        if (timestamp > t) {
          t = timestamp;
          // 检查数据
          const check =
            Array.isArray(data) &&
            data.every((item) => typeof item?.timestamp === "number");
          if (check) {
            startTransition(() => set({ topics: data }));
          }
        }
      },
      { decrypt: true }
    );
  },
  reset() {
    set({ inited: false, topics: [] });
  },
}));
