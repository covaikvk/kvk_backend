// todayspecial/todayspecialRoutes.js
const express = require("express");
const router = express.Router();
const controller = require("./todayspecialController");

// Get all specials (optional filter: veg/non-veg)
router.get("/", controller.getAllSpecials);

// Get single special by ID
router.get("/:id", controller.getSpecialById);

// Create new special
router.post("/", controller.createSpecial);

// Update special by ID
router.put("/:id", controller.updateSpecial);

// Delete special by ID
router.delete("/:id", controller.deleteSpecial);

module.exports = router;
