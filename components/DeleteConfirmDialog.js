import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export default function DeleteConfirmDialog({ isOpen, onClose, onConfirm, domainName }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>确认删除</DialogTitle>
          <DialogDescription>
            您确定要删除域名 {domainName} 吗？此操作无法撤销。
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>取消</Button>
          <Button variant="destructive" onClick={onConfirm}>确认删除</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
