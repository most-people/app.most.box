import { useState, useEffect } from 'react'
import { useToast } from 'expo-toast'
import Constants from 'expo-constants'
import { AppContract, type AppInfo } from '@/constants/Contract'

export interface NodeInfo {
  url: string
  isApproved: boolean
}

export const useAppUpdate = () => {
  const toast = useToast()
  const [account, setAccount] = useState<string>('')
  const [currentVersion, setCurrentVersion] = useState('-')
  const [appInfo, setAppInfo] = useState<AppInfo | null>(null)
  const [managers, setManagers] = useState<string[]>([])
  const [approvedNodes, setApprovedNodes] = useState<string[]>([])
  const [pendingNodes, setPendingNodes] = useState<string[]>([])
  const [isOwner, setIsOwner] = useState(false)
  const [isManager, setIsManager] = useState(false)

  const appContract = new AppContract()

  const updateAppInfo = async (version: string, downloadUrl: string, content: string) => {
    try {
      await appContract.updateAppInfo(version, downloadUrl, content)
      toast.show('更新成功')
      appContract.getAppInfo().then((appInfo) => setAppInfo(appInfo))
    } catch (error) {
      console.error('更新失败', error)
      toast.show('更新失败')
    }
  }

  const addNode = async (url: string) => {
    try {
      await appContract.addNodeUrl(url)
      toast.show('添加成功')
      appContract.getApprovedNodeUrls().then((approvedNodes) => setApprovedNodes(approvedNodes))
      appContract.getPendingNodeUrls().then((pendingNodes) => setPendingNodes(pendingNodes))
    } catch (error) {
      console.error('添加失败', error)
      toast.show('添加失败')
    }
  }

  const approveNode = async (url: string) => {
    try {
      await appContract.approveNode(url)
      toast.show('批准成功')
      appContract.getApprovedNodeUrls().then((approvedNodes) => setApprovedNodes(approvedNodes))
    } catch (error) {
      console.error('批准失败', error)
      toast.show('批准失败')
    }
  }

  const removeNode = async (url: string) => {
    try {
      await appContract.removeNodeUrl(url)
      toast.show('删除成功')
      appContract.getApprovedNodeUrls().then((approvedNodes) => setApprovedNodes(approvedNodes))
      appContract.getPendingNodeUrls().then((pendingNodes) => setPendingNodes(pendingNodes))
    } catch (error) {
      console.error('删除失败', error)
      toast.show('删除失败')
    }
  }

  useEffect(() => {
    const v = Constants.expoConfig?.version
    if (v) {
      setCurrentVersion(v)
    }

    appContract.getAppInfo().then((appInfo) => setAppInfo(appInfo))
    appContract.getAllNodeManagers().then((managerList) => setManagers(managerList))
    appContract.getApprovedNodeUrls().then((approvedNodes) => setApprovedNodes(approvedNodes))
    appContract.getPendingNodeUrls().then((pendingNodes) => setPendingNodes(pendingNodes))
    // 监听钱包地址变化
    // @ts-ignore
    const provider = window.ethereum
    if (provider) {
      appContract.setProvider(provider)
      const callback = (accounts: string[]) => {
        setAccount(accounts[0])
      }
      provider.on('accountsChanged', callback)
      return () => {
        provider.removeListener('accountsChanged', callback)
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const connectOKX = async () => {
    try {
      // @ts-ignore
      const provider = window.ethereum
      if (!provider) {
        toast.show('请安装 OKX Wallet')
        return
      }

      const accounts = await provider.request({ method: 'eth_requestAccounts' })
      setAccount(accounts[0])
    } catch (error) {
      console.error('连接 OKX Wallet 失败', error)
      toast.show('连接钱包失败')
    }
  }

  useEffect(() => {
    const v = Constants.expoConfig?.version
    if (v) setCurrentVersion(v)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (account) {
      appContract.getOwner().then((owner) => setIsOwner(account === owner.toLowerCase()))
      appContract.isNodeManager(account).then((isNodeManager) => setIsManager(isNodeManager))
    } else {
      // 当账户断开时，重置状态
      setIsOwner(false)
      setIsManager(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account])

  return {
    currentVersion,
    appInfo,
    managers,
    approvedNodes,
    pendingNodes,
    isOwner,
    isManager,
    updateAppInfo,
    addNode,
    approveNode,
    removeNode,
    account,
    connectOKX,
  }
}
