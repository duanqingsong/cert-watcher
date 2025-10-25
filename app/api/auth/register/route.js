import { NextResponse } from 'next/server';
import { User } from '@/models/User';
import crypto from 'crypto';
// import { sendVerificationEmail } from '@/lib/email';

export const dynamic = 'force-dynamic'

export async function POST(request) {
  try {
    const { email, password, confirmPassword } = await request.json();

    // 验证密码
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: '两次输入的密码不匹配' },
        { status: 400 }
      );
    }

    // 检查邮箱是否已存在
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: '该邮箱已被注册' },
        { status: 400 }
      );
    }

    // 创建用户
    const user = await User.create({ email, password });

    // 生成验证token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    // 24小时后过期
    const verificationExpires = Date.now() + 24 * 60 * 60 * 1000; 

    await User.updateVerificationToken(user.id, verificationToken, verificationExpires);

    // 发送验证邮件
    // await sendVerificationEmail(email, verificationToken);

    return NextResponse.json({
      message: '注册成功!'
    });
  } catch (error) {
    console.error('注册错误:', error);
    return NextResponse.json(
      { error: '注册失败，请稍后重试' },
      { status: 500 }
    );
  }
} 