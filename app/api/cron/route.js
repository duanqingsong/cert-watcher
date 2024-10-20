import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Domain from '@/models/Domain';
import { updateDomainCertInfo } from '@/lib/certCheck';

export async function GET() {
  await dbConnect();
  try {
    const domains = await Domain.find({});
    for (const domain of domains) {
      await updateDomainCertInfo(domain._id);
    }
    return NextResponse.json({ success: true, message: '定时检查完成' });
  } catch (error) {
    console.error('定时检查失败', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
