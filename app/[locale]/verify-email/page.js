'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next'; // 引入国际化支持

export default function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const { t } = useTranslation(); // 初始化翻译

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get('token');
        if (!token) {
          setStatus('error');
          return;
        }

        const res = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error);
        }

        setStatus('success');
      } catch (err) {
        setStatus('error');
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
      <h1 className="text-2xl font-bold mb-6">{t('verifyEmail.title')}</h1>
      {status === 'verifying' && (
        <div className="text-gray-600">{t('verifyEmail.verifying')}</div>
      )}
      {status === 'success' && (
        <div>
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {t('verifyEmail.success')}
          </div>
          <Link
            href="/login"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline inline-block"
          >
            {t('verifyEmail.goToLogin')}
          </Link>
        </div>
      )}
      {status === 'error' && (
        <div>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {t('verifyEmail.error')}
          </div>
          <Link
            href="/login"
            className="text-blue-500 hover:text-blue-800"
          >
            {t('verifyEmail.returnToLogin')}
          </Link>
        </div>
      )}
    </div>
  );
} 