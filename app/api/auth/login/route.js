import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // 请在生产环境中使用环境变量

export async function POST(request) {
  const { username, password } = await request.json();

  if (username === 'travelx' && password === 'travelX@2024') {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    
    const response = NextResponse.json({ success: true });
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600, // 1小时
      path: '/',
    });

    return response;
  } else {
    return NextResponse.json({ success: false, error: '用户名或密码错误' }, { status: 401 });
  }
}
