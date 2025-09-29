// todayspecial/todayspecialController.js
const connectDB = require("../../config/db");

// Get all specials (with optional type filter: veg/non-veg)
exports.getAllSpecials = async (req, res) => {
  try {
    const { type } = req.query;
    const connection = await connectDB();

    let query = "SELECT * FROM todayspecial";
    const params = [];

    if (type && ["veg", "non-veg"].includes(type)) {
      query += " WHERE type = ?";
      params.push(type);
    }

    query += " ORDER BY created_at DESC";

    const [rows] = await connection.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching specials", error: err.message });
  }
};

// Get a single special by ID
exports.getSpecialById = async (req, res) => {
  try {
    const connection = await connectDB();
    const [rows] = await connection.query("SELECT * FROM todayspecial WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0) return res.status(404).json({ message: "Special not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Error fetching special", error: err.message });
  }
};

// Create a new special
exports.createSpecial = async (req, res) => {
  try {
    const { title, description, price, image_url, type } = req.body;

    if (!title || !price)
      return res.status(400).json({ message: "Title and price are required" });
    if (type && !["veg", "non-veg"].includes(type)) {
      return res.status(400).json({ message: "Invalid type. Allowed values: veg, non-veg" });
    }

    const connection = await connectDB();
    await connection.query(
      "INSERT INTO todayspecial (title, description, price, image_url, type) VALUES (?, ?, ?, ?, ?)",
      [title, description, price, image_url, type || "veg"]
    );
    res.status(201).json({ message: "Special created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error creating special", error: err.message });
  }
};

// Update a special by ID
exports.updateSpecial = async (req, res) => {
  try {
    const { title, description, price, image_url, type } = req.body;

    if (type && !["veg", "non-veg"].includes(type)) {
      return res.status(400).json({ message: "Invalid type. Allowed values: veg, non-veg" });
    }

    const connection = await connectDB();
    const [result] = await connection.query(
      "UPDATE todayspecial SET title=?, description=?, price=?, image_url=?, type=? WHERE id=?",
      [title, description, price, image_url, type || "veg", req.params.id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Special not found" });
    res.json({ message: "Special updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error updating special", error: err.message });
  }
};

// Delete a special by ID
exports.deleteSpecial = async (req, res) => {
  try {
    const connection = await connectDB();
    const [result] = await connection.query("DELETE FROM todayspecial WHERE id = ?", [
      req.params.id,
    ]);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Special not found" });
    res.json({ message: "Special deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting special", error: err.message });
  }
};
