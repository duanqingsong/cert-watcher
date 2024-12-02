'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ModeToggle } from '@/components/ModeToggle';
import { LanguageSwitch } from '@/components/LanguageSwitch';
export default function ForgotPassword() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setError('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || '操作失败');
      }

      setStatus('success');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  };

  return (<>
    <div className="flex items-center gap-2 p-4">
      <ModeToggle />
      <LanguageSwitch />
    </div>
    <Card className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <CardHeader>
        <CardTitle>
        <h1 className="text-2xl font-bold mb-6">{t('forgotPassword.title')}</h1>
        </CardTitle>
        <CardDescription>
          {t('forgotPassword.description')}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
      {status === 'success' ? (
        <div>
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {t('forgotPassword.success')}
          </div>
          <Link
            href="/login"
            className="text-blue-500 hover:text-blue-800"
          >
            {t('forgotPassword.returnToLogin')}
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <div className="mb-4">
            <Label htmlFor="email">
              {t('forgotPassword.email')}
            </Label>
            <Input
              id="email"
              type="email"
              // placeholder={t('forgotPassword.email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={status === 'loading'} className="w-full">
            {status === 'loading' ? t('forgotPassword.submitting') : t('forgotPassword.submit')}
          </Button>
        </form>
      )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link className="inline-block align-baseline text-sm text-blue-500 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" href="/login">{t('register.haveAccount')}</Link>
      </CardFooter>
    </Card>
    </>
  );
} 