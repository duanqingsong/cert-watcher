import { NextResponse } from 'next/server';
import { getDomainById, updateDomain, deleteDomain } from '@/models/Domain';
import { checkCertificate } from '@/lib/certCheck';

export async function GET(request, { params }) {
  const { id } = params;
  try {
    const domain = await getDomainById(id);
    if (!domain) {
      return NextResponse.json({ error: '域名不存在' }, { status: 404 });
    }
    return NextResponse.json(domain);
  } catch (error) {
    console.error('获取域名失败:', error);
    return NextResponse.json({ error: '获取域名失败' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const { id } = params;
  const updateData = await request.json();
  try {
    const updatedDomain = await updateDomain(id, updateData);
    return NextResponse.json(updatedDomain);
  } catch (error) {
    console.error('更新域名失败:', error);
    return NextResponse.json({ error: '更新域名失败' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;
  try {
    await deleteDomain(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除域名失败:', error);
    return NextResponse.json({ error: '删除域名失败' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  const { id } = params;

  try {
    console.log(`开始检查域名 ID: ${id} 的证书`);
    const domain = await getDomainById(id);
    if (!domain) {
      console.log(`域名 ID: ${id} 不存在`);
      return NextResponse.json({ error: '域名不存在' }, { status: 404 });
    }

    console.log(`正在检查域名: ${domain.domain} 的证书`);
    const certInfo = await checkCertificate(domain.domain);
    
    const updateData = {
      expiryDate: certInfo.expiryDate,
      issuer: certInfo.issuer,
      lastChecked: new Date().toISOString(),
      certCheckError: null
    };

    console.log(`更新域名 ID: ${id} 的证书信息`, updateData);
    const updatedDomain = await updateDomain(id, updateData);

    return NextResponse.json(updatedDomain);
  } catch (error) {
    console.error(`检查证书失败 (域名 ID: ${id}):`, error);
    
    let errorMessage = error.message;
    if (error.code === 'ENOTFOUND') {
      errorMessage = `域名 ${domain.domain} 无法解析，请检查域名是否正确`;
    }

    // 更新最后检查时间和错误信息
    await updateDomain(id, {
      lastChecked: new Date().toISOString(),
      certCheckError: errorMessage
    });

    return NextResponse.json({ error: '证书检查失败', details: errorMessage }, { status: 500 });
  }
}
