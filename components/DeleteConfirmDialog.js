'use client'
import { useTranslation } from 'react-i18next'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export default function DeleteConfirmDialog({ isOpen, onClose, onConfirm, domainName }) {
  const { t } = useTranslation();
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('deleteConfirm.title')}</DialogTitle>
          <DialogDescription>
            {t('domain.deleteConfirm.message', { domain: domainName })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>{t('domain.cancel')}</Button>
          <Button variant="destructive" onClick={onConfirm}>{t('domain.confirm')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
