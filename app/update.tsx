import { useState, useEffect, useCallback } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Linking, ActivityIndicator } from 'react-native'
import { useUserStore } from '@/stores/userStore'
import { Colors } from '@/constants/Colors'
import Constants from 'expo-constants'
import PageView from '@/components/PageView'
import { useToast } from 'expo-toast'

interface AppVersion {
  version: string
  downloadUrl: string
}

export default function UpdatePage() {
  const theme = useUserStore((state) => state.theme)
  const styles = createStyles(theme)
  const toast = useToast()

  const [currentVersion, setCurrentVersion] = useState('-')
  const [latestVersion, setLatestVersion] = useState<AppVersion | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchLatestVersion = useCallback(async () => {
    try {
      // 模拟API响应
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setLatestVersion({
        version: '1.1.1',
        downloadUrl: '/download',
      })
    } catch (error) {
      console.error('获取版本信息失败', error)
      toast.show('获取版本信息失败')
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  // 获取当前版本并获取最新版本信息
  useEffect(() => {
    const v = Constants.expoConfig?.version
    if (v) {
      setCurrentVersion(v)
    }
    fetchLatestVersion()
  }, [fetchLatestVersion])

  const handleDownload = () => {
    if (latestVersion?.downloadUrl) {
      Linking.openURL(latestVersion.downloadUrl).catch(() => {
        toast.show('无法打开下载链接')
      })
    }
  }

  // 判断是否有新版本
  const hasNewVersion = () => {
    if (!latestVersion) return false
    return latestVersion.version !== currentVersion
  }

  return (
    <PageView title="应用更新">
      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.success} />
      ) : (
        <View style={styles.versionInfo}>
          <Text style={styles.versionTitle}>当前版本</Text>
          <Text style={styles.versionNumber}>{currentVersion}</Text>

          <Text style={styles.versionTitle}>最新版本</Text>
          <Text style={styles.versionNumber}>{latestVersion ? latestVersion.version : '未知'}</Text>

          {hasNewVersion() ? (
            <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
              <Text style={styles.buttonText}>下载最新版本</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.latestVersionText}>您当前使用的是最新版本</Text>
          )}
        </View>
      )}
    </PageView>
  )
}

const createStyles = (theme: 'light' | 'dark') => {
  return StyleSheet.create({
    versionInfo: {
      marginBottom: 30,
    },
    versionTitle: {
      fontSize: 16,
      color: Colors[theme].text,
      marginBottom: 4,
    },
    versionNumber: {
      fontSize: 20,
      fontWeight: 'bold',
      color: Colors[theme].text,
      marginBottom: 20,
    },
    latestVersionText: {
      fontSize: 16,
      color: Colors.success,
      textAlign: 'center',
      marginTop: 20,
    },
    downloadButton: {
      backgroundColor: Colors.success,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 20,
    },
    buttonText: {
      fontSize: 18,
    },
  })
}
