import { Contract, JsonRpcProvider, type Provider } from 'ethers'
// 合约 ABI
import CONTRACT_ABI from '@/assets/abi/AppVersionContract.json'

const CONTRACT_ADDRESS = '0xBEAF3697ba3DDC9199Ffa6Fd6E13d75E5780c90c'
const OPTIMISM_RPC = 'https://optimism.llamarpc.com'

interface AppInfo {
  version: string
  downloadLink: string
  updateContent: string
}

export class AppContract {
  private contract: Contract
  private provider: Provider

  constructor() {
    this.provider = new JsonRpcProvider(OPTIMISM_RPC)
    this.contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.provider)
  }

  async getAppInfo(): Promise<AppInfo> {
    try {
      const [version, downloadLink, updateContent] = await this.contract.getAppInfo()
      return {
        version,
        downloadLink,
        updateContent,
      }
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
}
