import { useState, useEffect } from 'react'
import { useUserStore } from '@/stores/userStore'
import { useToast } from 'expo-toast'
import Constants from 'expo-constants'
import { AppContract, type AppInfo } from '@/constants/Contract'

export interface NodeInfo {
  url: string
  isApproved: boolean
}

export const useAppUpdate = () => {
  const toast = useToast()
  const wallet = useUserStore((state) => state.wallet)

  const [currentVersion, setCurrentVersion] = useState('-')
  const [appInfo, setAppInfo] = useState<AppInfo | null>(null)
  const [managers, setManagers] = useState<string[]>([])
  const [approvedNodes, setApprovedNodes] = useState<string[]>([])
  const [pendingNodes, setPendingNodes] = useState<string[]>([])
  const [isOwner, setIsOwner] = useState(false)
  const [isManager, setIsManager] = useState(false)

  const appContract = new AppContract()

  const init = async () => {
    try {
      const [version, downloadUrl, updateContent] = await appContract.getAppInfo()
      setAppInfo({ version, downloadUrl, updateContent })

      const managerList = await appContract.getAllNodeManagers()
      setManagers(managerList)

      const approved = await appContract.getApprovedNodeUrls()
      setApprovedNodes(approved)

      const pending = await appContract.getPendingNodeUrls()
      setPendingNodes(pending)
    } catch (error) {
      console.error('初始化数据失败', error)
      toast.show('获取数据失败')
    }
  }

  const updateAppInfo = async (version: string, downloadUrl: string, content: string) => {
    try {
      await appContract.updateAppInfo(version, downloadUrl, content)
      toast.show('更新成功')
      init()
    } catch (error) {
      toast.show('更新失败')
    }
  }

  const addNode = async (url: string) => {
    try {
      await appContract.addNodeUrl(url)
      toast.show('添加成功')
      init()
    } catch (error) {
      toast.show('添加失败')
    }
  }

  const approveNode = async (url: string) => {
    try {
      await appContract.approveNode(url)
      toast.show('批准成功')
      init()
    } catch (error) {
      toast.show('批准失败')
    }
  }

  const removeNode = async (url: string) => {
    try {
      await appContract.removeNodeUrl(url)
      toast.show('删除成功')
      init()
    } catch (error) {
      toast.show('删除失败')
    }
  }

  useEffect(() => {
    const v = Constants.expoConfig?.version
    if (v) setCurrentVersion(v)
    init()
  }, [])

  const initWallet = async () => {
    const owner = await appContract.getOwner()
    setIsOwner(wallet?.address === owner)

    if (wallet?.address) {
      const isNodeManager = await appContract.isNodeManager(wallet.address)
      setIsManager(isNodeManager)
    }
  }
  useEffect(() => {
    if (wallet) {
      initWallet()
    }
  }, [wallet])

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
  }
}
