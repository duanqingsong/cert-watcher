'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save } from 'lucide-react';

// 域名验证正则表达式
const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

export default function EditDomain({ params }) {
  const [domainName, setDomainName] = useState('');
  const [name, setName] = useState('');
  const [note, setNote] = useState('');
  const [domainError, setDomainError] = useState('');
  const [nameError, setNameError] = useState('');
  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    if (id) {
      fetchDomain();
    }
  }, [id]);

  const fetchDomain = async () => {
    const res = await axios.get(`/api/domains/${id}`);
    const { domain, name, note } = res.data;
    setDomainName(domain);
    setName(name);
    setNote(note);
  };

  const validateDomain = (value) => {
    if (!domainRegex.test(value)) {
      setDomainError('请输入有效的域名格式');
    } else {
      setDomainError('');
    }
  };

  const handleDomainChange = (e) => {
    const value = e.target.value;
    setDomainName(value);
    validateDomain(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!domainError && domainName) {
      await axios.put(`/api/domains/${id}`, { domain: domainName, name, note });
      router.push('/');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>编辑域名</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                onChange={(e) => setName(e.target.value)}
                required
              />
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
            <Button type="submit" className="w-full" disabled={!!domainError || !domainName}>
              <Save className="mr-2 h-4 w-4" /> 保存域名
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
