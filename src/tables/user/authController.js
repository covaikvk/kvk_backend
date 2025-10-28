const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./userModel");

// Signup
exports.signup = (req, res) => {
  const { name, phonenumber, password } = req.body;

  if (!name) {
    return res.status(400).json({ msg: "Name is required" });
  }
  if (!phonenumber) {
    return res.status(400).json({ msg: "Phone number is required" });
  }
  if (!password) {
    return res.status(400).json({ msg: "Password is required" });
  }

  User.findByPhone(phonenumber, async (err, results) => {
    if (err) {
      console.error("❌ DB error in findByPhone:", err);
      return res.status(500).json({ msg: "DB error" });
    }
    if (results.length > 0) {
      return res.status(400).json({ msg: "Phone number already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    User.create({ name, phonenumber, password: hashedPassword }, (err, result) => {
      if (err) {
        console.error("❌ DB error in create:", err);
        return res.status(500).json({ msg: "DB error" });
      }
      res.status(201).json({ msg: "User registered successfully" });
    });
  });
};

// Login
exports.login = (req, res) => {
  const { phonenumber, password } = req.body;

  if (!phonenumber || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  User.findByPhone(phonenumber, async (err, results) => {
    if (err) return res.status(500).json({ msg: "DB error" });
    if (results.length === 0) return res.status(400).json({ msg: "User not found" });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
  });
};

// Get User Info
exports.getUser = (req, res) => {
  const userId = req.user.id;

  User.findById(userId, (err, results) => {
    if (err) return res.status(500).json({ msg: "DB error" });
    if (results.length === 0) return res.status(404).json({ msg: "User not found" });

    const { id, name, phonenumber } = results[0];
    res.json({ id, name, phonenumber });
  });
};

// ✅ Forgot Password (via Mobile)
exports.forgotPassword = (req, res) => {
  const { phonenumber, newPassword, confirmPassword } = req.body;

  if (!phonenumber || !newPassword || !confirmPassword) {
    return res.status(400).json({ msg: "All fields are required" });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ msg: "Passwords do not match" });
  }

  User.findByPhone(phonenumber, async (err, results) => {
    if (err) {
      console.error("❌ DB error in forgotPassword:", err);
      return res.status(500).json({ msg: "DB error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ msg: "User not found with this mobile number" });
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      User.updatePassword(phonenumber, hashedPassword, (err2, result) => {
        if (err2) {
          console.error("❌ DB error in updatePassword:", err2);
          return res.status(500).json({ msg: "DB error while updating password" });
        }
        res.json({ msg: "Password updated successfully" });
      });
    } catch (error) {
      console.error("❌ Error in hashing password:", error);
      res.status(500).json({ msg: "Internal server error" });
    }
  });
};
