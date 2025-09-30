// controllers/menuController.js
const connectDB = require("../../../src/config/db");

//////////////////////////
// MENUNAME TABLE CRUD
//////////////////////////

// Get all menu items
exports.getMenus = async (req, res) => {
  try {
    const connection = await connectDB();
    const [rows] = await connection.query("SELECT * FROM menuname");
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get single menu item by ID
exports.getMenuById = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await connectDB();
    const [rows] = await connection.query("SELECT * FROM menuname WHERE id = ?", [id]);

    if (rows.length === 0) return res.status(404).json({ message: "Menu not found" });

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Create a new menu item
exports.createMenu = async (req, res) => {
  try {
    const { name, image_url, banner_url } = req.body;

    if (!name) return res.status(400).json({ message: "Name is required" });

    const connection = await connectDB();
    const [result] = await connection.query(
      "INSERT INTO menuname (name, image_url, banner_url) VALUES (?, ?, ?)",
      [name, image_url || null, banner_url || null]
    );

    res.status(201).json({ id: result.insertId, name, image_url, banner_url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update a menu item
exports.updateMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image_url, banner_url } = req.body;

    const connection = await connectDB();
    const [result] = await connection.query(
      "UPDATE menuname SET name = ?, image_url = ?, banner_url = ? WHERE id = ?",
      [name, image_url, banner_url, id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "Menu not found" });

    res.status(200).json({ message: "Menu updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete a menu item
exports.deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await connectDB();
    const [result] = await connection.query("DELETE FROM menuname WHERE id = ?", [id]);

    if (result.affectedRows === 0) return res.status(404).json({ message: "Menu not found" });

    res.status(200).json({ message: "Menu deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

//////////////////////////
// MENULIST TABLE CRUD
//////////////////////////

// Get all menu list items
exports.getMenuList = async (req, res) => {
  try {
    const connection = await connectDB();
    const [rows] = await connection.query("SELECT * FROM menulist");
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get single menu list item by ID
exports.getMenuListById = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await connectDB();
    const [rows] = await connection.query("SELECT * FROM menulist WHERE id = ?", [id]);

    if (rows.length === 0) return res.status(404).json({ message: "Menu list item not found" });

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Create a new menu list item
exports.createMenuList = async (req, res) => {
  try {
    const { menuname_id, title, description, price, image_url, type } = req.body;

    if (!menuname_id || !title || !price) 
      return res.status(400).json({ message: "menuname_id, title, and price are required" });

    const connection = await connectDB();
    const [result] = await connection.query(
      "INSERT INTO menulist (menuname_id, title, description, price, image_url, type) VALUES (?, ?, ?, ?, ?, ?)",
      [menuname_id, title, description || null, price, image_url || null, type || "veg"]
    );

    res.status(201).json({ id: result.insertId, menuname_id, title, description, price, image_url, type });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update a menu list item
exports.updateMenuList = async (req, res) => {
  try {
    const { id } = req.params;
    const { menuname_id, title, description, price, image_url, type } = req.body;

    const connection = await connectDB();
    const [result] = await connection.query(
      "UPDATE menulist SET menuname_id = ?, title = ?, description = ?, price = ?, image_url = ?, type = ? WHERE id = ?",
      [menuname_id, title, description, price, image_url, type, id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "Menu list item not found" });

    res.status(200).json({ message: "Menu list item updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete a menu list item
exports.deleteMenuList = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await connectDB();
    const [result] = await connection.query("DELETE FROM menulist WHERE id = ?", [id]);

    if (result.affectedRows === 0) return res.status(404).json({ message: "Menu list item not found" });

    res.status(200).json({ message: "Menu list item deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};




// Get all menu items by menuname_id
exports.getMenuListByMenuId = async (req, res) => {
  try {
    const { menuname_id } = req.params;

    const connection = await connectDB();
    const [rows] = await connection.query(
      "SELECT * FROM menulist WHERE menuname_id = ?",
      [menuname_id]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: "No menu items found for this menu" });

    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
