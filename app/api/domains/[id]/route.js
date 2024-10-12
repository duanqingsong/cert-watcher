import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Domain from '@/models/Domain';
import { checkCertificate } from '@/lib/certCheck';

export async function GET(request, { params }) {
  const { id } = params;
  await dbConnect();
  try {
    const domain = await Domain.findById(id);
    if (!domain) {
      return NextResponse.json({ success: false }, { status: 404 });
    }
    return NextResponse.json(domain);
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

export async function PUT(request, { params }) {
  const { id } = params;
  await dbConnect();
  try {
    const body = await request.json();
    const domain = await Domain.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!domain) {
      return NextResponse.json({ success: false }, { status: 404 });
    }
    return NextResponse.json(domain);
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;
  await dbConnect();
  try {
    const deletedDomain = await Domain.deleteOne({ _id: id });
    if (!deletedDomain) {
      return NextResponse.json({ success: false }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

export async function POST(request, { params }) {
  const { id } = params;
  await dbConnect();
  const body = await request.json();
  if (body.action === 'check') {
    try {
      const domain = await Domain.findById(id);
      if (!domain) {
        return NextResponse.json({ success: false, error: '域名不存在' }, { status: 404 });
      }
      
      const certInfo = await checkCertificate(domain.domain);
      
      const updatedDomain = await Domain.findByIdAndUpdate(id, {
        expiryDate: certInfo.expiryDate,
        issuer: certInfo.issuer,
        lastChecked: new Date(),
        certCheckError: null
      }, { new: true });
      
      return NextResponse.json(updatedDomain);
    } catch (error) {
      console.error('证书检查失败:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
  } else {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
