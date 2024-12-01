'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from 'react-i18next';

export default function Profile() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [nickname, setNickname] = useState('');
  const [updateStatus, setUpdateStatus] = useState('idle');
  const { t } = useTranslation();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await fetch('/api/auth/profile');
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '获取用户信息失败');
      }

      setUserData(data.user);
      setNickname(data.user.nickname || '');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateStatus('loading');
    setError('');

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nickname }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '更新失败');
      }

      setUserData(data.user);
      setUpdateStatus('success');
    } catch (err) {
      setError(err.message);
      setUpdateStatus('error');
    }
  };

  if (loading) {
    return <div className="text-center mt-10">加载中...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h1 className="text-2xl font-bold mb-6">{t('profile.title')}</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {updateStatus === 'success' && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {t('profile.updateSuccess')}
        </div>
      )}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          {t('profile.email')}
        </label>
        <div className="text-gray-600">{userData?.email}</div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            {t('profile.nickname')}
          </label>
          <Input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={updateStatus === 'loading'}>
          {updateStatus === 'loading' ? t('profile.updating') : t('profile.updateInfo')}
        </Button>
      </form>
    </div>
  );
} 