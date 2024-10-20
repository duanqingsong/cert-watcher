'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from 'react-hot-toast';
import axios from 'axios';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post('/api/auth/login', { username, password });
      if (response.data.success) {
        router.push('/');
      } else {
        toast.error('登录失败');
      }
    } catch (error) {
      console.error('登录错误:', error);
      toast.error(error.response?.data?.error || '登录失败');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-indigo-700 mb-4">HTTPS 证书监控</h1>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          实时监控您的 HTTPS 证书，确保网站安全性。自动提醒续期，防止证书过期带来的风险。
        </p>
      </div>
      
      <Card className="w-[400px] shadow-xl">
        <CardHeader className="bg-indigo-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl">用户登录</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-indigo-600">用户名</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-indigo-600">密码</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={isLoading}>
              {isLoading ? '登录中...' : '登录'}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      <footer className="mt-8 text-center text-gray-600">
        <p>本系统由 AI 全程开发</p>
        <p className="mt-2">© 2024 TravelX.Pro 保留所有权利。</p>
      </footer>
    </div>
  );
}
