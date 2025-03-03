import { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Linking, ActivityIndicator } from 'react-native'
import { useUserStore } from '@/stores/userStore'
import { Colors } from '@/constants/Colors'
import Constants from 'expo-constants'
import PageView from '@/components/PageView'

interface AppVersion {
  version: string
  downloadUrl: string
}

export default function UpdatePage() {
  const theme = useUserStore((state) => state.theme)
  const styles = createStyles(theme)

  const [currentVersion, setCurrentVersion] = useState('')
  const [latestVersion, setLatestVersion] = useState<AppVersion | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // 获取当前版本
  useEffect(() => {
    const appVersion = Constants.expoConfig?.version
    setCurrentVersion(appVersion || '-')
  }, [])

  // 获取最新版本信息
  useEffect(() => {
    fetchLatestVersion()
  }, [])

  const fetchLatestVersion = async () => {
    setIsLoading(true)
    setError('')

    try {
      // 这里应替换为实际的API请求
      // const response = await fetch('https://your-api.com/v1/app-version')
      // const data = await response.json()

      // 模拟API响应
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const mockData: AppVersion = {
        version: '1.2.0',
        downloadUrl: '/download',
      }

      setLatestVersion(mockData)
    } catch (err) {
      console.error('获取版本信息失败:', err)
      setError('获取版本信息失败，请检查网络连接')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = () => {
    if (latestVersion?.downloadUrl) {
      Linking.openURL(latestVersion.downloadUrl).catch((err) => {
        console.error('无法打开下载链接:', err)
        setError('无法打开下载链接')
      })
    }
  }

  // 版本比较，简单实现
  const hasNewVersion = () => {
    if (!latestVersion) return false

    const current = currentVersion.split(' ')[0]
    const latest = latestVersion.version

    return latest !== current
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
          <Text style={styles.versionNumber}>
            {latestVersion ? `${latestVersion.version}` : '未知'}
          </Text>

          {!hasNewVersion() && <Text style={styles.latestVersionText}>您当前使用的是最新版本</Text>}

          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <View style={styles.actionsContainer}>
            {hasNewVersion() && (
              <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
                <Text style={styles.buttonText}>下载最新版本</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </PageView>
  )
}

const createStyles = (theme: 'light' | 'dark') => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[theme].background,
    },
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
    updateNotesContainer: {
      backgroundColor: Colors[theme === 'dark' ? 'dark' : 'light'].card,
      borderRadius: 8,
      padding: 16,
      marginTop: 12,
    },
    updateNotesTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: Colors[theme].text,
      marginBottom: 8,
    },
    updateNotes: {
      fontSize: 14,
      lineHeight: 20,
      color: Colors[theme].text,
    },
    latestVersionText: {
      fontSize: 16,
      color: Colors.success,
      textAlign: 'center',
      marginTop: 20,
    },
    actionsContainer: {
      marginTop: 20,
    },
    downloadButton: {
      backgroundColor: Colors.success,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginBottom: 12,
    },
    buttonText: {
      fontSize: 18,
    },
    refreshButton: {
      borderWidth: 1,
      borderColor: Colors[theme].border,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: 'center',
    },
    errorText: {
      color: Colors.tint,
      marginTop: 16,
      textAlign: 'center',
    },
  })
}
