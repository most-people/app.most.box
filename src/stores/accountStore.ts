import { create } from 'zustand'
import { BrowserProvider, getAddress, type Signer } from 'ethers'

interface AccountState {
  ethereum: object | null
  signer: Signer | null
  account: string
  connectOKX: () => Promise<Signer | null>
  disconnect: () => void
  onAccountChange: () => void
}

export const useAccountStore = create<AccountState>((set, get) => ({
  ethereum: null,
  signer: null,
  account: '',
  disconnect: () => {
    set({ account: '', signer: null })
  },
  // 连接钱包地址
  async connectOKX() {
    try {
      // @ts-ignore
      const provider = window.ethereum
      if (provider) {
        const accounts = await provider.request({ method: 'eth_requestAccounts' })
        if (accounts && accounts.length > 0) {
          const account = getAddress(accounts[0])
          const ethersProvider = new BrowserProvider(provider)
          const signer = await ethersProvider.getSigner()
          set({ account, signer })
          return signer
        }
      } else {
        console.log('请安装 OKX Wallet')
      }
    } catch (error) {
      console.log('连接 OKX Wallet 失败', error)
    }
    return null
  },
  // 监听钱包地址变化
  async onAccountChange() {
    // @ts-ignore
    const ethereum = window?.ethereum
    if (ethereum) {
      set({ ethereum })
      ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts && accounts.length > 0) {
          const account = getAddress(accounts[0])
          set({ account })
          return account
        } else {
          get().disconnect()
        }
      })
    }
  },
}))
