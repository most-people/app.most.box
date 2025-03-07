import { DialogForm } from '@/components/Dialog'
import { type AppInfo } from '@/constants/Contract'

interface UpdateDialogProps {
  visible: boolean
  onClose: () => void
  onConfirm: (values: { version: string; downloadUrl: string; content: string }) => void
  defaultValues: AppInfo | null
}

const fields = [
  {
    name: 'version',
    label: '版本号',
    validate: (value: string) => {
      if (!value.trim()) return '请输入版本号'
      if (!/^\d+\.\d+\.\d+$/.test(value)) return '版本号格式必须为 x.x.x'
      return ''
    },
  },
  {
    name: 'downloadUrl',
    label: '下载链接',
    validate: (value: string) => {
      if (!value.trim()) return '请输入下载链接'
      try {
        new URL(value.trim())
        return ''
      } catch {
        return '请输入有效的下载链接'
      }
    },
  },
  {
    name: 'content',
    label: '更新内容',
    multiline: true,
    validate: (value: string) => (value.trim() ? '' : '请输入更新内容'),
  },
]

export const UpdateDialog = ({ visible, onClose, onConfirm, defaultValues }: UpdateDialogProps) => (
  <DialogForm
    visible={visible}
    title="更新应用信息"
    fields={fields.map((f) => ({
      ...f,
      initialValue: defaultValues?.[f.name as keyof AppInfo] || '',
      placeholder: f.label === '更新内容' ? '请输入更新内容' : undefined,
    }))}
    onClose={onClose}
    onConfirm={(values: Record<string, string>) => {
      onConfirm({
        version: values.version,
        downloadUrl: values.downloadUrl,
        content: values.content,
      })
    }}
  />
)
