import { NextResponse } from 'next/server';
import { User } from '@/models/User';

export const dynamic = 'force-dynamic'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: '无效的验证链接' },
        { status: 400 }
      );
    }

    const user = await User.findByVerificationToken(token);

    if (!user) {
      return NextResponse.json(
        { error: '验证链接已过期或无效' },
        { status: 400 }
      );
    }

    await User.verifyEmail(user.id);

    return NextResponse.json({
      message: '邮箱验证成功'
    });
  } catch (error) {
    console.error('邮箱验证错误:', error);
    return NextResponse.json(
      { error: '验证失败，请稍后重试' },
      { status: 500 }
    );
  }
} 