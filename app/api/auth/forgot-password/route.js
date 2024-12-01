import { NextResponse } from 'next/server';
import { User } from '@/models/User';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(request) {
  try {
    const { email } = await request.json();

    const user = await User.findByEmail(email);
    if (!user) {
      // 为了安全，即使用户不存在也返回成功
      return NextResponse.json({
        message: '如果该邮箱已注册，您将收到密码重置邮件'
      });
    }

    // 生成重置令牌
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = Date.now() + 3600000; // 1小时后过期

    await User.updateResetToken(user.id, resetToken, resetExpires);

    // 发送重置邮件
    await sendPasswordResetEmail(email, resetToken);

    return NextResponse.json({
      message: '如果该邮箱已注册，您将收到密码重置邮件'
    });
  } catch (error) {
    console.error('忘记密码错误:', error);
    return NextResponse.json(
      { error: '操作失败，请稍后重试' },
      { status: 500 }
    );
  }
} 