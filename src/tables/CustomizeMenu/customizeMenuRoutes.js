const express = require("express");
const router = express.Router();
const verifyToken = require("../../middlewares/verifyToken");

const {
  addMenuItem,
  getMenuItems,
  updateMenuItem,
  deleteMenuItem,
} = require("./customizeMenuController");

// CRUD Routes
router.post("/", verifyToken, addMenuItem);          // Create
router.get("/", verifyToken, getMenuItems);         // Read all
router.get("/:id", verifyToken, async (req, res) => { // Read one
  try {
    const connection = await require("../../config/db")();
    const user_id = req.user.id;
    const menu_id = req.params.id;
    const [rows] = await connection.query(
      "SELECT * FROM customize_menu WHERE id = ? AND user_id = ?",
      [menu_id, user_id]
    );
    if (rows.length === 0) return res.status(404).json({ msg: "Menu not found" });
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});
router.put("/:id", verifyToken, updateMenuItem);       // Update
router.delete("/:id", verifyToken, deleteMenuItem);    // Delete

module.exports = router;
