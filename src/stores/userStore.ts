import mp from "@/constants/mp";
import { type DotMethods, type DotClient, type MostWallet } from "dot.most.box";
import { create } from "zustand";

export interface Topic {
  name: string;
  timestamp: number;
}

export interface People {
  username: string;
  address: string;
  public_key: string;
}

interface UserStore {
  wallet?: MostWallet;
  initWallet: () => void;
  dotClient: DotClient | null;
  dot: DotMethods | null;
  exit: () => void;
  topics: Topic[];
  firstPath: string;
  onlinePeople: People[];
}

interface State extends UserStore {
  setItem: <K extends keyof State>(key: K, value: State[K]) => void;
}

export const useUserStore = create<State>((set) => ({
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
  onlinePeople: [],
}));
