const express = require("express");
const router = express.Router();
const verifyToken = require("../../middlewares/verifyToken");
const connectDB = require("../../config/db");

const {
  addMenuItem,
  getMenuItems,
  updateMenuItem,
  getMenuItemsByUserId,
  deleteMenuItem,
} = require("./customizeMenuController");

// 🔓 PUBLIC ROUTE — Anyone can view all menus
router.get("/", getMenuItems);

// 🔒 PROTECTED ROUTES — Token required
router.post("/", verifyToken, addMenuItem);
router.put("/:id", verifyToken, updateMenuItem);
router.delete("/:id", verifyToken, deleteMenuItem);


// 🔒 GET MENUS BY USER ID — Token required
router.get("/user/:user_id", verifyToken, getMenuItemsByUserId);

// 🔒 GET SINGLE MENU (still protected)
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const connection = await connectDB();
    const user_id = req.params.id;
    const menu_id = req.params.id;

    const [rows] = await connection.query(
      "SELECT * FROM customize_menu WHERE  user_id = ?",
      [ user_id]
    );

    if (rows.length === 0)
      return res.status(404).json({ msg: "Menu not found" });

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
