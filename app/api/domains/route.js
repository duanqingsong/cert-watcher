import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Domain from '@/models/Domain';
import { checkCertificate } from '@/lib/certCheck';

export async function GET() {
  await dbConnect();
  try {
    const domains = await Domain.find({});
    return NextResponse.json(domains);
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json();
    console.log('Received data:', body);

    if (!body.domain) {
      return NextResponse.json({ error: '域名是必填项' }, { status: 400 });
    }

    // 检查域名是否已存在
    const existingDomain = await Domain.findOne({ domain: body.domain });
    if (existingDomain) {
      return NextResponse.json({ error: '该域名已存在' }, { status: 400 });
    }

    // 检查证书
    let certInfo = null;
    let certError = null;
    try {
      certInfo = await checkCertificate(body.domain);
    } catch (error) {
      console.error('证书检查失败:', error);
      certError = error.message;
    }

    const newDomain = new Domain({
      domain: body.domain,
      name: body.name,
      note: body.note,
      expiryDate: certInfo ? certInfo.expiryDate : null,
      issuer: certInfo ? certInfo.issuer : null,
      lastChecked: new Date(),
      certCheckError: certError
    });

    await newDomain.save();

    return NextResponse.json({
      domain: newDomain,
      certCheckSuccess: !certError,
      certCheckError: certError
    }, { status: 201 });
  } catch (error) {
    console.error('创建域名失败:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
