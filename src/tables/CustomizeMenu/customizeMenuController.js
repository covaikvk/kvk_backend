const connectDB = require("../../config/db");

// Add Customize Menu
const addMenuItem = async (req, res) => {
  try {

    const connection = await connectDB();
    const user_id = req.user?.id || 18; // for testing without token

    const {
      sunday, monday, tuesday, wednesday, thursday, friday, saturday,
      name, phone_number, whatsapp_number, address_1, address_2,
      pincode, city, state, landmark, number_of_persons, total, gst, grand_total
    } = req.body;

    if (!name) return res.status(400).json({ msg: "Name is required" });

    const query = `
      INSERT INTO customize_menu (
        user_id, sunday, monday, tuesday, wednesday, thursday, friday, saturday,
        name, phone_number, whatsapp_number, address_1, address_2, pincode, city,
        state, landmark, number_of_persons, total, gst, grand_total
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      user_id,
      JSON.stringify(sunday || {}),
      JSON.stringify(monday || {}),
      JSON.stringify(tuesday || {}),
      JSON.stringify(wednesday || {}),
      JSON.stringify(thursday || {}),
      JSON.stringify(friday || {}),
      JSON.stringify(saturday || {}),
      name,
      phone_number,
      whatsapp_number,
      address_1,
      address_2,
      pincode,
      city,
      state,
      landmark,
      number_of_persons,
      total,
      gst,
      grand_total
    ];

    const [result] = await connection.query(query, values);
    res.status(201).json({ msg: "Customize menu added", id: result.insertId });
  } catch (error) {
    console.error("❌ Error adding menu:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};


// Get all customize menus (public)
const getMenuItems = async (req, res) => {
  try {
    const connection = await connectDB();

    // 🔓 Fetch all records (no user token needed)
    const [rows] = await connection.query(
      "SELECT * FROM customize_menu ORDER BY created_at DESC"
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Update a menu
const updateMenuItem = async (req, res) => {
  try {
    const connection = await connectDB();
    const user_id = req.user.id;
    const menu_id = req.params.id;

    const fields = req.body;
    const values = Object.values(fields);
    const setQuery = Object.keys(fields).map(k => `${k} = ?`).join(", ");

    const [result] = await connection.query(
      `UPDATE customize_menu SET ${setQuery} WHERE id = ? AND user_id = ?`,
      [...values, menu_id, user_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Menu not found or not yours" });
    }

    res.json({ msg: "Menu updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// Delete a menu
const deleteMenuItem = async (req, res) => {
  try {
    const connection = await connectDB();
    const user_id = req.user.id;
    const menu_id = req.params.id;

    const [result] = await connection.query(
      "DELETE FROM customize_menu WHERE id = ? AND user_id = ?",
      [menu_id, user_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Menu not found or not yours" });
    }

    res.json({ msg: "Menu deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = {
  addMenuItem,
  getMenuItems,
  updateMenuItem,
  deleteMenuItem,
};
