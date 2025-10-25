import { NextResponse } from 'next/server';
import { User } from '@/models/User';

export const dynamic = 'force-dynamic'

export async function POST(request) {
  try {
    const { token, password } = await request.json();

    const user = await User.findByResetToken(token);

    if (!user) {
      return NextResponse.json(
        { error: '密码重置链接已过期或无效' },
        { status: 400 }
      );
    }

    await User.updatePassword(user.id, password);

    return NextResponse.json({
      message: '密码重置成功'
    });
  } catch (error) {
    console.error('重置密码错误:', error);
    return NextResponse.json(
      { error: '重置失败，请稍后重试' },
      { status: 500 }
    );
  }
} 