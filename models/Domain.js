const getDb = require('../lib/db');

async function getAllDomains() {
  const db = await getDb();
  return db.all('SELECT * FROM domains');
}

async function getDomainById(id) {
  const db = await getDb();
  return db.get('SELECT * FROM domains WHERE id = ?', id);
}

async function createDomain(domainData) {
  const db = await getDb();
  const { lastID } = await db.run(
    'INSERT INTO domains (domain, name, note, expiryDate, issuer, lastChecked, certCheckError) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [domainData.domain, domainData.name, domainData.note, domainData.expiryDate, domainData.issuer, domainData.lastChecked, domainData.certCheckError]
  );
  return getDomainById(lastID);
}

async function updateDomain(id, updateData) {
  const db = await getDb();
  const keys = Object.keys(updateData);
  const values = Object.values(updateData);
  const setClause = keys.map(key => `${key} = ?`).join(', ');
  await db.run(`UPDATE domains SET ${setClause} WHERE id = ?`, [...values, id]);
  return getDomainById(id);
}

async function deleteDomain(id) {
  const db = await getDb();
  await db.run('DELETE FROM domains WHERE id = ?', id);
}

async function getDomainByDomainName(domain) {
  const db = await getDb();
  return db.get('SELECT * FROM domains WHERE domain = ?', domain);
}

module.exports = {
  getAllDomains,
  getDomainById,
  createDomain,
  updateDomain,
  deleteDomain,
  getDomainByDomainName
};
