const getDb = require('../lib/db');

/**
 * 获取所有域名
 * @returns 
 */
async function getAllDomains() {
  const db = await getDb();
  return db.all('SELECT * FROM domains order by expiryDate');
}

/**
 * 获取用戶的所有域名
 * @returns 
 */
async function getDomainsByUserId(userId) {
  const db = await getDb();
  return db.all('SELECT * FROM domains WHERE userId=? order by expiryDate',userId);
}

/**
 * 通过ID获取域名
 * @param {*} id 
 * @returns 
 */
async function getDomainById(id) {
  const db = await getDb();
  return db.get('SELECT * FROM domains WHERE id = ?', id);
}

/**
 * 创建域名
 * @param {*} domainData 
 * @returns 
 */
async function createDomain(domainData) {
  const db = await getDb();
  const { lastID } = await db.run(
    'INSERT INTO domains (domain,userId, name, note, expiryDate, issuer, lastChecked, certCheckError) VALUES (?, ?,?, ?, ?, ?, ?, ?)',
    [domainData.domain, domainData.userId, domainData.name, domainData.note, domainData.expiryDate, domainData.issuer, domainData.lastChecked, domainData.certCheckError]
  );
  return getDomainById(lastID);
}

/**
 * 修改域名
 * @param {*} id 
 * @param {*} updateData 
 * @returns 
 */
async function updateDomain(id, updateData) {
  const db = await getDb();
  const keys = Object.keys(updateData);
  const values = Object.values(updateData);
  const setClause = keys.map(key => `${key} = ?`).join(', ');
  await db.run(`UPDATE domains SET ${setClause} WHERE id = ?`, [...values, id]);
  return getDomainById(id);
}

/**
 * 删除域名
 * @param {*} id 
 */
async function deleteDomainById(id) {
  const db = await getDb();
  await db.run('DELETE FROM domains WHERE id = ?', id);
}

/**
 * 通过域名查询域名信息
 * @param {*} domain 
 * @returns 
 */
async function getDomainByDomainName(domain) {
  const db = await getDb();
  return db.get('SELECT * FROM domains WHERE domain = ?', domain);
}


module.exports = {
  getAllDomains,
  getDomainsByUserId,
  getDomainById,
  createDomain,
  updateDomain,
  deleteDomainById,
  getDomainByDomainName,
};
