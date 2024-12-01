import { NextResponse } from 'next/server';
import { User } from '@/models/User';
import { sign } from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    const user = await User.findByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: '邮箱或密码错误' },
        { status: 400 }
      );
    }

    const isValidPassword = await User.comparePassword(user.password, password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: '邮箱或密码错误' },
        { status: 400 }
      );
    }

    if (!user.isEmailVerified) {
      return NextResponse.json(
        { error: '请先验证您的邮箱' },
        { status: 400 }
      );
    }

    // 创建 JWT token
    const token = sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 设置 cookie
    cookies().set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7天
      path: '/',
    });

    return NextResponse.json({
      message: '登录成功',
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
      }
    });
  } catch (error) {
    console.error('登录错误:', error);
    return NextResponse.json(
      { error: '登录失败，请稍后重试' },
      { status: 500 }
    );
  }
} 