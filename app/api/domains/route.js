import { NextResponse } from 'next/server';
import { getAllDomains, createDomain, getDomainByDomainName } from '@/models/Domain';
import { checkCertificate } from '@/lib/certCheck';

export async function GET() {
  try {
    console.log('处理域名相关请求...');
    const domains = await getAllDomains();
    console.log('域名请求处理完成');
    return NextResponse.json(domains);
  } catch (error) {
    console.error('获取域名列表失败:', error);
    return NextResponse.json({ error: '获取域名列表失败' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    console.log('处理域名相关请求...');
    const body = await request.json();
    console.log('Received data:', body);

    if (!body.domain) {
      return NextResponse.json({ error: '域名是必填项' }, { status: 400 });
    }

    // 检查域名是否已存在
    const existingDomain = await getDomainByDomainName(body.domain);
    if (existingDomain) {
      return NextResponse.json({ error: '该域名已经存在' }, { status: 409 });
    }

    let certInfo = null;
    let certError = null;
    try {
      certInfo = await checkCertificate(body.domain);
    } catch (error) {
      console.error('证书检查失败:', error);
      certError = error.message;
    }

    const newDomain = await createDomain({
      domain: body.domain,
      name: body.name,
      note: body.note,
      expiryDate: certInfo ? certInfo.expiryDate : null,
      issuer: certInfo ? certInfo.issuer : null,
      lastChecked: new Date().toISOString(),
      certCheckError: certError
    });

    console.log('域名请求处理完成');
    return NextResponse.json({
      domain: newDomain,
      certCheckSuccess: !certError,
      certCheckError: certError
    }, { status: 201 });
  } catch (error) {
    console.error('创建域名失败:', error);
    if (error.message.includes('UNIQUE constraint failed: domains.domain')) {
      return NextResponse.json({ error: '该域名已经存在' }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
