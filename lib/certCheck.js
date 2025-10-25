const { getAllDomains, updateDomain, getDomainById } = require('../models/Domain');
const tls = require('tls');
const dns = require('dns').promises;

//此模块兼容node环境

/**
 * 获取域名的证书信息
 * @param {*} domain 
 * @returns 
 */
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

/**
 * 获取域名证书信息后,更新到数据表中
 * @param {*} domainId 
 */
async function updateDomainCertInfo(domainId) {
  const domain = await getDomainById(domainId);
  try {
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

  } catch (error) {
    // 简化错误日志，只输出关键信息
    const errorMessage = error.code === 'ERR_TLS_CERT_ALTNAME_INVALID' 
      ? `证书主机名不匹配: ${error.reason}`
      : error.message;
    
    console.error(`更新域名 ${domain.domain} 的证书信息失败: ${errorMessage}`);
    
    await updateDomain(domainId, {
      lastChecked: new Date().toISOString(),
      certCheckError: errorMessage
    });
  }
}


/**
 * 执行所有域名的证书检查
 */
async function performCertificateCheck() {
  try {
    const domains = await getAllDomains();
    for (const domain of domains) {
      await updateDomainCertInfo(domain.id);
    }
  } catch (error) {
    console.error('执行证书检查发生错误:', error);
    throw error;
  }
}


/**
 * 发送企业微信群消息
 * @param {*} message 消息内容 
 * @param {*} atMobiles 艾特用户的手机号码，多个用逗号隔开
 * @returns 
 */
async function send2Wechat(message,atMobiles='') {

    // 设置企业微信 Webhook URL
    const hookUrl = ' https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=17fa9bad-e097-4b60-bad0-76df33d0eca0';

    try {
      const content={ msgtype: 'text', text: { content: message} }
      // 设置艾特某些人
      if(atMobiles){
        const ats=atMobiles.split(',')
        content.text.mentioned_mobile_list=ats;
      }
      const response = await fetch(hookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(content)
      });

      console.log(await response.json());
      return { success: 1, data:'success', message: '' };
    } catch (error) {
      console.error(error);
      return{ success: 0, data:'',message: '发送钉钉通知消息失败' };
    }
}

async function notifyCertificateExpiry() {
  try {
    const domains = await getAllDomains();
    for (const domain of domains) {
      try {
        const certInfo = await checkCertificate(domain.domain);
        const expiryDate = certInfo.expiryDate;
        const expiry = new Date(expiryDate);
        const now = new Date();
        const diffTime = expiry - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        console.log(`域名 ${domain.domain} 的证书将在 ${diffDays} 天后过期`);
        // 如果证书将在5天内过期，发送通知
        if (diffDays <= 5) {
          const message = `域名 ${domain.domain} 的证书将于 ${diffDays} 天后过期， 请及时更新证书。`;
          await send2Wechat(message,"13926576007");
        }
      } catch (error) {
        // 单个域名检查失败时，记录错误但继续处理其他域名
        const errorMessage = error.code === 'ERR_TLS_CERT_ALTNAME_INVALID' 
          ? `证书主机名不匹配: ${error.reason}`
          : error.message;
        console.error(`检查域名 ${domain.domain} 证书到期状态失败: ${errorMessage}`);
      }
    }
  } catch (error) {
    console.error('发送域名到期通知时发生错误:', error);
    throw error;
  }
}

module.exports = { 
  checkCertificate, 
  updateDomainCertInfo, 
  performCertificateCheck, 
  notifyCertificateExpiry,
  send2Wechat,
};
