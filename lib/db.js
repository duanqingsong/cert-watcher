const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

let db = null;

async function getDb() {
  if (db) {
    return db;
  }
  
  try {
    db = await open({
      filename: './domains.sqlite',
      driver: sqlite3.Database
    });
    
    await db.exec(`
      CREATE TABLE IF NOT EXISTS domains (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        domain TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        note TEXT,
        expiryDate TEXT,
        lastChecked TEXT,
        issuer TEXT,
        certCheckError TEXT
      )
    `);

    return db;
  } catch (error) {
    console.error('数据库连接失败:', error);
    throw error;
  }
}

module.exports = getDb;
