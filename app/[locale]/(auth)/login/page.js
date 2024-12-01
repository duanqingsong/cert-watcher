'use client'

import { useTranslation } from 'react-i18next'
import LoginForm from './LoginForm'
import { LanguageSwitch } from '@/components/LanguageSwitch'
import { ModeToggle } from '@/components/ModeToggle'

export default function LoginPage(props) {
  const { t } = useTranslation()
  const {searchParams,params} = props;

  return (<>
    <div className="flex items-center gap-2 p-4">
      <ModeToggle />
      <LanguageSwitch />
    </div>
    <div className="flex flex-col items-center  min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <h2 className="mt-6 text-3xl font-bold tracking-tight">
            {t('login.title')}
          </h2>
        </div>
        <LoginForm params={params} searchParams={searchParams}/>
      </div>
    </div>
    </>
  )
} 