import { NextResponse } from 'next/server'
import acceptLanguage from 'accept-language'
import { verify } from 'jsonwebtoken'

acceptLanguage.languages(['en', 'zh'])

const protectedPaths = [
  '/dashboard',
  '/profile',
  // 添加其他需要保护的路径
]

export const config = {
  matcher: [
    // 跳过不需要重定向的路径
    '/((?!api|_next/static|_next/image|favicon.ico|locales|.*\\.).*)'
  ]
}

export function middleware(request) {
  const pathname = request.nextUrl.pathname
  
  // 检查URL是否已经包含语言前缀
  const pathnameIsMissingLocale = ['en', 'zh'].every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )
  
  if (pathnameIsMissingLocale) {
    // 获取用户首选语言
    let locale
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

  // 检查是否是受保护的路径
  if (protectedPaths.some(prefix => pathname.startsWith(prefix))) {
    const token = request.cookies.get('auth_token')?.value

    if (!token) {
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url))
    }

    try {
      // 验证 token
      verify(token, process.env.JWT_SECRET)
      return NextResponse.next()
    } catch (error) {
      // token 无效或过期
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url))
    }
  }

  return NextResponse.next()
}

