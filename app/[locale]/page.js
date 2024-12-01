'use client';

import { useState, useEffect, useContext } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, RotateCw, RefreshCw, Edit, CheckCircle, Trash2 } from 'lucide-react';
import DomainEditor from '@/components/DomainEditor';
import DeleteConfirmDialog from '@/components/DeleteConfirmDialog';
import { toast } from 'react-hot-toast';
import { formatDate, formatCountdown, formatRelativeTime } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { signOut } from "next-auth/react"
import { checkAllDomain, checkDomainById, deleteDomain, getAllDomain, saveDomain } from '@/actions/domain-actions';
import { ModeToggle } from '@/components/ModeToggle';
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow,
  TableCaption,
  TableFooter,
} from "@/components/ui/table"
import { EditActions } from '@/components/EditActions';
import { LanguageSwitch } from '@/components/LanguageSwitch'

function getExpiryColor(expiryDate) {
  if (!expiryDate) return '';
  
  const now = new Date();
  const expiry = new Date(expiryDate);
  const daysUntilExpiry = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));

  if (daysUntilExpiry <= 0) return 'text-red-600';
  if (daysUntilExpiry <= 3) return 'text-yellow-600';
  return '';
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
  // const { toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    fetchDomains();
  }, []);

  // 获取域名列表
  const fetchDomains = async () => {
    try {
      setIsRefreshing(true);
      const result=await getAllDomain();
      console.log("getAllDomain result==>",result)
      if (result.success==1) {
        setDomains(result.data);
      }else{
        toast.error(result.message);
      }
    } catch (error) {
      console.error('获取域名列表失败:', error);
      if (error.response && error.response.status === 401) {
        // 如果是未授权错误，重定向到登录页面
        router.push('/login');
      } else {
        toast.error('获取域名列表失败');
      }
    }finally{
      setIsRefreshing(false);
    }
  };

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);
  // 保存域名
  const handleSaveDomain = async (domainData) => {
    try {
      const result=await saveDomain({...domainData,id:editingDomain?.id||''});
      if(result.success){
        toast.success('域名已保存');
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
  // 刷新域名列表
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
  // 检查所有证书
  const handleCheckAll = async () => {
    if (isCheckingAll) return;
    setIsCheckingAll(true);
    try {
      const result=await checkAllDomain();
      if (result.success) {
        toast.success('所有证书检查完成');
        await fetchDomains();
      }else{
        toast.error(result.message);
      }
    } catch (error) {
      console.error('检查所有证书失败:', error);
      toast.error('检查所有证书失败');
    } finally {
      setIsCheckingAll(false);
    }
  };
  // 删除域名
  const handleDelete = (domain) => {
    setDomainToDelete(domain);
    setDeleteConfirmOpen(true);
  };
  // 确认删除
  const confirmDelete = async () => {
    if (!domainToDelete) return;
    try {
      const result =await deleteDomain(domainToDelete.id);
      if(result.success){
        toast.success('域名已删除');
        await fetchDomains();
      }else{
        toast.error(result.message);
      }
      
    } catch (error) {
      console.error('删除域名失败:', error);
      toast.error('删除域名失败');
    } finally {
      setDeleteConfirmOpen(false);
      setDomainToDelete(null);
    }
  };
  // 编辑域名
  const handleEdit = (domain) => {
    // 这里可以打开编辑抽屉或导航到编辑页面
    setIsDrawerOpen(true);
    // 假设您的 DomainEditor 组件接受一个 domain 属性来预填表单
    setEditingDomain(domain);
  };
  // 检查证书
  const handleCheckCertificate = async (domainId) => {
    setCheckingDomains(prev => ({ ...prev, [domainId]: true }));
    try {
      const result= await checkDomainById(domainId);
      if (result.success) {
        toast.success('证书状态已更新');
        await fetchDomains();
      } else {
        throw new Error(result.error || '检查证书状态失败');
      }
      
    } catch (error) {
      console.error('检查证书状态时出错:', error);
      toast.error(error.response?.data?.details || error.message || '检查证书状态时发生错误');
    } finally {
      setCheckingDomains(prev => ({ ...prev, [domainId]: false }));
    }
  };

  // 登出
  const handleLogout = async () => {
    try {
      await signOut({redirect:true,callbackUrl:'/login'});
    } catch (error) {
      console.error('登出错误:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-primary">HTTPS 证书监控</h1>
        <div className="flex space-x-2">
          {/* 切换语言 */}
          <LanguageSwitch />
          {/* 切换主题 */}
          <ModeToggle />
          <Button onClick={handleLogout} variant="outline">
            登出
          </Button>
        </div>
      </div>
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md mb-4">
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
      <div className=" bg-white border border-gray-200 dark:border-gray-700 dark:bg-gray-700 p-3 rounded-lg shadow-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-black dark:text-white" >网站名称</TableHead>
              <TableHead className="text-black dark:text-white">域名</TableHead>
              <TableHead className="text-black dark:text-white">证书颁发机构</TableHead>
              <TableHead className="text-black dark:text-white">到期时间</TableHead>
              <TableHead className="text-black dark:text-white">剩余时间</TableHead>
              <TableHead className="text-black dark:text-white">最后检查</TableHead>
              <TableHead className="text-black dark:text-white flex justify-center">
                操作
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {domains&&domains.length>0&&domains.map((domain) => (
              <TableRow key={domain.id} className="border-b">
                <TableCell>{domain.name}</TableCell>
                <TableCell>{domain.domain}</TableCell>
                <TableCell>{domain.issuer}</TableCell>
                <TableCell className={` ${getExpiryColor(domain.expiryDate)}`}>
                  {formatDate(domain.expiryDate)}
                </TableCell>
                <TableCell className={` ${getExpiryColor(domain.expiryDate)}`}>
                  {formatCountdown(domain.expiryDate)}
                </TableCell>
                <TableCell>{formatRelativeTime(domain.lastChecked)}</TableCell>
                <TableCell className="w-fit">
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleCheckCertificate(domain.id)}
                      disabled={checkingDomains[domain.id]}
                      title={checkingDomains[domain.id] ? '检查中' : '检查证书'}
                    >
                      <CheckCircle className={`h-4 w-4 ${checkingDomains[domain.id] ? 'animate-spin' : ''}`} />
                    </Button>
                    
                    <EditActions 
                      onEdit={() => handleEdit(domain)} 
                      onDelete={() => handleDelete(domain)} 
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DomainEditor
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
