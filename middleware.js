import { NextResponse } from 'next/server'
import acceptLanguage from 'accept-language'
import { getToken } from 'next-auth/jwt'

acceptLanguage.languages(['en', 'zh'])

const protectedPaths = [
  '/dashboard',
  '/profile',
  '/domains', // 添加域名管理页面
  // 添加其他需要保护的路径
]

export const config = {
  matcher: [
    // 跳过不需要重定向的路径
    '/((?!api|_next/static|_next/image|favicon.ico|locales|.*\\.).*)'
  ]
}

export async function middleware(request) {
  const pathname = request.nextUrl.pathname
  
  // 获取当前语言
  let locale = 'zh'
  
  // 检查URL是否已经包含语言前缀
  const pathnameIsMissingLocale = ['en', 'zh'].every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )
  
  // 从路径中提取语言或使用默认语言
  if (!pathnameIsMissingLocale) {
    locale = pathname.split('/')[1]
  } else {
    // 获取用户首选语言
    if (request.cookies.has('NEXT_LOCALE')) {
      locale = request.cookies.get('NEXT_LOCALE').value
    } else {
      const acceptLang = request.headers.get('accept-language')
      locale = acceptLang ? acceptLanguage.get(acceptLang) : 'zh'
      if (!locale) locale = 'zh'
    }

    // 重定向到带有语言前缀的URL
    const newUrl = new URL(`/${locale}${pathname === '/' ? '' : pathname}`, request.url)
    return NextResponse.redirect(newUrl)
  }

  // 检查是否是受保护的路径 (移除语言前缀进行检查)
  const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/'
  const isProtectedPath = protectedPaths.some(prefix => pathWithoutLocale.startsWith(prefix))
  
  if (isProtectedPath) {
    try {
      // 使用 next-auth 的 getToken 方法获取会话
      const token = await getToken({ 
        req: request, 
        secret: process.env.NEXTAUTH_SECRET 
      })

      if (!token) {
        // 没有有效的会话，重定向到登录页面
        const loginUrl = new URL(`/${locale}/login`, request.url)
        loginUrl.searchParams.set('callbackUrl', request.url)
        return NextResponse.redirect(loginUrl)
      }

      // 检查会话是否过期
      if (token.exp && Date.now() >= token.exp * 1000) {
        // 会话已过期，重定向到登录页面
        const loginUrl = new URL(`/${locale}/login`, request.url)
        loginUrl.searchParams.set('callbackUrl', request.url)
        loginUrl.searchParams.set('error', 'SessionExpired')
        return NextResponse.redirect(loginUrl)
      }

      // 会话有效，继续请求
      return NextResponse.next()
    } catch (error) {
      console.error('验证会话时出错:', error)
      // 验证失败，重定向到登录页面
      const loginUrl = new URL(`/${locale}/login`, request.url)
      loginUrl.searchParams.set('callbackUrl', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

