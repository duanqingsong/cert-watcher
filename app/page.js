'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Plus, RotateCw, RefreshCw, Edit, CheckCircle, Trash2 } from 'lucide-react';
import DomainDrawer from '@/components/DomainDrawer';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import { toast } from 'react-hot-toast';
import { formatDate, formatCountdown, formatRelativeTime } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { signOut } from "next-auth/react"

function getExpiryColor(expiryDate) {
  if (!expiryDate) return 'text-gray-500';
  
  const now = new Date();
  const expiry = new Date(expiryDate);
  const daysUntilExpiry = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));

  if (daysUntilExpiry <= 0) return 'text-red-600';
  if (daysUntilExpiry <= 3) return 'text-yellow-600';
  return 'text-gray-900';
}

export default function Home() {
  const [domains, setDomains] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCheckingAll, setIsCheckingAll] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [domainToDelete, setDomainToDelete] = useState(null);
  const [editingDomain, setEditingDomain] = useState(null);
  const [checkingDomains, setCheckingDomains] = useState({});
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.replace('/login');
    } else {
      fetchDomains();
    }
  }, []);

  const fetchDomains = async () => {
    try {
      const response = await axios.get('/api/domains');
      setDomains(response.data);
    } catch (error) {
      console.error('获取域名列表失败:', error);
      if (error.response && error.response.status === 401) {
        // 如果是未授权错误，重定向到登录页面
        router.push('/login');
      } else {
        toast.error('获取域名列表失败');
      }
    }
  };

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const handleSaveDomain = async (domainData) => {
    try {
      if (editingDomain) {
        // 编辑现有域名
        await axios.put(`/api/domains/${editingDomain.id}`, domainData);
        toast.success('域名已更新');
      } else {
        // 创建新域名
        await axios.post('/api/domains', domainData);
        toast.success('新域名已添加');
      }
      await fetchDomains();
      closeDrawer();
      setEditingDomain(null);
      return { success: true };
    } catch (error) {
      console.error('保存域名失败:', error);
      toast.error(error.response?.data?.error || '保存域名失败');
      return { success: false, error: error.response?.data?.error || '保存域名失败' };
    }
  };

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      await fetchDomains();
      toast.success('域名列表已刷新');
    } catch (error) {
      console.error('刷新域名列表失败:', error);
      toast.error('刷新域名列表失败');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCheckAll = async () => {
    if (isCheckingAll) return;
    setIsCheckingAll(true);
    try {
      await axios.post('/api/check-all');
      toast.success('所有证书检查完成');
      await fetchDomains();
    } catch (error) {
      console.error('检查所有证书失败:', error);
      toast.error('检查所有证书失败');
    } finally {
      setIsCheckingAll(false);
    }
  };

  const handleDelete = (domain) => {
    setDomainToDelete(domain);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!domainToDelete) return;
    try {
      await axios.delete(`/api/domains/${domainToDelete.id}`);
      toast.success('域名已删除');
      await fetchDomains();
    } catch (error) {
      console.error('删除域名失败:', error);
      toast.error('删除域名失败');
    } finally {
      setDeleteConfirmOpen(false);
      setDomainToDelete(null);
    }
  };

  const handleEdit = (domain) => {
    // 这里可以打开编辑抽屉或导航到编辑页面
    setIsDrawerOpen(true);
    // 假设您的 DomainDrawer 组件接受一个 domain 属性来预填表单
    setEditingDomain(domain);
  };

  const handleCheckCertificate = async (domainId) => {
    setCheckingDomains(prev => ({ ...prev, [domainId]: true }));
    try {
      const response = await axios.post(`/api/domains/${domainId}`, { action: 'check' });
      if (response.status === 200) {
        toast.success('证书状态已更新');
        await fetchDomains();
      } else {
        throw new Error(response.data.error || '检查证书状态失败');
      }
    } catch (error) {
      console.error('检查证书状态时出错:', error);
      toast.error(error.response?.data?.details || error.message || '检查证书状态时发生错误');
    } finally {
      setCheckingDomains(prev => ({ ...prev, [domainId]: false }));
    }
  };

  const handleLogout = async () => {
    try {
      signOut({redirect:true});
    } catch (error) {
      console.error('登出错误:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-primary">HTTPS 证书监控</h1>
        <Button onClick={handleLogout} variant="outline">
          登出
        </Button>
      </div>
      <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
        <div className="flex space-x-2">
          <Button onClick={openDrawer} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" /> 添加新域名
          </Button>
          <Button 
            onClick={handleRefresh} 
            disabled={isRefreshing} 
            variant="secondary"
            className="transition-colors duration-300"
          >
            <RotateCw className={`mr-2 h-4 w-4 transition-transform duration-300 ${isRefreshing ? 'animate-spin' : ''}`} />
            刷新列表
          </Button>
          <Button 
            variant="secondary" 
            onClick={handleCheckAll}
            disabled={isCheckingAll}
            className="transition-colors duration-300"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isCheckingAll ? 'animate-spin' : ''}`} />
            检查所有证书
          </Button>
        </div>
      </div>

      {/* 域名列表 */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">网站名称</th>
              <th className="px-4 py-2">域名</th>
              <th className="px-4 py-2">证书颁发机构</th>
              <th className="px-4 py-2">到期时间</th>
              <th className="px-4 py-2">剩余时间</th>
              <th className="px-4 py-2">最后检查</th>
              <th className="px-4 py-2">操作</th>
            </tr>
          </thead>
          <tbody>
            {domains.map((domain) => (
              <tr key={domain.id} className="border-b">
                <td className="px-4 py-2">{domain.name}</td>
                <td className="px-4 py-2">{domain.domain}</td>
                <td className="px-4 py-2">{domain.issuer}</td>
                <td className={`px-4 py-2 ${getExpiryColor(domain.expiryDate)}`}>
                  {formatDate(domain.expiryDate)}
                </td>
                <td className={`px-4 py-2 ${getExpiryColor(domain.expiryDate)}`}>
                  {formatCountdown(domain.expiryDate)}
                </td>
                <td className="px-4 py-2">{formatRelativeTime(domain.lastChecked)}</td>
                <td className="px-4 py-2">
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleEdit(domain)}
                      title="修改"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleCheckCertificate(domain.id)}
                      disabled={checkingDomains[domain.id]}
                      title={checkingDomains[domain.id] ? '检查中' : '检查证书'}
                    >
                      <CheckCircle className={`h-4 w-4 ${checkingDomains[domain.id] ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      onClick={() => handleDelete(domain)}
                      title="删除"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DomainDrawer
        isOpen={isDrawerOpen}
        onClose={() => {
          closeDrawer();
          setEditingDomain(null);
        }}
        onSave={handleSaveDomain}
        domain={editingDomain}
      />

      <DeleteConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        domainName={domainToDelete?.domain}
      />
    </div>
  );
}
