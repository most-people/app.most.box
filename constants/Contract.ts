import { Contract, JsonRpcProvider, type Signer } from 'ethers'
// 合约 ABI
import CONTRACT_ABI from '@/assets/abi/AppVersionContract.json'

const CONTRACT_ADDRESS = '0xBEAF3697ba3DDC9199Ffa6Fd6E13d75E5780c90c'
const CONTRACT_RPC = 'https://optimism.llamarpc.com'
const CONTRACT_EXPLORER = 'https://optimistic.etherscan.io'

export { CONTRACT_ADDRESS, CONTRACT_RPC, CONTRACT_EXPLORER }

export interface AppInfo {
  version: string
  downloadUrl: string
  updateContent: string
}

export class AppContract {
  private contract: Contract

  constructor() {
    const provider = new JsonRpcProvider(CONTRACT_RPC)
    this.contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)
  }
  async setSigner(signer: Signer) {
    this.contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
    this.switchNetwork()
  }

  async switchNetwork() {
    // @ts-ignore
    const provider = window.ethereum
    if (provider) {
      // 切换到 Optimism 网络
      try {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0xA' }],
        })
      } catch (switchError: any) {
        // 如果网络不存在，则添加网络
        if (switchError.code === 4902) {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0xA',
                chainName: 'Optimism',
                nativeCurrency: {
                  name: 'Ethereum',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: [CONTRACT_RPC],
                blockExplorerUrls: [CONTRACT_EXPLORER],
              },
            ],
          })
        } else {
          throw switchError
        }
      }
    }
  }

  async getAppInfo(): Promise<AppInfo> {
    try {
      const [version, downloadUrl, updateContent] = await this.contract.getAppInfo()
      return { version, downloadUrl, updateContent }
    } catch (error) {
      console.error('获取版本信息失败:', error)
      throw error
    }
  }
  async getAllNodeManagers() {
    try {
      const managers = await this.contract.getAllNodeManagers()
      return Array.from(managers) as string[]
    } catch (error) {
      console.error('获取节点管理员列表失败:', error)
      throw error
    }
  }
  async getApprovedNodeUrls() {
    try {
      const approvedNodes = await this.contract.getApprovedNodeUrls()
      return Array.from(approvedNodes) as string[]
    } catch (error) {
      console.error('获取认证节点列表失败:', error)
      throw error
    }
  }
  async getPendingNodeUrls() {
    try {
      const pendingNodes = await this.contract.getPendingNodeUrls()
      return Array.from(pendingNodes) as string[]
    } catch (error) {
      console.error('获取待审节点列表失败:', error)
      throw error
    }
  }
  async getOwner(): Promise<string> {
    try {
      const owner = await this.contract.owner()
      return owner
    } catch (error) {
      console.error('获取合约拥有者失败:', error)
      throw error
    }
  }
  async updateAppInfo(version: string, downloadUrl: string, updateContent: string) {
    try {
      const tx = await this.contract.updateAppInfo(version, downloadUrl, updateContent)
      await tx.wait()
    } catch (error) {
      console.error('更新应用信息失败:', error)
      throw error
    }
  }
  async addNodeUrl(url: string) {
    try {
      const tx = await this.contract.addNodeUrl(url)
      await tx.wait()
    } catch (error: any) {
      console.error('添加节点失败:', error?.message)
      throw error
    }
  }
  async approveNode(url: string) {
    try {
      const tx = await this.contract.approveNode(url)
      await tx.wait()
    } catch (error) {
      console.error('批准节点失败:', error)
      throw error
    }
  }
  async removeNodeUrl(url: string) {
    try {
      const tx = await this.contract.removeNodeUrl(url)
      await tx.wait()
    } catch (error) {
      console.error('删除节点失败:', error)
      throw error
    }
  }
  async isNodeManager(address: string): Promise<boolean> {
    try {
      return await this.contract.isNodeManager(address)
    } catch (error) {
      console.error('检查管理员权限失败:', error)
      throw error
    }
  }
}
