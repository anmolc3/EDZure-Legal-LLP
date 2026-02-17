const db = require('../config/db');
const bcrypt = require('bcryptjs');

class Admin {
  // Find admin by email
  static async findByEmail(email) {
    try {
      const [rows] = await db.query('SELECT * FROM admins WHERE email = ?', [email]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Find admin by username
  static async findByUsername(username) {
    try {
      const [rows] = await db.query('SELECT * FROM admins WHERE username = ?', [username]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Find admin by ID
  static async findById(id) {
    try {
      const [rows] = await db.query('SELECT id, username, email, created_at FROM admins WHERE id = ?', [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Create new admin
  static async create(username, email, password) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      const [result] = await db.query(
        'INSERT INTO admins (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword]
      );
      
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  // Compare password
  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Update admin
  static async update(id, updates) {
    try {
      const fields = [];
      const values = [];

      if (updates.username) {
        fields.push('username = ?');
        values.push(updates.username);
      }
      if (updates.email) {
        fields.push('email = ?');
        values.push(updates.email);
      }
      if (updates.password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(updates.password, salt);
        fields.push('password = ?');
        values.push(hashedPassword);
      }

      values.push(id);

      const [result] = await db.query(
        `UPDATE admins SET ${fields.join(', ')} WHERE id = ?`,
        values
      );

      return result.affectedRows;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Admin;