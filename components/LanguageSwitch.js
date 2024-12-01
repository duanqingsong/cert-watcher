'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { useEffect, useState } from 'react'
import { setCookie } from 'cookies-next'

export function LanguageSwitch() {
  const router = useRouter()
  const pathname = usePathname()
  const [currentLocale, setCurrentLocale] = useState('zh')

  useEffect(() => {
    const pathLocale = pathname.split('/')[1]
    const savedLocale = localStorage.getItem('locale')
    
    const locale = pathLocale || savedLocale || 'zh'
    setCurrentLocale(locale)
    
    if (locale !== savedLocale) {
      localStorage.setItem('locale', locale)
    }
  }, [pathname])

  const toggleLanguage = () => {
    const newLocale = currentLocale === 'en' ? 'zh' : 'en'
    const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`)
    
    setCookie('NEXT_LOCALE', newLocale)
    localStorage.setItem('locale', newLocale)
    
    router.push(newPath)
  }

  return (
    <Button variant="ghost" onClick={toggleLanguage}>
      {currentLocale === 'en' ? '中文' : 'English'}
    </Button>
  )
} 