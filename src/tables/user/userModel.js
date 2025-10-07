const connectDB = require("../../../src/config/db");

const User = {
  create: async (user, callback) => {
    const db = await connectDB(); // ✅ FIXED
    const sql = "INSERT INTO users (name, phonenumber, password) VALUES (?, ?, ?)";
    db.query(sql, [user.name, user.phonenumber, user.password])
      .then(([result]) => callback(null, result))
      .catch(err => callback(err));
  },

  findByPhone: async (phonenumber, callback) => {
    const db = await connectDB(); // ✅ FIXED
    const sql = "SELECT * FROM users WHERE phonenumber = ?";
    db.query(sql, [phonenumber])
      .then(([rows]) => callback(null, rows))
      .catch(err => callback(err));
  },

  findById: async (id, callback) => {
    const db = await connectDB(); // ✅ FIXED
    const sql = "SELECT id, name, phonenumber, password FROM users WHERE id = ?";
    db.query(sql, [id])
      .then(([rows]) => callback(null, rows))
      .catch(err => callback(err));
  }
};

module.exports = User;
