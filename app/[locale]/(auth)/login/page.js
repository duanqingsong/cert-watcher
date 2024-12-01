'use client'

import LoginForm from './LoginForm'
import { LanguageSwitch } from '@/components/LanguageSwitch'
import { ModeToggle } from '@/components/ModeToggle'

export default function LoginPage(props) {
  const {searchParams,params} = props;

  return (<>
    <div className="flex items-center gap-2 p-4">
      <ModeToggle />
      <LanguageSwitch />
    </div>
    <div className="flex flex-col items-center  min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <LoginForm params={params} searchParams={searchParams}/>
      </div>
    </div>
    </>
  )
} 