'use client'

import { I18nextProvider } from 'react-i18next'
import { useEffect, useState } from 'react'
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import { usePathname } from 'next/navigation'

// 导入翻译文件
import en from '@/public/locales/en/common.json'
import zh from '@/public/locales/zh/common.json'

i18next
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: en },
      zh: { common: zh }
    },
    ns: ['common'],
    defaultNS: 'common',
    fallbackLng: 'zh',
  })

export default function I18nProvider({ children }) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const locale = pathname.split('/')[1]
    i18next.changeLanguage(locale)
    setMounted(true)
  }, [pathname])

  if (!mounted) return null

  return (
    <I18nextProvider i18n={i18next}>
      {children}
    </I18nextProvider>
  )
} 