import { useState, useEffect } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'react-hot-toast';

// 域名验证正则表达式
const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

export default function DomainDrawer({ isOpen, onClose, onSave, domain }) {
  const [domainName, setDomainName] = useState('');
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [domainError, setDomainError] = useState('');
  const [nameError, setNameError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (domain) {
      setDomainName(domain.domain || '');
      setName(domain.name || '');
      setNote(domain.note || '');
    } else {
      setDomainName('');
      setName('');
      setNote('');
    }
    setDomainError('');
    setNameError('');
  }, [domain]);

  const validateDomain = (value) => {
    if (!domainRegex.test(value)) {
      setDomainError('请输入有效的域名格式');
    } else {
      setDomainError('');
    }
  };

  const validateName = (value) => {
    if (!value.trim()) {
      setNameError('网站名称不能为空');
    } else {
      setNameError('');
    }
  };

  const handleDomainChange = (e) => {
    const value = e.target.value;
    setDomainName(value);
    validateDomain(value);
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    validateName(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    validateDomain(domainName);
    validateName(name);
    if (!domainError && !nameError && domainName && name.trim()) {
      setIsSubmitting(true);
      try {
        const result = await onSave({ domain: domainName, name: name.trim(), note });
        if (result && result.success) {
          toast.success('域名保存成功');
          onClose();
        } else if (result && result.error) {
          toast.error(result.error);
        }
      } catch (error) {
        console.error('保存域名时发生错误:', error);
        toast.error('保存域名时发生错误');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-w-md w-full mx-auto">
        <DrawerHeader>
          <DrawerTitle>{domain ? '编辑域名' : '添加新域名'}</DrawerTitle>
        </DrawerHeader>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="domain">域名</Label>
            <Input
              id="domain"
              type="text"
              value={domainName}
              onChange={handleDomainChange}
              onBlur={() => validateDomain(domainName)}
              placeholder="example.com"
              required
            />
            {domainError && <p className="text-red-500 text-sm">{domainError}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">网站名称</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={handleNameChange}
              onBlur={() => validateName(name)}
              required
            />
            {nameError && <p className="text-red-500 text-sm">{nameError}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="note">备注</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
            />
          </div>
          <DrawerFooter>
            <Button 
              type="submit" 
              disabled={!!domainError || !!nameError || !domainName || !name.trim() || isSubmitting}
            >
              {isSubmitting ? '保存中...' : '保存'}
            </Button>
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
              取消
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
