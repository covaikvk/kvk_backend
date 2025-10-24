const connectDB = require("../../config/db");

// ✅ Add a new favourite
exports.addFavourite = async (req, res) => {
  const { name, image_url, price, type } = req.body;
  const user_id = req.user.id; // ✅ get from JWT

  if (!name || !price || !type) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const db = await connectDB();

    // Prevent duplicate favourites by name
    const [existing] = await db.query(
      "SELECT * FROM favorites WHERE user_id = ? AND name = ?",
      [user_id, name]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "Item already in favourites" });
    }

    await db.query(
      "INSERT INTO favorites (user_id, name, image_url, price, type) VALUES (?, ?, ?, ?, ?)",
      [user_id, name, image_url, price, type]
    );

    res.status(201).json({ message: "Item added to favourites successfully" });
  } catch (error) {
    console.error("❌ Error adding favourite:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get all favourites
exports.getFavourites = async (req, res) => {
  try {
    const db = await connectDB();
    const user_id = req.user.id;

    const [rows] = await db.query(
      "SELECT id, name, image_url, price, type, created_at FROM favorites WHERE user_id = ? ORDER BY created_at DESC",
      [user_id]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error("❌ Error fetching favourites:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Remove a favourite
exports.removeFavourite = async (req, res) => {
  const { name } = req.body;
  const user_id = req.user.id;

  if (!name) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const db = await connectDB();
    const [result] = await db.query(
      "DELETE FROM favorites WHERE user_id = ? AND name = ?",
      [user_id, name]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Favourite not found" });
    }

    res.status(200).json({ message: "Item removed from favourites successfully" });
  } catch (error) {
    console.error("❌ Error removing favourite:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Check if an item is in favourites
exports.checkFavourite = async (req, res) => {
  const { name } = req.query;
  const user_id = req.user.id;

  if (!name) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const db = await connectDB();
    const [rows] = await db.query(
      "SELECT * FROM favorites WHERE user_id = ? AND name = ?",
      [user_id, name]
    );

    res.status(200).json({ exists: rows.length > 0 });
  } catch (error) {
    console.error("❌ Error checking favourite:", error);
    res.status(500).json({ message: "Server error" });
  }
};
