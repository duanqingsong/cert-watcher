import getDb from '@/lib/db';
import bcrypt from 'bcryptjs';

export class User {
  static async findByEmail(email) {
    const db = await getDb();
    return db.get('SELECT * FROM users WHERE email = ?', email);
  }

  static async findById(id) {
    const db = await getDb();
    return db.get('SELECT * FROM users WHERE id = ?', id);
  }

  static async findByVerificationToken(token) {
    const db = await getDb();
    return db.get(
      'SELECT * FROM users WHERE emailVerificationToken = ? AND emailVerificationExpires > ?',
      [token, Date.now()]
    );
  }

  static async findByResetToken(token) {
    const db = await getDb();
    return db.get(
      'SELECT * FROM users WHERE resetPasswordToken = ? AND resetPasswordExpires > ?',
      [token, Date.now()]
    );
  }

  static async create(userData) {
    const db = await getDb();
    const { email, password } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.run(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, hashedPassword]
    );

    return this.findById(result.lastID);
  }


  // 更新郵箱验证token
  static async updateVerificationToken(id, token, expires) {
    const db = await getDb();
    return db.run(
      'UPDATE users SET emailVerificationToken = ?, emailVerificationExpires = ? WHERE id = ?',
      [token, expires, id]
    );
  }

  static async verifyEmail(id) {
    const db = await getDb();
    return db.run(
      'UPDATE users SET isEmailVerified = 1, emailVerificationToken = NULL, emailVerificationExpires = NULL WHERE id = ?',
      [id]
    );
  }

  static async updateResetToken(id, token, expires) {
    const db = await getDb();
    return db.run(
      'UPDATE users SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE id = ?',
      [token, expires, id]
    );
  }

  static async updatePassword(id, password) {
    const db = await getDb();
    const hashedPassword = await bcrypt.hash(password, 10);
    return db.run(
      'UPDATE users SET password = ?, resetPasswordToken = NULL, resetPasswordExpires = NULL WHERE id = ?',
      [hashedPassword, id]
    );
  }

  static async updateNickname(id, nickname) {
    const db = await getDb();
    return db.run(
      'UPDATE users SET nickname = ? WHERE id = ?',
      [nickname, id]
    );
  }

  // 用于验证密码
  static async comparePassword(hashedPassword, candidatePassword) {
    return bcrypt.compare(candidatePassword, hashedPassword);
  }
} 