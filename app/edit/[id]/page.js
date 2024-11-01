'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { saveDomain, getDomain } from '@/app/actions/domain-actions';
import { toast } from 'react-hot-toast';

export default function EditDomain({ params }) {
  const [domain, setDomain] = useState({ name: '', url: '' });
  const router = useRouter();

  useEffect(() => {
    async function fetchDomain() {
      const fetchedDomain = await getDomain(params.id);
      setDomain(fetchedDomain);
    }
    fetchDomain();
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await saveDomain({ ...domain, id: params.id });
      toast.success('域名已更新');
      router.push('/');
    } catch (error) {
      toast.error('更新失败: ' + error.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">编辑域名</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-2">名称</label>
          <Input
            id="name"
            type="text"
            value={domain.name}
            onChange={(e) => setDomain({ ...domain, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label htmlFor="url" className="block mb-2">URL</label>
          <Input
            id="url"
            type="url"
            value={domain.url}
            onChange={(e) => setDomain({ ...domain, url: e.target.value })}
            required
          />
        </div>
        <Button type="submit">保存</Button>
      </form>
    </div>
  );
}
