const express = require("express");
const router = express.Router();
const {
  addFoodCategory,
  getAllFoodCategories,
  getFoodCategoryById,
  editFoodCategory,
  deleteFoodCategory,
  addFoodItem,
  getAllFoodItems,
  getFoodItemById,
  editFoodItem,
  deleteFoodItem,
  getCombinedFoodData,
  getFoodItemsByCategoryId,
  getFoodItemsByCategory, // ✅ new function for category-based items
} = require("./foodsController");

// ===========================
// Food Category Routes
// ===========================
router.post("/category", addFoodCategory);
router.get("/category", getAllFoodCategories);
router.get("/category/:id", getFoodCategoryById);
router.put("/category/:id", editFoodCategory);
router.delete("/category/:id", deleteFoodCategory);

// ===========================
// Food Items Routes
// ===========================
// ✅ Fetch items by category ID
router.get("/item/category/:id", getFoodItemsByCategory);

router.post("/item", addFoodItem);
router.get("/item", getAllFoodItems);
router.get("/item/:id", getFoodItemById);
router.put("/item/:id", editFoodItem);
router.delete("/item/:id", deleteFoodItem);


// ===========================
// Combined GET (categories + items)
// ===========================
router.get("/combined", getCombinedFoodData);

module.exports = router;
