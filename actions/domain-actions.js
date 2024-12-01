'use server'

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/index"
import { checkCertificate } from '@/lib/certCheck'
import { updateDomain, getAllDomains, getDomainById, createDomain, getDomainsByUserId, deleteDomainById } from '@/models/Domain'

/**
 * 获取所有域名
 * @returns 
 */
export async function getAllDomain() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return {success:1,data:'',message:'未授权'}
  }
  const domains = await getAllDomains();
  const data=JSON.parse(JSON.stringify(domains)) 
  return {success:1,data,message:''}
}

/**
 * 保存域名(新增或更新)
 * @param {*} data 
 * @returns 
 */
export async function saveDomain(data) {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('未授权')
  }
  let newData=null;
  if (data.id) {
    newData= await updateDomain(data.id, {
      name: data.name,
      domain: data.domain,
      note: data.note
    })
  } else {
    newData= await createDomain({
      name: data.name,
      domain: data.domain,
      note: data.note
    })
  }
  if(newData&&newData.id){
    await checkDomainById(newData.id)
  }
  return {success:1,data:newData,message:''}
}

/**
 * 删除域名
 * @param {*} id 
 * @returns 
 */
export async function deleteDomain(id) {
  const session = await getServerSession(authOptions)
  if (!session) {
    console.error('未授权')
    return {success:0,data:'',message:'未授权'}
  }
  await deleteDomainById(id)
  return {success:1,data:'',message:''}
}

/**
 * 分页获取域名
 * @param {*} page 
 * @param {*} pageSize 
 * @returns 
 */
export async function pageDomains(page, pageSize) {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('未授权')
  }

  return await getDomainsByUserId(session.user.id, page, pageSize)
}

/**
 * 通过id获取域名
 * @param {*} id 
 * @returns 
 */
export async function getDomain(id) {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('未授权')
  }

  return await getDomainById(id)
}

/**
 * 检查域名证书,并保存更新情况到数据库
 * @param {*} id 
 * @returns 
 */
export async function checkDomainById(id) {
  const session = await getServerSession(authOptions)
  if (!session) {
    throw new Error('未授权')
  }

  try {
    const domain = await getDomainById(id)
    if (!domain) {
      return { success: 0, message: '域名不存在' }
    }

    let certInfo = null;
    let certError = null;
    try {
      certInfo = await checkCertificate(domain.domain);
      //certInfo=> { expiryDate: '2025-01-07T00:27:52.000Z', issuer: "Let's Encrypt" }
    } catch (error) {
      console.error(`${domain.domain}证书检查失败:`, error);
      certError = error.message;
      return { success: 0, message: certError };
    }
    await updateDomain(id, {
      lastChecked: new Date().toISOString(),
      certCheckError: certError,
      issuer: certInfo ? certInfo.issuer : null,
      expiryDate: certInfo ? certInfo.expiryDate : null,
    });
    return { success: 1, message: '证书状态已更新' }
  } catch (error) {
    return { success: 0, message: '服务器内部错误' };
  }
}

/**
 * 检查所有证书
 * @returns 
 */
export async function checkAllDomain() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return {success:1,data:'',message:'未授权'}
  }
  let domains = await getAllDomains();
  domains=JSON.parse(JSON.stringify(domains))
  for (const domain of domains) {
    try {
      await checkDomainById(domain.id);
    } catch (error) {
      console.error('检查域名证书失败:', error);
      return {success:1,data:'',message:`检查域名证书${domain.domain}失败:${error}`}
    }
  } 
  return {success:1,data:'',message:''}
}