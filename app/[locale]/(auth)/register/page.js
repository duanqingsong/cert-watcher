'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from 'react-i18next';
import { ModeToggle } from '@/components/ModeToggle';
import { LanguageSwitch } from '@/components/LanguageSwitch';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from 'next/link';
export default function Register() {
  const { t } = useTranslation();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '注册失败');
      }

      // 请查收验证邮件
      router.push('/login?message=');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (<>
   <div className="flex items-center gap-2 p-4">
      <ModeToggle />
      <LanguageSwitch />
    </div>
    
    <Card className="max-w-md mx-auto mt-10 p-6 bg-white  dark:bg-gray-800">
      <CardHeader>
        <CardTitle>
          {t('register.title')}
        </CardTitle>
        <CardDescription>
          {t('register.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label htmlFor="email">
            {t('register.email')}
          </Label>
          <Input
            id="email"
            type="email"
            placeholder={t('register.email')}
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="password">
            {t('register.password')}
          </Label>
          <Input
            id="password"
            type="password"
            placeholder={t('register.password')}
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
        </div>
        <div className="mb-6">
          <Label htmlFor="confirmPassword">
            {t('register.confirmPassword')}
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            required
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? t('register.loading') : t('register.submit')}
        </Button>
      </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link className="inline-block align-baseline text-sm text-blue-500 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" href="/login">{t('register.haveAccount')}</Link>
      </CardFooter>
    </Card>
    </>
  );
} 