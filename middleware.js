import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function middleware(request) {
  const token = request.cookies.get('token')?.value;

  // 定义不需要验证的路径
  const publicPaths = ['/login'];
  const isPublicPath = publicPaths.includes(request.nextUrl.pathname);

  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token) {
    try {
      await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
      // 如果token有效，且用户试图访问登录页面，重定向到首页
      if (isPublicPath) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (error) {
      // 如果token无效，且不是公开路径，重定向到登录页面
      if (!isPublicPath) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
