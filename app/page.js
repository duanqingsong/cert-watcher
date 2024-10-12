'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2, Edit, RefreshCw, Plus, RotateCw } from 'lucide-react';
import DomainDrawer from '@/components/DomainDrawer';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import { toast } from 'react-hot-toast';

function formatCountdown(expiryDate) {
  const now = new Date();
  const diff = expiryDate - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `${days}天 ${hours}小时 ${minutes}分钟`;
  } else {
    return `${hours}小时 ${minutes}分钟`;
  }
}

function formatLastChecked(date) {
  const now = new Date();
  const diff = now - new Date(date);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  if (days < 30) return `${days}天前`;
  return new Date(date).toLocaleDateString();
}

export default function Home() {
  const [domains, setDomains] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingDomain, setEditingDomain] = useState(null);
  const [, forceUpdate] = useState();
  const [refreshingDomains, setRefreshingDomains] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingDomain, setDeletingDomain] = useState(null);

  const fetchDomains = useCallback(async () => {
    const res = await axios.get('/api/domains');
    // 在前端进行排序
    const sortedDomains = res.data.sort((a, b) => {
      const timeA = new Date(a.expiryDate).getTime();
      const timeB = new Date(b.expiryDate).getTime();
      const nowTime = new Date().getTime();
      
      // 计算距离过期的时间（毫秒）
      const diffA = timeA - nowTime;
      const diffB = timeB - nowTime;
      
      // 如果两个域名都已过期或都未过期，按照到期时间正常排序
      if ((diffA < 0 && diffB < 0) || (diffA >= 0 && diffB >= 0)) {
        return timeA - timeB;
      }
      
      // 如果只有一个过期，将过期的排在后面
      return diffA < 0 ? 1 : -1;
    });
    setDomains(sortedDomains);
  }, []);

  useEffect(() => {
    fetchDomains();
    const interval = setInterval(() => forceUpdate({}), 60000);
    return () => clearInterval(interval);
  }, [fetchDomains]);

  const handleDelete = (domain) => {
    setDeletingDomain(domain);
    setDeleteConfirmOpen(true);
  };

  const performDelete = async () => {
    if (!deletingDomain) return;
    try {
      await axios.delete(`/api/domains/${deletingDomain._id}`);
      await fetchDomains();
      toast.success('域名删除成功');
    } catch (error) {
      console.error('删除域名失败:', error);
      toast.error('删除域名失败');
    } finally {
      setDeleteConfirmOpen(false);
      setDeletingDomain(null);
    }
  };

  const handleCheck = async (id) => {
    setRefreshingDomains(prev => ({ ...prev, [id]: true }));
    try {
      const response = await axios.post(`/api/domains/${id}`, { action: 'check' });
      await fetchDomains();
      toast.success('证书检查成功');
      console.log('更新后的域名信息:', response.data);
    } catch (error) {
      console.error('证书检查失败:', error);
      console.error('错误详情:', error.response?.data);
      const errorMessage = error.response?.data?.error || error.message;
      toast.error(`证书检查失败: ${errorMessage}`, {
        duration: 10000, // 增加显示时间
        style: {
          maxWidth: '500px',
          wordBreak: 'break-word'
        }
      });
    } finally {
      setRefreshingDomains(prev => ({ ...prev, [id]: false }));
    }
  };

  const openDrawer = (domain = null) => {
    setEditingDomain(domain);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setEditingDomain(null);
  };

  const handleSave = async (domainData) => {
    try {
      if (editingDomain) {
        await axios.put(`/api/domains/${editingDomain._id}`, domainData);
        toast.success('域名更新成功');
      } else {
        const response = await axios.post('/api/domains', domainData);
        console.log('Server response:', response.data);
        toast.success('域名添加成功');
      }
      await fetchDomains();
      closeDrawer();
    } catch (error) {
      console.error('保存域名失败:', error);
      console.error('错误详情:', error.response?.data);
      toast.error(`保存域名失败: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchDomains();
      toast.success('列表刷新成功');
    } catch (error) {
      console.error('刷新列表失败:', error);
      toast.error('刷新列表失败');
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">HTTPS 证书监控</h1>
      <div className="flex space-x-2 mb-4">
        <Button onClick={() => openDrawer()}>
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
      </div>
      <div className="overflow-x-auto">
        <Table className="w-full">
          <TableCaption>HTTPS 证书列表（按到期日期排序，快到期的排在前面）</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>网站名称</TableHead>
              <TableHead>域名</TableHead>
              <TableHead>颁发者</TableHead>
              <TableHead>到期日期</TableHead>
              <TableHead>倒计时</TableHead>
              <TableHead>最后检查时间</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {domains.map((domain) => {
              const expiryDate = new Date(domain.expiryDate);
              const countdown = formatCountdown(expiryDate);
              const isExpiringSoon = (expiryDate - new Date()) / (1000 * 60 * 60 * 24) < 5;
              return (
                <TableRow key={domain._id}>
                  <TableCell>{domain.name}</TableCell>
                  <TableCell>{domain.domain}</TableCell>
                  <TableCell>{domain.issuer}</TableCell>
                  <TableCell>{expiryDate.toLocaleString()}</TableCell>
                  <TableCell className={isExpiringSoon ? 'text-red-500 font-bold' : ''}>
                    {countdown}
                  </TableCell>
                  <TableCell>{formatLastChecked(domain.lastChecked)}</TableCell>
                  <TableCell>
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(domain)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => openDrawer(domain)} className="ml-2">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="icon" 
                      onClick={() => handleCheck(domain._id)} 
                      className={`ml-2 ${refreshingDomains[domain._id] ? 'animate-spin' : ''}`}
                      disabled={refreshingDomains[domain._id]}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <DomainDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        onSave={handleSave}
        domain={editingDomain}
      />
      <DeleteConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={performDelete}
        domainName={deletingDomain?.domain}
      />
    </div>
  );
}
