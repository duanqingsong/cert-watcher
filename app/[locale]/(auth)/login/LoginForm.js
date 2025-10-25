'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation'
import { signIn } from "next-auth/react"
import { Loader2 } from "lucide-react"
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const LoginForm = (props) => {
  const { searchParams, params } = props;
  const { callbackUrl, error: authError } = searchParams;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(authError);
  const [data, setData] = useState({ username: '', password: '' });
  const router = useRouter();
  const { t } = useTranslation()

  // 检查会话过期错误
  useEffect(() => {
    if (authError === 'SessionExpired') {
      toast.error('会话已过期，请重新登录')
    }
  }, [authError])

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData({
      ...data,
      [name]: value,
    });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError(origin => ({ ...origin, callbackError: '' }));
    try {
      const backUrl = callbackUrl || `/${params.locale}/dashboard`;
      setLoading(true);
      const result = await signIn("credentials", {
        redirect: false,
        callbackUrl: backUrl,
        ...data
      });
      // console.log("result==>",result)
      // console.log("backUrl==>",backUrl)
      if (!result?.error) {
        toast.success('登录成功')
        router.push(backUrl);
      } else {
        setLoading(false);
        let err = result.error;
        if (err) {
          console.error(err);
          err = decodeURIComponent(err) || t('common.tryAgainLater');
          setError(origin => ({ ...origin, callbackError: err }));
        }
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl"> {t('login.title')}</CardTitle>
        <CardDescription>
          {t('login.description')}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit}>
          <Input
            className="p-3 placeholder-opacity-0 mb-3 sm:placeholder-opacity-100"
            type="text"
            id="username"
            name="username"
            placeholder={t('login.username')}
            onChange={handleChange}
          />
          <Input
            className="p-3 placeholder-opacity-0 sm:placeholder-opacity-100"
            type="password"
            id="password"
            name="password"
            placeholder={t('login.password')}
            onChange={handleChange}
          />

          <Button
            type="submit"
            className="text-base w-full py-6 mt-3 mb-3"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {t('login.submit')}
          </Button>
          {(error?.callbackError || error?.message) && <Alert variant="destructive">
            <ExclamationTriangleIcon className="h-4 w-4" />
            {/* <AlertTitle>{t('login.error.default')}</AlertTitle> */}
            <AlertDescription>
              {error?.callbackError || error?.message || ''}
            </AlertDescription>
          </Alert>}
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link
          href="/forgot-password"
          className="text-sm text-blue-500 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {t('login.forgotPassword')}
        </Link>

        <Link
          href="/register"
          className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {t('login.noAccount')}
        </Link>
      </CardFooter>
    </Card>
  );
}

export default LoginForm;