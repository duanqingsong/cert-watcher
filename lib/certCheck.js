const https = require('https');
const { getAllDomains, updateDomain, getDomainById } = require('../models/Domain');
const tls = require('tls');
const dns = require('dns').promises;

async function checkCertificate(domain) {
  try {
    // 首先尝试解析域名
    await dns.lookup(domain);

    return new Promise((resolve, reject) => {
      const socket = tls.connect(443, domain, { servername: domain }, () => {
        try {
          const cert = socket.getPeerCertificate();
          if (cert.raw) {
            const expiryDate = new Date(cert.valid_to).toISOString();
            const issuer = cert.issuer.O || 'Unknown';
            socket.destroy();
            resolve({ expiryDate, issuer });
          } else {
            socket.destroy();
            reject(new Error('无法获取证书信息'));
          }
        } catch (error) {
          socket.destroy();
          reject(error);
        }
      });

      socket.on('error', (error) => {
        reject(error);
      });
    });
  } catch (error) {
    if (error.code === 'ENOTFOUND') {
      throw new Error(`域名 ${domain} 无法解析，请检查域名是否正确`);
    }
    throw error;
  }
}

async function updateDomainCertInfo(domainId) {
  try {
    const domain = await getDomainById(domainId);
    if (!domain) {
      throw new Error('域名不存在');
    }

    const certInfo = await checkCertificate(domain.domain);
    
    await updateDomain(domainId, {
      expiryDate: certInfo.expiryDate,
      issuer: certInfo.issuer,
      lastChecked: new Date().toISOString(),
      certCheckError: null
    });

    console.log(`域名 ${domain.domain} 的证书信息已更新`);
  } catch (error) {
    console.error(`更新域名 ${domain.domain} 的证书信息失败:`, error);
    await updateDomain(domainId, {
      lastChecked: new Date().toISOString(),
      certCheckError: error.message
    });
  }
}

async function performCertificateCheck() {
  try {
    const domains = await getAllDomains();
    for (const domain of domains) {
      await updateDomainCertInfo(domain.id);
    }
    console.log('所有证书检查完成');
  } catch (error) {
    console.error('执行证书检查发生错误:', error);
    throw error;
  }
}

async function checkAndUpdateDomain(domainId) {
  await updateDomainCertInfo(domainId);
}

module.exports = { 
  checkCertificate, 
  updateDomainCertInfo, 
  performCertificateCheck, 
  checkAndUpdateDomain 
};
