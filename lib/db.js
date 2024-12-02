const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

let db = null;

async function getDb() {
  if (db) {
    return db;
  }
  
  try {
    db = await open({
      filename: path.join(process.cwd(), 'domains.sqlite'),
      driver: sqlite3.Database
    });
    
    // 创建 domains 表（保持原有功能）
    await db.exec(`
      CREATE TABLE IF NOT EXISTS domains (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL DEFAULT 0,
        domain TEXT  NOT NULL,
        name TEXT NOT NULL,
        note TEXT,
        expiryDate TEXT,
        lastChecked TEXT,
        issuer TEXT,
        certCheckError TEXT
      )
    `);

    // 创建 users 表
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        nickname TEXT,
        isEmailVerified INTEGER DEFAULT 0,
        emailVerificationToken TEXT,
        emailVerificationExpires INTEGER,
        resetPasswordToken TEXT,
        resetPasswordExpires INTEGER,
        createdAt INTEGER DEFAULT (unixepoch())
      )
    `);

    return db;
  } catch (error) {
    console.error('数据库连接失败:', error);
    throw error;
  }
}

module.exports = getDb;
