import mp from "@/constants/mp";
import { ContractOnline } from "@/constants/nodes";
import dayjs from "dayjs";
import { type DotMethods, type DotClient, type MostWallet } from "dot.most.box";
import { isAddress } from "ethers";
import { create } from "zustand";

export interface Topic {
  name: string;
  timestamp: number;
}

export interface People {
  value: string;
  timestamp: number;
}

interface UserStore {
  wallet?: MostWallet;
  initWallet: () => void;
  dotClient: DotClient | null;
  dot: DotMethods | null;
  exit: () => void;
  topics: Topic[];
  firstPath: string;
  onlinePeople: Record<string, People>;
  onlineUpdate: (data?: Record<string, People>) => void;
}

interface State extends UserStore {
  setItem: <K extends keyof State>(key: K, value: State[K]) => void;
}

export const useUserStore = create<State>((set, get) => ({
  wallet: undefined,
  initWallet() {
    const token = localStorage.getItem("token");
    const tokenSecret = localStorage.getItem("tokenSecret");
    if (token && tokenSecret) {
      const wallet = mp.verifyJWT(token, tokenSecret) as MostWallet | null;
      if (wallet) {
        set({ wallet });
      }
    }
  },
  dotClient: null,
  dot: null,
  topics: [],
  setItem: (key, value) => set((state) => ({ ...state, [key]: value })),
  exit() {
    set({ wallet: undefined });
    localStorage.removeItem("token");
    localStorage.removeItem("tokenSecret");
  },
  firstPath: "",
  onlinePeople: {},
  onlineUpdate(data?: Record<string, People>) {
    if (data) {
      const dict = { ...get().onlinePeople };
      for (const address in data) {
        const people = data[address];
        if (isAddress(address) && typeof people.value === "string") {
          const diff = dayjs().diff(dayjs(people.timestamp), "minute");
          // 如果超过5分钟，从列表中移除
          if (diff > 5) {
            delete dict[address];
            continue;
          }
          // 5分钟内的用户，更新或添加
          if (get().onlinePeople[address]) {
            // 已存在的用户，直接更新为最新数据
            dict[address] = people;
          } else {
            // 新用户，直接添加
            dict[address] = people;
          }
        }
      }
      set({ onlinePeople: dict });
    }
  },
}));
