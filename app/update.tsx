import { useState } from 'react'
import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import { useUserStore } from '@/stores/userStore'
import { Colors } from '@/constants/Colors'
import PageView from '@/components/PageView'
import { ThemeText, ThemeView } from '@/components/Theme'
import { UpdateDialog } from '@/components/Dialog/UpdateDialog'
import { AddNodeDialog } from '@/components/Dialog/AddNodeDialog'
import { useAppUpdate } from '@/hooks/useAppUpdate'

export default function UpdatePage() {
  const theme = useUserStore((state) => state.theme)
  const styles = createStyles(theme)
  const [showUpdateDialog, setShowUpdateDialog] = useState(false)
  const [showAddNodeDialog, setShowAddNodeDialog] = useState(false)

  const {
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
  } = useAppUpdate()

  return (
    <PageView title="应用更新">
      <ScrollView>
        <ThemeView style={styles.section}>
          <ThemeText type="subtitle">应用信息</ThemeText>
          <ThemeText>当前版本：{currentVersion}</ThemeText>
          <ThemeText>最新版本：{appInfo?.version || '未知'}</ThemeText>
          <ThemeText>下载链接：{appInfo?.downloadUrl || '未知'}</ThemeText>
          <ThemeText>更新内容：{appInfo?.updateContent || '未知'}</ThemeText>

          {isOwner && (
            <TouchableOpacity style={styles.button} onPress={() => setShowUpdateDialog(true)}>
              <ThemeText style={styles.buttonText}>更新应用信息</ThemeText>
            </TouchableOpacity>
          )}
        </ThemeView>

        <ThemeView style={styles.section}>
          <ThemeText type="subtitle">管理员列表</ThemeText>
          {managers.map((address, index) => (
            <ThemeText key={index}>{address}</ThemeText>
          ))}
        </ThemeView>

        <ThemeView style={styles.section}>
          <ThemeText type="subtitle">认证节点</ThemeText>
          {approvedNodes.map((url, index) => (
            <ThemeView key={index} style={styles.nodeItem}>
              <ThemeText>{url}</ThemeText>
              {isManager && (
                <TouchableOpacity style={styles.smallButton} onPress={() => removeNode(url)}>
                  <ThemeText style={styles.buttonText}>删除</ThemeText>
                </TouchableOpacity>
              )}
            </ThemeView>
          ))}

          <TouchableOpacity style={styles.button} onPress={() => setShowAddNodeDialog(true)}>
            <ThemeText style={styles.buttonText}>添加节点</ThemeText>
          </TouchableOpacity>
        </ThemeView>

        <ThemeView style={styles.section}>
          <ThemeText type="subtitle">待审核节点</ThemeText>
          {pendingNodes.map((url, index) => (
            <ThemeView key={index} style={styles.nodeItem}>
              <ThemeText>{url}</ThemeText>
              {isManager && (
                <ThemeView style={styles.buttonGroup}>
                  <TouchableOpacity style={styles.smallButton} onPress={() => approveNode(url)}>
                    <ThemeText style={styles.buttonText}>批准</ThemeText>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.smallButton} onPress={() => removeNode(url)}>
                    <ThemeText style={styles.buttonText}>删除</ThemeText>
                  </TouchableOpacity>
                </ThemeView>
              )}
            </ThemeView>
          ))}
        </ThemeView>
      </ScrollView>

      <UpdateDialog
        visible={showUpdateDialog}
        onClose={() => setShowUpdateDialog(false)}
        onConfirm={(values) => {
          updateAppInfo(values.version, values.downloadUrl, values.content)
          setShowUpdateDialog(false)
        }}
        defaultValues={appInfo}
      />

      <AddNodeDialog
        visible={showAddNodeDialog}
        onClose={() => setShowAddNodeDialog(false)}
        onConfirm={(values) => {
          addNode(values.url)
          setShowAddNodeDialog(false)
        }}
      />
    </PageView>
  )
}

const createStyles = (theme: 'light' | 'dark') => {
  return StyleSheet.create({
    button: {
      backgroundColor: Colors.success,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 10,
    },
    smallButton: {
      backgroundColor: Colors.success,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 6,
    },
    buttonText: {
      fontSize: 16,
      color: Colors[theme].card,
    },
    nodeItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 10,
      backgroundColor: Colors[theme].input.background,
      borderWidth: 1,
      borderColor: Colors[theme].input.border,
      borderRadius: 8,
    },
    section: {
      marginBottom: 20,
      gap: 10,
    },
    buttonGroup: {
      flexDirection: 'row',
      gap: 10,
    },
  })
}
