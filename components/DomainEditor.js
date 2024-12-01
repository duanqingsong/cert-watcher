import { useState, useEffect } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import MyDrawer from './MyDrawer';
import MySheet from './MySheet';
// 域名验证正则表达式
const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

export default function DomainEditor({ isOpen, onClose, onSave, domain }) {
  const [domainName, setDomainName] = useState('');
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [domainError, setDomainError] = useState('');
  const [nameError, setNameError] = useState('');

  useEffect(() => {
    if (domain) {
      setDomainName(domain.domain || '');
      setName(domain.name || '');
      setNote(domain.note || '');
      setDomainError('');
      setNameError('');
    } else {
      setDomainName('');
      setName('');
      setNote('');
      setDomainError('');
      setNameError('');
    }
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
    if (!domainError && !nameError && domainName && name) {
      const result = await onSave({ domain: domainName, name, note });
      if (result.success) {
        onClose();
      }
    }
  };

  const isFormValid = !domainError && !nameError && domainName && name;

  return (
    <MySheet 
      title={domain ? '编辑域名' : '添加新域名'} 
      isOpen={isOpen} 
      onClose={onClose}
      >
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <Label htmlFor="domain">域名</Label>
            <Input
              id="domain"
              value={domainName}
              onChange={handleDomainChange}
              onBlur={() => validateDomain(domainName)}
              required
            />
            {domainError && <p className="text-red-500 text-sm">{domainError}</p>}
          </div>
          <div>
            <Label htmlFor="name">网站名称</Label>
            <Input
              id="name"
              value={name}
              onChange={handleNameChange}
              onBlur={() => validateName(name)}
              required
            />
            {nameError && <p className="text-red-500 text-sm">{nameError}</p>}
          </div>
          <div>
            <Label htmlFor="note">备注</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
          <DrawerFooter>
            <Button type="submit" disabled={!isFormValid}>保存</Button>
          </DrawerFooter>
        </form>
    </MySheet>
  );
}
