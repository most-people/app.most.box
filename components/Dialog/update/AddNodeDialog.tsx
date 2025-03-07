import { DialogForm } from '@/components/Dialog'

interface AddNodeDialogProps {
  visible: boolean
  onClose: () => void
  onConfirm: (values: { url: string }) => void
}

const fields = [
  {
    name: 'url',
    label: '节点地址',
    validate: (value: string) => {
      if (!value.trim()) return '请输入节点地址'
      try {
        new URL(value.trim())
        return ''
      } catch {
        return '请输入有效的网址'
      }
    },
  },
]

export const AddNodeDialog = ({ visible, onClose, onConfirm }: AddNodeDialogProps) => (
  <DialogForm
    visible={visible}
    title="添加节点"
    fields={fields}
    onClose={onClose}
    onConfirm={(values: Record<string, string>) => onConfirm({ url: values.url })}
  />
)
