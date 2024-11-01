'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation'
import { signIn } from "next-auth/react"
import { Loader2 } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
 

const LoginForm = (props) => {
  const { searchParams } = props;
  const { callbackUrl, error: authError } = searchParams;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(authError);
  const [data, setData] = useState({ username: '', password: '' });
  const router = useRouter();

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
      const backUrl = callbackUrl || "/";
      setLoading(true);
      const result = await signIn("credentials", {
        redirect: false,
        callbackUrl: backUrl,
        ...data
      });
      if (!result?.error) {
        router.push(backUrl);
      } else {
        setLoading(false);
        let err = result.error;
        if (err) {
          console.error(err);
          err = decodeURIComponent(err) || '稍后重试';
          setError(origin => ({ ...origin, callbackError: err }));
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        className="p-3 placeholder-opacity-0 mb-3 sm:placeholder-opacity-100"
        type="text"
        id="username"
        name="username"
        placeholder='输入用户名'
        onChange={handleChange}
      />
      <Input
        className="p-3 placeholder-opacity-0 sm:placeholder-opacity-100"
        type="password"
        id="password"
        name="password"
        placeholder='输入密码'
        onChange={handleChange}
      />
      <Button
        type="submit"
        className="text-base w-full py-6 mt-3 mb-3"
      >
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {'登录'}
      </Button>
      {(error?.callbackError || error?.message)&&<Alert variant="destructive">
        <ExclamationTriangleIcon className="h-4 w-4" />
        <AlertTitle>错误</AlertTitle>
        <AlertDescription>
          {error?.callbackError || error?.message || ''}
        </AlertDescription>
      </Alert>}
    </form>
  );
}

export default LoginForm;