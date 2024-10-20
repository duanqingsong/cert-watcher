import { NextResponse } from 'next/server';
import { performCertificateCheck } from '@/lib/certCheck';

export async function POST() {
  try {
    await performCertificateCheck();
    return NextResponse.json({ success: true, message: '所有证书检查完成' });
  } catch (error) {
    console.error('证书检查失败:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
