import https from 'https';
import url from 'url';
import dns from 'dns';
import { promisify } from 'util';
import Domain from '@/models/Domain';
import net from 'net';
import tls from 'tls';

const dnsLookup = promisify(dns.lookup);

function cleanCertObject(cert) {
  if (!cert || typeof cert !== 'object') return {};
  const cleanCert = { ...cert };
  delete cleanCert.issuerCertificate;
  delete cleanCert.raw;
  // 递归清理嵌套对象
  for (const key in cleanCert) {
    if (typeof cleanCert[key] === 'object') {
      cleanCert[key] = cleanCertObject(cleanCert[key]);
    }
  }
  return cleanCert;
}

async function checkCertificateWithTimeout(domain, timeout = 30000) {
  // 移除 URL 解析，直接使用传入的域名
  try {
    console.log(`开始解析域名: ${domain}`);
    const { address } = await dnsLookup(domain);
    console.log(`域名 ${domain} 解析到 IP: ${address}`);

    return new Promise((resolve, reject) => {
      const socket = tls.connect({
        host: address,
        port: 443,
        servername: domain,
        rejectUnauthorized: false,
        timeout: timeout
      }, () => {
        const cert = socket.getPeerCertificate(true);
        const cleanedCert = cleanCertObject(cert);
        console.log('清理后的证书信息:', JSON.stringify(cleanedCert, null, 2));

        if (socket.authorized === false) {
          console.error('证书验证失败:', socket.authorizationError);
        }
        
        if (Object.keys(cleanedCert).length === 0) {
          socket.destroy();
          reject(new Error('无法获取证书信息'));
          return;
        }

        let expiryDate = new Date(cleanedCert.valid_to);
        if (isNaN(expiryDate.getTime())) {
          console.error('无效的过期日期:', cleanedCert.valid_to);
          socket.destroy();
          reject(new Error('无效的过期日期'));
          return;
        }
        
        let issuer = 'Unknown';
        if (cleanedCert.issuer && cleanedCert.issuer.O) {
          issuer = cleanedCert.issuer.O;
        }
        console.log('解析后的颁发者:', issuer);
        console.log('解析后的过期日期:', expiryDate);
        
        socket.destroy();
        resolve({
          expiryDate: expiryDate,
          issuer: issuer
        });
      });

      socket.on('error', (e) => {
        console.error(`证书检查错误 (${domain}):`, e);
        socket.destroy();
        reject(new Error(`证书检查失败: ${e.message}`));
      });

      socket.on('timeout', () => {
        console.error(`证书检查超时 (${domain})`);
        socket.destroy();
        reject(new Error('证书检查超时'));
      });
    });
  } catch (error) {
    console.error(`域名解析失败: ${domain}`, error);
    throw new Error(`域名解析失败: ${error.message}`);
  }
}

export async function checkCertificate(domain, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`尝试检查证书 (尝试 ${i + 1}/${retries}):`, domain);
      const result = await checkCertificateWithTimeout(domain);
      console.log('证书检查成功');
      return result;
    } catch (error) {
      console.error(`证书检查失败 (尝试 ${i + 1}/${retries}):`, error);
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

export async function updateDomainCertInfo(domainId) {
  const domain = await Domain.findById(domainId);
  if (!domain) {
    console.error('域名不存在:', domainId);
    throw new Error('域名不存在');
  }

  try {
    console.log('开始更新域名证书信息:', domain.domain);
    const { expiryDate, issuer } = await checkCertificate(domain.domain);
    console.log('证书信息获取成功:', { expiryDate, issuer });
    
    const updateData = {
      issuer,
      expiryDate,
      lastChecked: new Date()
    };
    
    const updatedDomain = await Domain.findByIdAndUpdate(domainId, updateData, { new: true });
    console.log('域名信息更新成功:', updatedDomain);
    return updatedDomain;
  } catch (error) {
    console.error(`检查证书失败: ${domain.domain}`, error);
    throw error;
  }
}
