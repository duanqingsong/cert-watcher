import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token');
  const path = request.nextUrl.pathname;

  // 检查是否是 HTTPS
  const proto = request.headers.get("x-forwarded-proto") || request.nextUrl.protocol.slice(0, -1);
  const isSecure = proto === "https";

  // 允许访问登录页面和API路由
  if (path === '/login' || path.startsWith('/api/')) {
    return NextResponse.next();
  }

  // 如果没有token，重定向到登录页面
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    if (isSecure) {
      loginUrl.protocol = 'https:';
    }
    return NextResponse.redirect(loginUrl);
  }

  // 其他情况，允许访问
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
