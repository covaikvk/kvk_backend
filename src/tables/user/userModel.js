const connectDB = require("../../config/db");

const User = {
  // ➕ Create user
  create: async (user, callback) => {
    try {
      const db = await connectDB();
      const sql = "INSERT INTO users (name, phonenumber, password) VALUES (?, ?, ?)";
      const [result] = await db.query(sql, [user.name, user.phonenumber, user.password]);
      callback(null, result);
    } catch (err) {
      callback(err);
    }
  },

  // 🔍 Find user by phone number
  findByPhone: async (phonenumber, callback) => {
    try {
      const db = await connectDB();
      const sql = "SELECT * FROM users WHERE phonenumber = ?";
      const [rows] = await db.query(sql, [phonenumber]);
      callback(null, rows);
    } catch (err) {
      callback(err);
    }
  },

  // 🔍 Find user by ID
  findById: async (id, callback) => {
    try {
      const db = await connectDB();
      const sql = "SELECT id, name, phonenumber, password FROM users WHERE id = ?";
      const [rows] = await db.query(sql, [id]);
      callback(null, rows);
    } catch (err) {
      callback(err);
    }
  },

  // 🔑 Update password using phone number (for Forgot Password)
  updatePassword: async (phonenumber, hashedPassword, callback) => {
    try {
      const db = await connectDB();
      const sql = "UPDATE users SET password = ? WHERE phonenumber = ?";
      const [result] = await db.query(sql, [hashedPassword, phonenumber]);
      callback(null, result);
    } catch (err) {
      callback(err);
    }
  }
};

module.exports = User;
